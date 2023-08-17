import AsyncStorage from '@react-native-async-storage/async-storage';

type Dict<KT extends string | number | symbol, VT> = {
  [key in KT]: { data: VT; timestamp: number };
};

export default class MappedCache<KT extends string | number | symbol, VT> {
  private readonly key: string;
  private data: Dict<KT, VT>;
  private ready: boolean;

  constructor(key: string) {
    this.key = key;
    this.data = {} as Dict<KT, VT>;
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

  get(key: KT): VT {
    return this.data[key].data;
  }

  getTime(key: KT): number {
    return this.data[key].timestamp;
  }

  place(key: KT, value: VT) {
    this.data[key] = { data: value, timestamp: Date.now() };
  }

  delete(key: KT) {
    delete this.data[key];
  }

  async clear() {
    this.data = {} as Dict<KT, VT>;

    await AsyncStorage.removeItem(this.key);
  }

  values(): VT[] {
    return Object.values(this.data);
  }
}
