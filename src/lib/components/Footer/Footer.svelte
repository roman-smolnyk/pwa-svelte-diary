<!-- src/lib/components/Footer/Footer.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import CalendarDaysIcon from "@lucide/svelte/icons/calendar-days";
  import LayoutListIcon from "@lucide/svelte/icons/layout-list";
  import SettingsIcon from "@lucide/svelte/icons/settings";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { pop, push, router, replace } from "svelte-spa-router";
</script>

<div class="shrink-0 h-13"></div>
<div data-component="Footer" class="fixed bottom-0 inset-x-0 h-13 border-t border-border flex flex-row">
  <Button
    variant="ghost"
    class={`flex-1 h-full w-full p-0 [&_svg:not([class*='size-'])]:size-6 ${router.location.includes("timeline") ? "bg-accent" : ""}`}
    onclick={() => replace("/timeline")}><LayoutListIcon /></Button
  >
  <Separator orientation="vertical" />
  <Button
    variant="ghost"
    class={`flex-1 h-full w-full p-0 [&_svg:not([class*='size-'])]:size-6 ${router.location.includes("calendar") ? "bg-accent" : ""}`}
    onclick={() => replace("/calendar")}><CalendarDaysIcon /></Button
  >
  <Separator orientation="vertical" />
  <Button
    variant="ghost"
    class={`flex-1 h-full w-full p-0 [&_svg:not([class*='size-'])]:size-6 ${router.location.includes("settings") ? "bg-accent" : ""}`}
    onclick={() => replace("/settings")}><SettingsIcon /></Button
  >
</div>
