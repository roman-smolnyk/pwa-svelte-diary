<!-- src/lib/components/Main/Main.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import Router, { push } from "svelte-spa-router";
  import CalendarPage from "../CalendarPage/CalendarPage.svelte";
  import Footer from "../Footer/Footer.svelte";
  import SettingsPage from "../SettingsPage/SettingsPage.svelte";
  import TimelinePage from "../TimelinePage/TimelinePage.svelte";
  import NoteDialog from "../Common/NoteDialog.svelte";

  const routes = new Map();
  routes.set("/timeline", TimelinePage);
  routes.set("/calendar", CalendarPage);
  routes.set("/settings", SettingsPage);
  routes.set("*", CalendarPage);

  onMount(async () => {
    await push("/calendar");
  });
</script>

<div data-component="Main" class="h-dvh w-dvw flex flex-col">
  <Router {routes} />

  <Footer />

  <NoteDialog />
</div>
