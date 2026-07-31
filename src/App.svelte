<!-- src/App.svelte -->
<script lang="ts">
  import PWABadge from "./lib/components/PWABadge.svelte";
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import Main from "$lib/components/Main/Main.svelte";
  import ConfirmAlertDialog from "$lib/components/Common/ConfirmAlertDialog.svelte";
  import { onMount } from "svelte";
  import { requestPersistentStorage } from "$lib/pwaUtils";

  onMount(() => {
    requestPersistentStorage();
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
