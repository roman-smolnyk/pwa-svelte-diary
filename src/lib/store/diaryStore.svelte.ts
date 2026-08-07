// src/lib/store/diaryStore.svelte.ts
import { navigateToModal } from "$lib/handlers";
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

  openNoteDialog(noteId: string) {
    const note = this.#notes.find((a) => a.id === noteId);
    if (!note) return;
    this.selectedNote = note;
    navigateToModal();
  }

  findNoteWithClosestDate(targetDate: Date): NoteT | undefined {
    const closestNote = [...this.#notes].sort((a, b) => {
      const diffA = Math.abs(a.dateTime.getTime() - targetDate.getTime());
      const diffB = Math.abs(b.dateTime.getTime() - targetDate.getTime());
      return diffA - diffB;
    })[0];
    return closestNote;
  }
}

export const diaryStore = new DiaryStore();
window.diaryStore = diaryStore;
