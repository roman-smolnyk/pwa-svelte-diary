<!-- src/lib/components/Main/Main.svelte -->
<script lang="ts">
  import CalendarPage from "../CalendarPage/CalendarPage.svelte";
  import NoteDialog from "../Common/NoteDialog.svelte";
  import SettingsPage from "../SettingsPage/SettingsPage.svelte";
  import TimelinePage from "../TimelinePage/TimelinePage.svelte";

  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { CalendarDaysIcon, LayoutListIcon, SettingsIcon } from "@lucide/svelte";

  // const routes = new Map();
  // routes.set("/timeline", );
  // routes.set("/calendar", CalendarPage);
  // routes.set("/settings", SettingsPage);
  // routes.set("*", CalendarPage);

  // onMount(async () => {
  //   await push("/calendar");
  // });
</script>

<div data-component="Main" class="h-dvh w-dvw flex flex-col">
  <!-- <Router {routes} /> -->

  <Tabs.Root value="calendar" class="flex-1 min-h-0">
    <Tabs.List class="fixed bottom-0 inset-x-0 h-13! w-full rounded-none p-0">
      <Tabs.Trigger value="timeline" class="h-13">
        <!-- {#snippet child({ props })}
          {@const { class: _, ...restProps } = props}
          <Button {...restProps} variant="ghost" class="data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground"><LayoutListIcon /></Button>
        {/snippet} -->
        <LayoutListIcon class="size-6" />
      </Tabs.Trigger>
      <Tabs.Trigger value="calendar" class="h-13">
        <CalendarDaysIcon class="size-6" />
      </Tabs.Trigger>
      <Tabs.Trigger value="settings" class="h-13">
        <SettingsIcon class="size-6" />
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="timeline" class="flex-1 min-h-0 flex flex-col"><TimelinePage /></Tabs.Content>
    <Tabs.Content value="calendar" class="flex-1 min-h-0 flex flex-col"><CalendarPage /></Tabs.Content>
    <Tabs.Content value="settings" class="flex-1 min-h-0 flex flex-col"><SettingsPage /></Tabs.Content>
  </Tabs.Root>

  <!-- <Footer /> -->

  <NoteDialog />
</div>
