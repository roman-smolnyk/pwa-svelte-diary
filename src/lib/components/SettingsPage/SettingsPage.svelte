<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { userPrefersMode } from "mode-watcher";
  import SettingsSection from "./SettingsSection.svelte";

  const themes = [
    { label: "System", value: "system" },
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ];

  const triggerContent = $derived(themes.find((a) => a.value === userPrefersMode.current)?.label ?? "Select a theme");
</script>

<div data-component="SettingsPage" class="p-5">
  <SettingsSection title="Appearance">
    <div class="flex flex-col gap-2">
      <Label for="theme-select" class="text-muted-foreground">Theme</Label>
      <Select.Root type="single" bind:value={userPrefersMode.current}>
        <Select.Trigger id="theme-select" class="w-full max-w-xs">{triggerContent}</Select.Trigger>
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
</div>
