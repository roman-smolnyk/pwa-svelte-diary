import { clear, createStore, del, get, set, setMany } from "idb-keyval";

const customStore = createStore("rs-outliner-preferences", "rs-outliner-preferences");

type StorageSchema = {
  weekstart: string;
  githubToken: string;
  githubRepoName: string;
  githubAutoBackup: string;
};

const defaultValues: StorageSchema = {
  weekstart: "0",
  githubToken: "",
  githubRepoName: "",
  githubAutoBackup: "",
};

const localPref = {
  async get<K extends keyof StorageSchema>(key: K): Promise<StorageSchema[K]> {
    const value = await get(key, customStore);

    if (value === undefined) return defaultValues[key];

    return value;
  },

  async set<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]) {
    await set(key, value, customStore);
  },

  async setMany(keyVal: Partial<StorageSchema>) {
    const entries = Object.entries(keyVal) as [string, any][];
    await setMany(entries, customStore);
  },

  async remove<K extends keyof StorageSchema>(key: K) {
    await del(key, customStore);
  },

  async clear() {
    await clear(customStore);
  },
};

export default localPref;
