<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
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

  const githubBackupFileName = "backup.csv";

  let ghb = $state<GithubBackuper | null>(null);
  let githubToken = $state("");
  let githubRepoName = $state("");
  let githubLastBackupDate = $state<Date | null>(null);
  let repos = $state<any[]>([]);

  let dialogIsOpen$ = $state(false);
  let popoverIsOpen$ = $state(false);

  $effect(() => {
    if (dialogIsOpen$) {
      untrack(async () => {
        console.debug("$effect:untrack");
        githubToken = await localPref.get("githubToken");
        githubRepoName = await localPref.get("githubRepoName");
      });
    } else {
      untrack(() => {
        githubToken = "";
        githubRepoName = "";
      });
    }
  });

  $effect(() => {
    if (githubToken) {
      untrack(async () => {
        ghb = new GithubBackuper(githubToken);
        repos = await ghb.listRepos();
      });
    } else {
      untrack(() => {
        ghb = null;
        repos = [];
      });
    }
  });

  $effect(() => {
    if (ghb && githubRepoName) {
      untrack(async () => {
        if (!ghb) return;
        const date = await ghb.getLastFileCommitDate(githubRepoName, githubBackupFileName);
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
      <Label>GitHub Access Token</Label>
      <div class="flex flex-col gap-4">
        <Input
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
              repos = await ghb.listRepos();
            }}>Apply</Button
          >
          <Button
            variant="destructive"
            class="flex-1"
            onclick={async () => {
              githubToken = "";
              githubRepoName = "";
              await localPref.set("githubToken", "");
              await localPref.set("githubRepoName", "");
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
                {#each repos as repo (repo.name)}
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
    <div>Last Backup: <span>{githubLastBackupDate ? githubLastBackupDate.toLocaleString() : "No Backup"}</span></div>
    <div class="flex flex-col gap-2">
      <Button
        onclick={async () => {
          if (!ghb || !githubRepoName) return;
          const csvString = await createCsvString();
          const success = await ghb.putFileContent(githubRepoName, githubBackupFileName, csvString);
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
            const content = await ghb.getFileContent(githubRepoName, githubBackupFileName);
            if (content) {
              const file = new File([content], githubBackupFileName, {
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
          const zebra = await ghb.getLastFileCommitDate(githubRepoName, githubBackupFileName);
          console.debug("zebra", zebra);
        }}
      >
        <span>Zebra</span>
      </Button> -->
    </div>
  </Dialog.Content>
</Dialog.Root>
