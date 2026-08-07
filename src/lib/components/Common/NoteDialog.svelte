<!-- src/lib/components/Common/NoteDialog.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { handleNoteDelete, handleNoteUpdate } from "$lib/handlers";
  import { cm6Store } from "$lib/store/cm6Store.svelte";
  import { diaryStore } from "$lib/store/diaryStore.svelte";
  import { formatCustomDate, isValidDateTime, parseCustomDate } from "$lib/utils";
  import { EditorSelection } from "@codemirror/state";
  import { ArrowLeft, RedoIcon, Trash2Icon, UndoIcon } from "@lucide/svelte";
  import { debounce } from "lodash-es";
  import { onMount } from "svelte";
  import { pop, router } from "svelte-spa-router";
  import CM6Editor from "../CM6/CM6Editor.svelte";

  let note = $derived(diaryStore.selectedNote);

  let inputValue$ = $state("");

  $effect(() => {
    if (!note) return;
    inputValue$ = formatCustomDate(note.dateTime);
  });

  onMount(() => {
    const handleBeforeUnload = (e: PopStateEvent) => {
      console.debug("handleBeforeUnload", router.querystring);
      if (diaryStore.selectedNote && router.querystring?.includes("modal")) {
        diaryStore.selectedNote = null;
      }
    };

    window.addEventListener("popstate", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handleBeforeUnload);
    };
  });

  const updateNoteContentDebounced = debounce(async (v: string) => {
    console.debug("updateNoteContentDebounced");
    if (!note) return;
    await handleNoteUpdate(note.id, (note) => {
      note.content = v;
      return note;
    });
  }, 250);

  const updateNoteDateTime = async (el: HTMLInputElement) => {
    console.debug("updateNoteDateTimeDebounced");
    if (!note) return;
    const value = el.value;
    if (!isValidDateTime(value)) {
      inputValue$ = formatCustomDate(note.dateTime);
      el.removeAttribute("aria-invalid");
      return;
    }

    await handleNoteUpdate(note.id, (note) => {
      const date = parseCustomDate(value);
      note.dateTime = date;
      return note;
    });
  };
</script>

{#if note}
  {#key note}
    <Dialog.Root open={true}>
      <Dialog.Content
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
        class="p-0 top-0 left-0 translate-x-0 translate-y-0 w-dvw h-dvh max-w-none sm:max-w-none max-h-none rounded-none
      flex flex-col gap-0"
      >
        <Dialog.Header class="p-2 mt-2 flex flex-row justify-between gap-4">
          <div class="flex items-center gap-4">
            <Dialog.Close
              onclick={() => {
                pop();
                diaryStore.selectedNote = null;
              }}
            >
              {#snippet child({ props })}
                <Button {...props} variant="ghost" size="icon-lg" class="size-10"><ArrowLeft class="size-6" /></Button>
              {/snippet}
            </Dialog.Close>

            <Input
              class="shrink-0 w-auto field-sizing-content border-none bg-inherit dark:bg-inherit"
              bind:value={inputValue$}
              onchange={(e) => updateNoteDateTime(e.currentTarget)}
              onblur={(e) => updateNoteDateTime(e.currentTarget)}
              oninput={async (e) => {
                const value = e.currentTarget.value;
                console.debug("oninput", value, isValidDateTime(value));

                if (value && !isValidDateTime(value)) {
                  e.currentTarget.setAttribute("aria-invalid", "true");
                } else {
                  e.currentTarget.removeAttribute("aria-invalid");
                }
              }}
            />
          </div>
        </Dialog.Header>

        <div class="flex-1 min-h-0 overflow-y-auto flex flex-col">
          <div class="shrink-0 w-full p-4 text-base">
            <CM6Editor value={note.content} onValueChange={updateNoteContentDebounced} />
          </div>
          <div
            class="flex-1 cursor-text"
            onclick={(e) => {
              setTimeout(() => {
                if (!cm6Store.editorView) return;
                cm6Store.editorView.focus();
                cm6Store.editorView.dispatch({
                  selection: EditorSelection.cursor(cm6Store.editorView.state.doc.length),
                });
              }, 50);
            }}
          ></div>
        </div>

        <Dialog.Footer class="shrink-0 m-0 p-4 pt-2 flex flex-row justify-end">
          <Dialog.Close onclick={() => handleNoteDelete(note.id)} class="mr-2">
            {#snippet child({ props })}
              <Button {...props} variant="ghost" size="lg"><Trash2Icon class="text-destructive" /></Button>
            {/snippet}
          </Dialog.Close>

          <Button variant="ghost" size="lg" onclick={cm6Store.undo} disabled={!cm6Store.canUndo} class=""><UndoIcon /></Button>
          <Button variant="ghost" size="lg" onclick={cm6Store.redo} disabled={!cm6Store.canRedo} class=""><RedoIcon /></Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  {/key}
{/if}
