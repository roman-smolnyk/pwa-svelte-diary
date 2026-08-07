// src/lib/store/appStore.svelte.ts
import { fetchPwaVersion } from "$lib/pwaUtils";
import { getLocalTimeZone, today } from "@internationalized/date";
import localPref from "./preferences";

class AppStore {
  #weekstart = $state("0");
  pwaVersion = $state("");
  maxFutureDate = today(getLocalTimeZone()).add({ years: 50 });

  get weekstart() {
    return this.#weekstart;
  }

  set weekstart(v: string) {
    this.#weekstart = v;
    localPref.set("weekstart", v);
  }
}

export const appStore = new AppStore();

async function hydrateAppStore() {
  appStore.weekstart = await localPref.get("weekstart");
}
hydrateAppStore();

async function fetchVersion() {
  const pwaVersion = await fetchPwaVersion();
  if (pwaVersion) appStore.pwaVersion = pwaVersion;
}
fetchVersion();
const intervalId = setInterval(fetchVersion, 5 * 60 * 1000);
