<!-- src/App.svelte -->
<script lang="ts">
  import ConfirmAlertDialog from "$lib/components/Common/ConfirmAlertDialog.svelte";
  import Main from "$lib/components/Main/Main.svelte";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import { handleAutoBackup } from "$lib/handlers";
  import { requestPersistentStorage } from "$lib/pwaUtils";
  import { ModeWatcher } from "mode-watcher";
  import { onMount } from "svelte";
  import PWABadge from "./lib/components/PWABadge.svelte";

  onMount(() => {
    requestPersistentStorage();

    handleAutoBackup();
    setInterval(() => handleAutoBackup(), 30 * 60 * 60 * 1000);
  });
</script>

<ModeWatcher themeColors={{ dark: "black", light: "white" }} />
<Toaster
  position="top-center"
  pauseWhenPageIsHidden
  expand
  swipeDirections={["top"]}
  toastOptions={{ class: "pointer-events-auto!", descriptionClass: "pointer-events-auto!" }}
/>
<PWABadge />
<ConfirmAlertDialog />

<main>
  <Main />
</main>
