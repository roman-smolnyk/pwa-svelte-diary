<script lang="ts">
  import { closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
  import { defaultKeymap, history, historyKeymap, redo, redoDepth, undo, undoDepth } from "@codemirror/commands";
  import { foldKeymap, indentOnInput } from "@codemirror/language";
  import { lintKeymap } from "@codemirror/lint";
  import { searchKeymap } from "@codemirror/search";
  import { EditorState } from "@codemirror/state";
  import { drawSelection, dropCursor, EditorView, keymap } from "@codemirror/view";

  let editorContainer: HTMLDivElement | undefined;
  let view: EditorView | undefined;

  let canUndo = $state(false);
  let canRedo = $state(false);

  function updateHistoryState() {
    if (!view) return;
    canUndo = undoDepth(view.state) > 0;
    canRedo = redoDepth(view.state) > 0;
  }

  function handleUndo() {
    if (!view) return;
    undo(view);
    updateHistoryState();
  }

  function handleRedo() {
    if (!view) return;
    redo(view);
    updateHistoryState();
  }

  $effect(() => {
    if (!view && editorContainer) {
      const state = EditorState.create({
        doc: "",
        extensions: [
          // A line number gutter
          // lineNumbers(),
          // A gutter with code folding markers
          // foldGutter(),
          // Replace non-printable characters with placeholders
          // highlightSpecialChars(),
          // The undo history
          history(),
          // Replace native cursor/selection with our own
          drawSelection(),
          // Show a drop cursor when dragging over the editor
          dropCursor(),
          // Allow multiple cursors/selections
          // EditorState.allowMultipleSelections.of(true),
          // Re-indent lines when typing specific input
          indentOnInput(),
          // Highlight syntax with a default style
          // syntaxHighlighting(defaultHighlightStyle),
          // Highlight matching brackets near cursor
          // bracketMatching(),
          // Automatically close brackets
          // closeBrackets(),
          // Load the autocompletion system
          // autocompletion(),
          // Allow alt-drag to select rectangular regions
          // rectangularSelection(),
          // Change the cursor to a crosshair when holding alt
          // crosshairCursor(),
          // Style the current line specially
          // highlightActiveLine(),
          // Style the gutter for current line specially
          // highlightActiveLineGutter(),
          // Highlight text that matches the selected text
          // highlightSelectionMatches(),
          keymap.of([
            // Closed-brackets aware backspace
            ...closeBracketsKeymap,
            // A large set of basic bindings
            ...defaultKeymap,
            // Search-related keys
            ...searchKeymap,
            // Redo/undo keys
            ...historyKeymap,
            // Code folding bindings
            ...foldKeymap,
            // Autocompletion keys
            ...completionKeymap,
            // Keys related to the linter system
            ...lintKeymap,
          ]),
        ],
      });

      view = new EditorView({
        state,
        parent: editorContainer,
        // dispatch: (tr) => {
        //   // view?.update([tr]);
        //   updateHistoryState();
        // },
      });
    }
  });

  $effect.pre(() => {
    return () => {
      if (view) {
        view.destroy();
      }
    };
  });
</script>

<div class="flex flex-col gap-3">
  <div class="flex gap-2">
    <button
      onclick={handleUndo}
      disabled={!canUndo}
      class="px-4 py-2 border border-gray-300 rounded-md transition-all {canUndo
        ? 'cursor-pointer hover:bg-gray-50 active:scale-95'
        : 'cursor-not-allowed opacity-50'}"
    >
      ↶ Undo
    </button>
    <button
      onclick={handleRedo}
      disabled={!canRedo}
      class="px-4 py-2 border border-gray-300 rounded-md transition-all {canRedo
        ? 'cursor-pointer hover:bg-gray-50 active:scale-95'
        : 'cursor-not-allowed opacity-50'}"
    >
      ↷ Redo
    </button>
  </div>

  <div bind:this={editorContainer} class=""></div>
</div>

<style>
  :global(.cm-editor) {
    height: 100%;
    font-family: monospace;
  }
</style>
