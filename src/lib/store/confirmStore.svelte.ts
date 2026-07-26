// src/lib/store/confirmStore.svelte.ts

class ConfirmStore {
  #active = $state<{
    title: string;
    description?: string;
    resolve: (value: boolean) => void;
  } | null>(null);

  get isOpen() {
    return this.#active !== null;
  }

  get title() {
    return this.#active?.title;
  }

  get description() {
    return this.#active?.description;
  }

  confirm = (title: string, description?: string) => {
    return new Promise<boolean>((resolve) => {
      this.#active = {
        title: title,
        description: description,
        resolve,
      };
    });
  };

  resolve = (value: boolean) => {
    if (this.#active) {
      this.#active.resolve(value);
      this.#active = null;
    }
  };
}

export const confirmStore = new ConfirmStore();
