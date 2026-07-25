import * as db from "$lib/store/db";
import { nanoid } from "nanoid";
import { diaryStore } from "./store/diaryStore.svelte";
import type { NoteT } from "./types";

export async function handleNoteCreate(date: string, content: string) {
  const note: NoteT = { id: nanoid(), date: date, content: content };

  await db.saveNotes([note]);

  await diaryStore.refresh();
}

export async function handleNoteUpdate(noteId: string, content: string) {
  const note = await db.getNote(noteId);
  note.content = content;
  await db.saveNotes([note]);

  await diaryStore.refresh();
}

export async function handleNoteDelete(noteId: string) {
  await db.deleteNote(noteId);

  await diaryStore.refresh();
}

export async function handlePWAUpdate() {
  console.debug("handlePWAUpdate");
  if (!navigator.onLine) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((reg) => reg.unregister()));

  const cacheKeys = await caches.keys();
  await Promise.all(cacheKeys.map((key) => caches.delete(key)));

  const url = new URL(window.location.href);
  url.searchParams.set("v", String(Date.now()));
  setTimeout(() => {
    window.location.replace(url);
  }, 0);
  // window.location.href = url.toString();
}
