<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { handleDeleteAllData, handleExportToCsv, handleImportFromCsv } from "$lib/handlers";
  import { resetPWA } from "$lib/pwaUtils";
  import { appStore } from "$lib/store/appStore.svelte";
  import { confirmStore } from "$lib/store/confirmStore.svelte";
  import { CircleArrowUpIcon, DatabaseArrowDownIcon, DatabaseArrowUpIcon, Trash2Icon } from "@lucide/svelte";
  import { userPrefersMode } from "mode-watcher";
  import GithubBackupDialog from "../GithubBackup/GithubBackupDialog.svelte";
  import SettingsSection from "./SettingsSection.svelte";

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
  const weekstartTriggerContent = $derived(weekstarts.find((a) => a.value === appStore.weekstart)?.label ?? "Select day");

  let csvFileInput$: HTMLInputElement | undefined = $state();

  async function handleCsvUpload(event: Event): Promise<void> {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    await handleImportFromCsv(file);
    input.value = "";
  }
</script>

<div data-component="SettingsPage" class="flex-1 min-h-0 flex flex-col">
  <div class="flex-1 min-h-0 p-5 overflow-y-auto flex flex-col">
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
        <Select.Root type="single" bind:value={appStore.weekstart}>
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
        <span>Update {appStore.pwaVersion ? (appStore.pwaVersion !== __APP_VERSION__ ? `(${appStore.pwaVersion})` : "") : ""}</span>
      </Button>
    </SettingsSection>

    <SettingsSection title="Data">
      <GithubBackupDialog />
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
  </div>

  <div class="shrink-0 p-1 flex items-end justify-end">
    <span class="text-xs font-mono text-muted-foreground">{`v${__APP_VERSION__}`}</span>
  </div>
  <div class="shrink-0 min-h-13"></div>
</div>
