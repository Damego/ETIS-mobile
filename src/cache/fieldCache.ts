import AsyncStorage from '@react-native-async-storage/async-storage';

export default class FieldCache<T> {
  private readonly key: string;
  private ready: boolean;
  private data: T;
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
    const { data, timestamp } = JSON.parse(stringData);
    this.data = data;
    this.timestamp = timestamp;
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
    await AsyncStorage.removeItem(this.key);
  }
}
