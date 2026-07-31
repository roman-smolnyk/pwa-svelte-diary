import * as db from "$lib/store/db";
import { saveAs } from "file-saver";
import { nanoid } from "nanoid";
import Papa from "papaparse";
import { push, router } from "svelte-spa-router";
import { reload } from "./pwaUtils";
import { diaryStore } from "./store/diaryStore.svelte";
import type { NoteT } from "./types";

export function navigateToModal() {
  const currentPath = router.location.split("?")[0];
  const params = new URLSearchParams(router.location.split("?")[1] || "");
  params.set("modal", "true");
  const path = `${currentPath}?${params.toString()}`;
  console.debug("push", path);
  push(path);
}

export async function handleNoteCreate(dateTime: Date, content: string): Promise<NoteT> {
  const note: NoteT = { id: nanoid(), dateTime: dateTime, content: content };

  await db.saveNotes([note]);

  await diaryStore.refresh();

  return note;
}

export async function handleNoteUpdate(noteId: string, fn: (note: NoteT) => NoteT) {
  const note = await db.getNote(noteId);
  const updatedNote = fn(note);
  await db.saveNotes([updatedNote]);

  await diaryStore.refresh();
}

export async function handleNoteDelete(noteId: string) {
  await db.deleteNote(noteId);

  await diaryStore.refresh();
}

export async function handleExportToCsv() {
  const notes = await db.getAllNotes();

  const data = notes.map((note) => ({
    ...note,
    dateTime: note.dateTime.toISOString(),
  }));

  const csvString = Papa.unparse(data);
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "pwa-svelte-diary.csv");
}

export async function handleImportFromCsv(file: File) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const parsedNotes = results.data.map((row: any) => ({
        ...row,
        dateTime: new Date(row.dateTime),
      }));

      console.log(parsedNotes);
      db.saveNotes(parsedNotes);
    },
    error: (error) => {
      console.error("Failed to parse CSV:", error);
    },
  });
  reload();
}

export async function handleDeleteAllData() {
  await db.clearAllData();
  reload();
}
