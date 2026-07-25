// src/lib/store/diaryStore.svelte.ts
import * as db from "$lib/store/db";
import type { NoteT } from "$lib/types";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";

class DiaryStore {
  #notes = $state<NoteT[]>([]);
  selectedDate = $state<CalendarDate | undefined>(today(getLocalTimeZone()));
  noteDates = $derived(new Set(this.#notes.map((a) => a.date)));
  dateNoteMap = $derived.by(() => {
    const map: Map<string, NoteT[]> = new Map();
    for (const item of this.#notes) {
      let list = map.get(item.date);
      if (!list) {
        list = [];
        map.set(item.date, list);
      }
      list.push(item);
    }
    return map;
  });
  selectedDateNotes = $derived<NoteT[]>(this.dateNoteMap.get(this.selectedDate?.toString() ?? "") ?? []);

  constructor() {
    this.refresh();
  }

  async refresh() {
    const notes = await db.getAllNotes();
    this.#notes = notes.sort((a, b) => a.date.localeCompare(b.date));
  }

  get notes() {
    return this.#notes;
  }
}

export const diaryStore = new DiaryStore();

window.diaryStore = diaryStore;
