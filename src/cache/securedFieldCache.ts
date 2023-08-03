import * as SecureStore from 'expo-secure-store';

export default class SecuredFieldCache<Value> {
  private readonly key: string;
  private data: Value;

  constructor(key: string) {
    this.key = key;
    this.data = null;
  }

  async save() {
    await SecureStore.setItemAsync(this.key, JSON.stringify(this.data));
  }

  async init() {
    const stringData = await SecureStore.getItemAsync(this.key);
    this.data = JSON.parse(stringData);
  }

  get() {
    return this.data;
  }

  place(value: Value) {
    this.data = value;
  }

  async delete() {
    this.data = null;
    await SecureStore.deleteItemAsync(this.key);
  }
}
