<script lang="ts">
  import { cm6Store } from "$lib/store/cm6Store.svelte";
  import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
  import { EditorSelection, EditorState } from "@codemirror/state";
  import { EditorView, keymap } from "@codemirror/view";
  import { onMount } from "svelte";

  let { value, onValueChange }: { value: string; onValueChange: (v: string) => void } = $props();

  let editorContainer: HTMLDivElement | undefined;

  onMount(() => {
    console.debug("CM6Editor:onMount");
    const state = EditorState.create({
      doc: $state.snapshot(value),
      extensions: [
        history(),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({ spellcheck: "true" }),
        keymap.of([
          // A large set of basic bindings
          ...defaultKeymap,
          // Redo/undo keys
          ...historyKeymap,
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            onValueChange(newValue);
            cm6Store.updateHistoryState();
          }
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorContainer,
    });

    setTimeout(() => {
      view.focus();
      view.dispatch({
        selection: EditorSelection.cursor(view.state.doc.length),
      });
    }, 250);

    cm6Store.editorView = view;

    return () => {
      if (view) {
        view.destroy();
      }
    };
  });
</script>

<div data-component="CM6Editor" bind:this={editorContainer} class="bg-muted"></div>

<style>
  /* :global(.cm-editor) {
    height: 100%;
  } */
  :global(.cm-content) {
    caret-color: light-dark(black, white) !important;
    overflow-wrap: break-word !important;
    font-family: Inter, Arial, system-ui, Avenir, Helvetica, sans-serif;
  }
  :global(.cm-focused) {
    outline: none;
  }
  :global(.cm-line) {
    padding: 0;
  }
  :global(.cm-lineWrapping) {
    white-space: pre-wrap;
  }
  :global(.cm-scroller) {
    line-height: inherit;
  }
</style>
