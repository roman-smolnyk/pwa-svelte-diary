// src/global.d.ts
import type { DiaryStore } from "$lib/stores/diaryStore";

declare global {
  const __APP_VERSION__: string;

  interface Window {
    diaryStore: DiaryStore;
  }
}

export {};
