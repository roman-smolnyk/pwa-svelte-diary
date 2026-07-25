import type { NoteT } from "$lib/types";
import { openDB, type DBSchema, type IDBPDatabase } from "idb";

const DB_NAME = "DiaryAppDB";
export const DB_VERSION = 1;

interface StickerAppDB extends DBSchema {
  // meta: {
  //   key: string;
  //   value: MetaT;
  // };
  notes: {
    key: string;
    value: NoteT;
  };
}

// Initialize and upgrade the database
export const dbPromise: Promise<IDBPDatabase<StickerAppDB>> = openDB<StickerAppDB>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("notes")) {
      db.createObjectStore("notes", { keyPath: "id" });
    }
  },
});

export async function isEmpty() {
  const db = await dbPromise;

  const tx = db.transaction(["notes"], "readonly");

  const notesCount = await tx.objectStore("notes").count();

  await tx.done;

  return notesCount === 0;
}

export async function getAllNotes(): Promise<NoteT[]> {
  const db = await dbPromise;
  const notes = await db.getAll("notes");
  return notes;
}

export async function getNote(noteId: string): Promise<NoteT> {
  console.debug("getNote", noteId);
  const db = await dbPromise;
  const note = await db.get("notes", noteId);
  if (!note) {
    throw new Error(`Note with id=${noteId} is missing`);
  }

  return note;
}

export async function saveNotes(notes: NoteT[]) {
  console.debug("saveNotes", notes);
  const db = await dbPromise;
  const tx = db.transaction(["notes"], "readwrite");
  const notesStore = tx.objectStore("notes");

  await Promise.all(notes.map((note) => notesStore.put(note)));

  await tx.done;
}

export async function deleteNote(noteId: string) {
  console.debug("deleteNote", noteId);
  const db = await dbPromise;
  await db.delete("notes", noteId);
}
