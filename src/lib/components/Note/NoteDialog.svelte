<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";

  let { isOpen: isOpen$ = $bindable(false), date }: { isOpen: boolean; date: string } = $props();
</script>

<Dialog.Root bind:open={isOpen$}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{date}</Dialog.Title>
    </Dialog.Header>
    <div>CM6Ed</div>
  </Dialog.Content>
</Dialog.Root>
