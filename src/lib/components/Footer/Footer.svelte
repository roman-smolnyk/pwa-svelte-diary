<!-- src/lib/components/Footer/Footer.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import CalendarDaysIcon from "@lucide/svelte/icons/calendar-days";
  import LayoutListIcon from "@lucide/svelte/icons/layout-list";
  import SettingsIcon from "@lucide/svelte/icons/settings";
  import { Separator } from "$lib/components/ui/separator/index.js";
</script>

<div data-component="Footer" class="fixed bottom-0 inset-x-0 h-15 border-t border-border flex flex-row">
  <Button variant="ghost" class="flex-1 h-full w-full p-2 [&_svg:not([class*='size-'])]:size-8"><LayoutListIcon /></Button>
  <Separator orientation="vertical" />
  <Button variant="ghost" class="flex-1 h-full w-full p-2 [&_svg:not([class*='size-'])]:size-8"><CalendarDaysIcon /></Button>
  <Separator orientation="vertical" />
  <Button variant="ghost" class="flex-1 h-full w-full p-2 [&_svg:not([class*='size-'])]:size-8"><SettingsIcon /></Button>
</div>
