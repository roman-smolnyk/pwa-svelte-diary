import * as db from "$lib/store/db";
import { saveAs } from "file-saver";
import { nanoid } from "nanoid";
import Papa from "papaparse";
import { toast } from "svelte-sonner";
import { push, router } from "svelte-spa-router";
import { GITHUB_BACKUP_FILE_NAME } from "./constants";
import { GithubBackuper } from "./githubBackuper";
import { reload } from "./pwaUtils";
import { diaryStore } from "./store/diaryStore.svelte";
import localPref from "./store/preferences";
import type { NoteT } from "./types";
import { parseISODate } from "./utils";

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

export async function createCsvString() {
  const notes = await db.getAllNotes();

  const data = notes.map((note) => ({
    ...note,
    dateTime: note.dateTime.toISOString(),
  }));

  return Papa.unparse(data, { columns: ["id", "dateTime", "content"] });
}

export async function handleExportToCsv() {
  const csvString = await createCsvString();
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `rs-diary_${new Date().toISOString().split("T")[0]}.csv`);
}

export async function handleImportFromCsv(file: File) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      try {
        const parsedNotes = results.data.map((row: any) => ({
          id: row.id ? row.id : nanoid(),
          dateTime: parseISODate(row.dateTime),
          content: row.content ? row.content : "",
        }));

        await db.saveNotes(parsedNotes);
        setTimeout(() => reload(), 50);
      } catch (error) {
        console.error("Failed to parse CSV:", error);
        toast.error(`Failed to parse CSV: ${error}`);
      }
    },
    error: (error) => {
      console.error("Failed to parse CSV:", error);
      toast.error(`Failed to parse CSV: ${error}`);
    },
  });
}

export async function handleDeleteAllData() {
  await db.clearAllData();
  reload();
}

function shouldBackup(githubAutoBackup: string, date: Date): boolean {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const ONE_WEEK_MS = 7 * ONE_DAY_MS;
  const ONE_MONTH_MS = 30 * ONE_DAY_MS;

  const diffMs = Date.now() - date.getTime();

  if (githubAutoBackup === "daily") {
    if (diffMs >= ONE_DAY_MS) return true;
  } else if (githubAutoBackup === "weekly") {
    if (diffMs >= ONE_WEEK_MS) return true;
  } else if (githubAutoBackup === "monthly") {
    if (diffMs >= ONE_MONTH_MS) return true;
  }
  return false;
}

export async function handleAutoBackup() {
  const githubToken = await localPref.get("githubToken");
  const githubRepoName = await localPref.get("githubRepoName");
  const githubAutoBackup = await localPref.get("githubAutoBackup");

  if (!githubToken || !githubRepoName || !githubAutoBackup) {
    return;
  }

  const ghb = new GithubBackuper(githubToken);
  const date = await ghb.getLastFileCommitDate(githubRepoName, GITHUB_BACKUP_FILE_NAME);
  if (date && shouldBackup(githubAutoBackup, date)) {
    const csvString = await createCsvString();
    const success = await ghb.putFileContent(githubRepoName, GITHUB_BACKUP_FILE_NAME, csvString);
    if (success) {
      toast.success("Backed up successfully");
    }
  }
}
