// src/lib/store/cm6Store.svelte.ts
import type { EditorView } from "codemirror";
import { defaultKeymap, history, historyKeymap, redo, redoDepth, undo, undoDepth } from "@codemirror/commands";

class CM6Store {
  editorView = $state<EditorView | undefined>(undefined);

  canUndo = $state(false);
  canRedo = $state(false);

  undo = () => {
    if (!this.editorView) return;
    undo(this.editorView);
    this.updateHistoryState();
  };
  redo = () => {
    if (!this.editorView) return;
    redo(this.editorView);
    this.updateHistoryState();
  };

  updateHistoryState = () => {
    // console.debug("updateHistoryState", this.editorView);
    if (!this.editorView) return;
    this.canUndo = undoDepth(this.editorView.state) > 0;
    this.canRedo = redoDepth(this.editorView.state) > 0;
  };
}

export const cm6Store = new CM6Store();

// window.cm6Store = cm6Store;
