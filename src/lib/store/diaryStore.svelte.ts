// src/lib/store/diaryStore.svelte.ts
import { navigateToModal } from "$lib/handlers";
import * as db from "$lib/store/db";
import type { NoteT } from "$lib/types";
import { getDateStrFromDate } from "$lib/utils";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import localPref from "./preferences";
import { fetchPwaVersion } from "$lib/pwaUtils";

class DiaryStore {
  #notes = $state<NoteT[]>([]);
  selectedDate = $state<CalendarDate | undefined>(today(getLocalTimeZone()));
  selectedNote = $state<NoteT | null>(null);
  noteDates = $derived(new Set(this.#notes.map((a) => getDateStrFromDate(a.dateTime))));
  dateNoteMap = $derived.by(() => {
    const map: Map<string, NoteT[]> = new Map();
    for (const item of this.#notes) {
      const date = getDateStrFromDate(item.dateTime);
      let list = map.get(date);
      if (!list) {
        list = [];
        map.set(date, list);
      }
      list.push(item);
    }
    return map;
  });
  selectedDateNotes = $derived<NoteT[]>(this.dateNoteMap.get(this.selectedDate?.toString() ?? "") ?? []);
  #weekstart = $state("0");
  pwaVersion = $state("");

  constructor() {
    this.refresh();
  }

  async refresh() {
    const notes = await db.getAllNotes();
    this.#notes = notes;
  }

  get notes() {
    return this.#notes;
  }

  get weekstart() {
    return this.#weekstart;
  }

  set weekstart(v: string) {
    this.#weekstart = v;
    localPref.set("weekstart", v);
  }

  openNoteDialog(noteId: string) {
    const note = this.#notes.find((a) => a.id === noteId);
    if (!note) return;
    this.selectedNote = note;
    navigateToModal();
  }
}

export const diaryStore = new DiaryStore();
window.diaryStore = diaryStore;

async function hydrateDiaryStore() {
  diaryStore.weekstart = await localPref.get("weekstart");
}
hydrateDiaryStore();

async function fetchVersion() {
  const pwaVersion = await fetchPwaVersion();
  if (pwaVersion) diaryStore.pwaVersion = pwaVersion;
}
fetchVersion();
const intervalId = setInterval(fetchVersion, 5 * 60 * 1000);
