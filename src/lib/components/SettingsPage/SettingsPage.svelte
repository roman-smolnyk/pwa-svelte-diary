<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { handleDeleteAllData, handleExportToCsv, handleImportFromCsv } from "$lib/handlers";
  import { resetPWA } from "$lib/pwaUtils";
  import { confirmStore } from "$lib/store/confirmStore.svelte";
  import { CircleArrowUpIcon, DatabaseArrowDownIcon, DatabaseArrowUpIcon, Trash2Icon } from "@lucide/svelte";
  import { userPrefersMode } from "mode-watcher";
  import SettingsSection from "./SettingsSection.svelte";
  import { diaryStore } from "$lib/store/diaryStore.svelte";

  const themes = [
    { label: "System", value: "system" },
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ];

  const weekstarts = [
    { label: "Sunday", value: "0" },
    { label: "Monday", value: "1" },
    { label: "Tuesday", value: "2" },
    { label: "Wednesday", value: "3" },
    { label: "Thursday", value: "4" },
    { label: "Friday", value: "5" },
    { label: "Saturday", value: "6" },
  ];

  const themeTriggerContent = $derived(themes.find((a) => a.value === userPrefersMode.current)?.label ?? "Select a theme");
  const weekstartTriggerContent = $derived(weekstarts.find((a) => a.value === diaryStore.weekstart)?.label ?? "Select day");

  let csvFileInput$: HTMLInputElement | undefined = $state();

  async function handleCsvUpload(event: Event): Promise<void> {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    await handleImportFromCsv(file);
    input.value = "";
  }
</script>

<div data-component="SettingsPage" class="p-5">
  <SettingsSection title="Appearance">
    <div class="flex flex-col gap-2">
      <Label for="theme-select" class="text-muted-foreground">Theme</Label>
      <Select.Root type="single" bind:value={userPrefersMode.current}>
        <Select.Trigger id="theme-select" class="w-full">{themeTriggerContent}</Select.Trigger>
        <Select.Content>
          <Select.Group>
            <!-- <Select.Label>Theme</Select.Label> -->
            {#each themes as theme (theme.value)}
              <Select.Item value={theme.value} label={theme.label}>
                {theme.label}
              </Select.Item>
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  </SettingsSection>

  <SettingsSection title="App">
    <div class="flex flex-col gap-2">
      <Label for="calendar-weekstart-select" class="text-muted-foreground">Week starts on</Label>
      <Select.Root type="single" bind:value={diaryStore.weekstart}>
        <Select.Trigger id="calendar-weekstart-select" class="w-full">{weekstartTriggerContent}</Select.Trigger>
        <Select.Content>
          <Select.Group>
            <!-- <Select.Label>Theme</Select.Label> -->
            {#each weekstarts as weekstart (weekstart.value)}
              <Select.Item value={weekstart.value} label={weekstart.label}>
                {weekstart.label}
              </Select.Item>
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
    <Button variant="outline" onclick={() => resetPWA()}>
      <CircleArrowUpIcon />
      <span>Update {diaryStore.pwaVersion ? (diaryStore.pwaVersion !== __APP_VERSION__ ? `(${diaryStore.pwaVersion})` : "") : ""}</span>
    </Button>
  </SettingsSection>

  <SettingsSection title="Data">
    <Button variant="outline" onclick={() => handleExportToCsv()}>
      <DatabaseArrowDownIcon /><span>Export to CSV</span>
    </Button>
    <input bind:this={csvFileInput$} type="file" accept=".csv, text/csv" onchange={handleCsvUpload} class="hidden" />
    <Button variant="outline" onclick={() => csvFileInput$?.click()}>
      <DatabaseArrowUpIcon /><span>Import from CSV</span>
    </Button>
    <Button
      variant="destructive"
      onclick={async () => {
        if (await confirmStore.confirm("Delete All Data?", "All current data will be wiped out!")) {
          await handleDeleteAllData();
        }
      }}
    >
      <Trash2Icon /><span>Delete All Data</span>
    </Button>
  </SettingsSection>
  <span class="text-xs">{`v${__APP_VERSION__}`}</span>
</div>
