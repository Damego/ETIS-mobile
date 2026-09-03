import AsyncStorage from '@react-native-async-storage/async-storage';

export default class FieldCache<T> {
  private readonly key: string;
  private ready: boolean;
  private data: T | null;
  private timestamp: number;

  constructor(key: string) {
    this.key = key;
    this.data = null;
    this.timestamp = 0;
    this.ready = false;
  }

  isReady() {
    return this.ready;
  }

  async init() {
    if (this.isReady()) return;

    const stringData = await AsyncStorage.getItem(this.key);
    const parsed = stringData != null ? JSON.parse(stringData) : null;
    this.data = parsed?.data ?? null;
    this.timestamp = parsed?.timestamp ?? 0;
    this.ready = true;
  }

  async save() {
    await AsyncStorage.setItem(
      this.key,
      JSON.stringify({ data: this.data, timestamp: this.timestamp })
    );
  }

  get() {
    return this.data;
  }

  getTime() {
    return this.timestamp;
  }

  place(value: T) {
    this.data = value;
    this.timestamp = Date.now();
  }

  async delete() {
    this.data = null;
    this.timestamp = 0;
    await AsyncStorage.removeItem(this.key);
  }
}
