<!-- src/lib/components/Common/ConfirmAlertDialog.svelte -->
<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { confirmStore } from "$lib/store/confirmStore.svelte";
</script>

<AlertDialog.Root
  open={confirmStore.isOpen}
  onOpenChange={(open) => {
    if (!open) confirmStore.resolve(false);
  }}
>
  <AlertDialog.Content data-component="ConfirmAlertDialog" class="m-1 z-999">
    <AlertDialog.Header>
      <AlertDialog.Title>{confirmStore.title}</AlertDialog.Title>
      {#if confirmStore.description}
        <AlertDialog.Description>
          {confirmStore.description}
        </AlertDialog.Description>
      {/if}
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel onclick={() => confirmStore.resolve(false)}>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action onclick={() => confirmStore.resolve(true)}>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
