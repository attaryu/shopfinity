import { signal } from '@preact/signals'; 

import type { Signal } from '@preact/signals';

type DataStore = {
  data: {
    email?: string,
  },
  cart: number[],
}

export const store: Signal<DataStore> = signal({
  data: {},
  cart: [],
});
