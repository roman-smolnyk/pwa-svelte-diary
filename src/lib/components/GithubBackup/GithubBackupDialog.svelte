<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { GITHUB_BACKUP_FILE_NAME } from "$lib/constants";
  import { GithubBackuper } from "$lib/githubBackuper";
  import { createCsvString, handleImportFromCsv } from "$lib/handlers";
  import { confirmStore } from "$lib/store/confirmStore.svelte";
  import localPref from "$lib/store/preferences";
  import { cn } from "$lib/utils.js";
  import { CloudDownloadIcon, CloudUploadIcon, CloudyIcon } from "@lucide/svelte";
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import { untrack } from "svelte";
  import { toast } from "svelte-sonner";

  const autoBackupValues = [
    { label: "Disabled", value: "" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ];

  let ghb = $state<GithubBackuper | null>(null);
  let githubToken = $state("");
  let githubRepoName = $state("");
  let githubLastBackupDate = $state<Date | null>(null);
  let githubRepos = $state<any[]>([]);
  let githubAutoBackup = $state("");

  let dialogIsOpen$ = $state(false);
  let popoverIsOpen$ = $state(false);

  const autoBackupTriggerContent = $derived(autoBackupValues.find((a) => a.value === githubAutoBackup)?.label ?? "Select");

  $effect(() => {
    if (dialogIsOpen$) {
      untrack(async () => {
        console.debug("$effect:untrack");
        githubToken = await localPref.get("githubToken");
        githubRepoName = await localPref.get("githubRepoName");
        githubAutoBackup = await localPref.get("githubAutoBackup");
      });
    } else {
      untrack(() => {
        githubToken = "";
        githubRepoName = "";
        githubAutoBackup = "";
      });
    }
  });

  $effect(() => {
    if (githubToken) {
      untrack(async () => {
        ghb = new GithubBackuper(githubToken);
        if (!(await ghb.isTokenValid())) {
          toast.error("GitHub token is invalid");
        }
        githubRepos = await ghb.listRepos();
      });
    } else {
      untrack(() => {
        ghb = null;
        githubRepos = [];
      });
    }
  });

  $effect(() => {
    if (ghb && githubRepoName) {
      untrack(async () => {
        if (!ghb) return;
        const date = await ghb.getLastFileCommitDate(githubRepoName, GITHUB_BACKUP_FILE_NAME);
        if (date) {
          githubLastBackupDate = date;
        }
      });
    } else {
      untrack(() => {
        githubLastBackupDate = null;
      });
    }
  });
</script>

<Dialog.Root bind:open={dialogIsOpen$}>
  <Dialog.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">
        <CloudyIcon /><span>GitHub Backup</span>
      </Button>
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Content onOpenAutoFocus={(e) => e.preventDefault()}>
    <Dialog.Header>
      <Dialog.Title>GitHub Backup</Dialog.Title>
    </Dialog.Header>
    <div class="flex flex-col gap-2">
      <Label for="github-access-token" class="text-muted-foreground">GitHub Access Token</Label>
      <div class="flex flex-col gap-4">
        <Input
          id="github-access-token"
          class="[-webkit-text-security:disc] focus:[-webkit-text-security:none]"
          value={githubToken}
          oninput={async (e) => {
            const value = e.currentTarget.value;
            if (!value) return;
            localPref.set("githubToken", value);
            githubToken = value;
          }}
        />
        <div class="flex flex-row gap-2">
          <Button
            variant="outline"
            class="flex-1"
            onclick={async () => {
              if (!ghb) return;
              githubRepos = await ghb.listRepos();
            }}>Apply</Button
          >
          <Button
            variant="destructive"
            class="flex-1"
            onclick={async () => {
              githubToken = "";
              githubRepoName = "";
              githubAutoBackup = "";
              await localPref.set("githubToken", "");
              await localPref.set("githubRepoName", "");
              await localPref.set("githubAutoBackup", "");
              dialogIsOpen$ = false;
            }}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
    <div>
      <Popover.Root bind:open={popoverIsOpen$}>
        <Popover.Trigger>
          {#snippet child({ props })}
            <Button {...props} variant="outline" class="w-full justify-between" role="combobox" aria-expanded={popoverIsOpen$}>
              {githubRepoName || "Select a repository..."}
              <ChevronsUpDownIcon class="opacity-50" />
            </Button>
          {/snippet}
        </Popover.Trigger>
        <Popover.Content class="w-full p-0">
          <Command.Root>
            <Command.Input placeholder="Search repository..." />
            <Command.List>
              <Command.Empty>No repository found.</Command.Empty>
              <Command.Group value="repositories">
                {#each githubRepos as repo (repo.name)}
                  <Command.Item
                    value={repo.name}
                    onSelect={async () => {
                      githubRepoName = repo.name;
                      popoverIsOpen$ = false;
                      await localPref.set("githubRepoName", githubRepoName);
                    }}
                  >
                    <CheckIcon class={cn(githubRepoName !== repo.name && "text-transparent")} />
                    {repo.name}
                  </Command.Item>
                {/each}
              </Command.Group>
            </Command.List>
          </Command.Root>
        </Popover.Content>
      </Popover.Root>
    </div>
    <div class="flex flex-col gap-2">
      <Label for="autobackup-select" class="text-muted-foreground">Automatic backup</Label>
      <Select.Root
        type="single"
        bind:value={githubAutoBackup}
        onValueChange={async (value) => {
          await localPref.set("githubAutoBackup", value);
        }}
      >
        <Select.Trigger id="autobackup-select" class="w-full">{autoBackupTriggerContent}</Select.Trigger>
        <Select.Content>
          <Select.Group>
            {#each autoBackupValues as autoBackup (autoBackup.value)}
              <Select.Item value={autoBackup.value} label={autoBackup.label}>
                {autoBackup.label}
              </Select.Item>
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
    <div>Last Backup: <span>{githubLastBackupDate ? githubLastBackupDate.toLocaleString() : "No Backup"}</span></div>
    <div class="flex flex-col gap-2">
      <Button
        onclick={async () => {
          if (!ghb || !githubRepoName) return;
          const csvString = await createCsvString();
          const success = await ghb.putFileContent(githubRepoName, GITHUB_BACKUP_FILE_NAME, csvString);
          if (success) {
            githubLastBackupDate = new Date();
            toast.success("Backed up successfully");
          }
          console.debug("Make Backup", success);
        }}
      >
        <CloudUploadIcon />
        <span>Backup</span>
      </Button>
      <Button
        onclick={async () => {
          if (!ghb || !githubRepoName) return;
          if (await confirmStore.confirm("Restore from Backup?", "All current data will be wiped out!")) {
            const content = await ghb.getFileContent(githubRepoName, GITHUB_BACKUP_FILE_NAME);
            if (content) {
              const file = new File([content], GITHUB_BACKUP_FILE_NAME, {
                type: "text/csv",
              });
              await handleImportFromCsv(file);
            }
          }
        }}
      >
        <CloudDownloadIcon />
        <span>Restore</span>
      </Button>
      <!-- <Button
        onclick={async () => {
          if (!ghb || !githubRepoName) return;
          const zebra = await ghb.getLastFileCommitDate(githubRepoName, GITHUB_BACKUP_FILE_NAME);
          console.debug("zebra", zebra);
        }}
      >
        <span>Zebra</span>
      </Button> -->
    </div>
  </Dialog.Content>
</Dialog.Root>
