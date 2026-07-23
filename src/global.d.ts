// src/global.d.ts
import type { StickerStore } from "$lib/stores/diaryStore";

declare global {
  const __APP_VERSION__: string;

  interface Window {
    diaryStore: DiaryStore;
  }
}

export {};
