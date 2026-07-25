<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import { ChevronLeftIcon } from "@lucide/svelte";
  import type { Snippet } from "svelte";

  let {
    title,
    defaultOpen = true,
    children,
  }: {
    title: string;
    defaultOpen?: boolean;
    children: Snippet;
  } = $props();

  let open = $state(defaultOpen);
</script>

<Collapsible.Root bind:open>
  <Collapsible.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" size="lg" class="w-full bg-muted group">
        <span class="text-base font-semibold tracking-wide">{title}</span>
        <ChevronLeftIcon class="ml-auto transition-transform group-data-[state=open]:-rotate-90" />
      </Button>
    {/snippet}
  </Collapsible.Trigger>
  <Collapsible.Content class="py-4 pl-4 pr-2 flex flex-col gap-4">
    {@render children()}
  </Collapsible.Content>
</Collapsible.Root>
