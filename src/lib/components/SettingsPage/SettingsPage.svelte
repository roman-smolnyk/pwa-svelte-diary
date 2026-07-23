<script lang="ts">
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
  import { MoonIcon, SunIcon, SunMoonIcon } from "@lucide/svelte";
  import { setMode, userPrefersMode } from "mode-watcher";
</script>

<div data-component="SettingsPage" class="p-5">
  <div class="pb-5 flex items-center justify-center">
    <ToggleGroup.Root
      variant="outline"
      type="single"
      value={userPrefersMode.current}
      onValueChange={(value) => {
        setMode(value as "system" | "light" | "dark");
      }}
    >
      <ToggleGroup.Item value="system" aria-label="System" class="size-15">
        <SunMoonIcon class="size-8" />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="light" aria-label="Light" class="size-15">
        <SunIcon class="size-8" />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="dark" aria-label="Dark" class="size-15">
        <MoonIcon class="size-8" />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  </div>
</div>
