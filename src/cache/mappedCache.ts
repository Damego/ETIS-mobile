import AsyncStorage from '@react-native-async-storage/async-storage';

type Dict<K extends string | number | symbol, V> = { [key in K]: { data: V; timestamp: number } };

export default class MappedCache<K extends string | number | symbol, V> {
  private readonly key: string;
  private data: Dict<K, V>;
  private ready: boolean;

  constructor(key: string) {
    this.key = key;
    this.data = {} as Dict<K, V>;
    this.ready = false;
  }

  isReady() {
    return this.ready;
  }

  async save() {
    await AsyncStorage.setItem(this.key, JSON.stringify(this.data));
  }

  async init() {
    if (this.isReady()) return;

    const stringData = await AsyncStorage.getItem(this.key);
    this.data = JSON.parse(stringData) || {};
    this.ready = true;

    console.log(`[CACHE] ${this.key.toLowerCase()} is ready to work`);
  }

  get(key: K): V {
    return this.data[key].data;
  }

  getTime(key: K): number {
    return this.data[key].timestamp;
  }

  place(key: K, value: V) {
    this.data[key] = { data: value, timestamp: Date.now() };
  }

  delete(key: K) {
    delete this.data[key];
  }

  async clear() {
    this.data = {} as Dict<K, V>;

    await AsyncStorage.removeItem(this.key);
  }

  values(): V[] {
    return Object.values(this.data);
  }
}
