// src/lib/store/diaryStore.svelte.ts
import * as db from "$lib/store/db";
import type { NoteT } from "$lib/types";
import { getDateStrFromDate } from "$lib/utils";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";

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
}

export const diaryStore = new DiaryStore();

window.diaryStore = diaryStore;
