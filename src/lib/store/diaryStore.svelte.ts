// src/lib/store/diaryStore.svelte.ts
import * as db from "$lib/store/db";
import type { NoteT } from "$lib/types";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";

class DiaryStore {
  #notes = $state<NoteT[]>([]);
  #selectedDate = $state<CalendarDate | undefined>(today(getLocalTimeZone()));
  db = db;
  noteDates = $derived(this.#notes.map((a) => a.date));
  noteMap = $derived(new Map(this.#notes.map((item) => [item.date, item])));

  constructor() {
    this.refresh();
  }

  get notes() {
    return this.#notes;
  }

  get selectedDate() {
    return this.#selectedDate;
  }

  set selectedDate(date: CalendarDate | undefined) {
    this.#selectedDate = date;
  }

  async refresh() {
    this.#notes = await db.getAllNotes();
  }
}

export const diaryStore = new DiaryStore();

window.diaryStore = diaryStore;
