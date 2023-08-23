import * as SecureStore from 'expo-secure-store';

export default class SecuredFieldCache<T> {
  private readonly key: string;
  private data: T;
  private ready: boolean;

  constructor(key: string) {
    this.key = key;
    this.data = null;
    this.ready = false;
  }

  isReady() {
    return this.ready;
  }

  async save() {
    await SecureStore.setItemAsync(this.key, JSON.stringify(this.data));
  }

  async init() {
    if (this.isReady()) return;
    const stringData = await SecureStore.getItemAsync(this.key);
    this.data = JSON.parse(stringData);
    this.ready = true;
  }

  get() {
    return this.data;
  }

  place(value: T) {
    this.data = value;
  }

  async delete() {
    this.data = null;
    await SecureStore.deleteItemAsync(this.key);
  }
}
