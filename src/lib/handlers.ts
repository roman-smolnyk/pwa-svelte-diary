import { nanoid } from "nanoid";
import type { NoteT } from "./types";
import * as db from "$lib/store/db";
import { diaryStore } from "./store/diaryStore.svelte";

export async function handleNoteSave(note: NoteT | undefined, date: string, text: string | undefined) {
  if (!text?.trim()) return;
  if (!note) {
    note = { id: nanoid(), date: date, content: text };
  }
  note.content = text;

  await db.saveNotes([note]);

  await diaryStore.refresh();
}
