import AsyncStorage from '@react-native-async-storage/async-storage';

export default class FieldCache<T> {
  private readonly key: string;
  private ready: boolean;
  private data: T;

  constructor(key: string) {
    this.key = key;
    this.data = null;
    this.ready = false;
  }

  isReady() {
    return this.ready;
  }

  async init() {
    if (this.isReady()) return;

    const stringData = await AsyncStorage.getItem(this.key);
    this.data = JSON.parse(stringData);
    this.ready = true;
  }

  async save() {
    await AsyncStorage.setItem(this.key, JSON.stringify(this.data));
  }

  get() {
    return this.data;
  }

  place(value: T) {
    this.data = value;
  }

  async delete() {
    this.data = null;
    await AsyncStorage.removeItem(this.key);
  }
}
