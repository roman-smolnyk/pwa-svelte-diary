<script lang="ts">
  import { toast } from "svelte-sonner";
  import { useRegisterSW } from "virtual:pwa-register/svelte";

  // check for updates every hour
  const period = 60 * 60 * 1000;

  function registerPeriodicSync(swUrl: string, r: ServiceWorkerRegistration) {
    if (period <= 0) return;

    setInterval(async () => {
      if ("onLine" in navigator && !navigator.onLine) return;

      const resp = await fetch(swUrl, {
        cache: "no-store",
        headers: {
          cache: "no-store",
          "cache-control": "no-cache",
        },
      });

      if (resp?.status === 200) await r.update();
    }, period);
  }

  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;
      if (r?.active?.state === "activated") {
        registerPeriodicSync(swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener("statechange", (e) => {
          const sw = e.target as ServiceWorker;
          if (sw.state === "activated") registerPeriodicSync(swUrl, r);
        });
      }
    },
  });

  $effect(() => {
    if ($offlineReady) {
      toast.success("App ready to work offline", {
        action: {
          label: "Close",
          onClick: () => offlineReady.set(false),
        },
        onDismiss: () => offlineReady.set(false),
      });
    }
  });

  $effect(() => {
    if ($needRefresh) {
      toast.info("New content available, click on reload button to update.", {
        important: true,
        duration: Infinity,
        action: {
          label: "Reload",
          onClick: () => updateServiceWorker(true),
        },
        cancel: {
          label: "Close",
          onClick: () => needRefresh.set(false),
        },
      });
    }
  });
</script>
