import AsyncStorage from '@react-native-async-storage/async-storage';

type Dict<KT extends string | number | symbol, VT> = { [key in KT]: VT };

export default class MappedCache<KT extends string | number | symbol, VT> {
  private readonly key: string;
  private data: Dict<KT, VT>;
  private timestamp: number;
  private ready: boolean;

  constructor(key: string) {
    this.key = key;
    this.data = {} as Dict<KT, VT>;
    this.timestamp = 0;
    this.ready = false;
  }

  isReady() {
    return this.ready;
  }

  async save() {
    await AsyncStorage.setItem(
      this.key,
      JSON.stringify({ data: this.data, timestamp: this.timestamp })
    );
  }

  async init() {
    if (this.isReady()) return;

    const stringData = await AsyncStorage.getItem(this.key);
    const { data, timestamp } = JSON.parse(stringData);
    this.data = data || {};
    this.timestamp = timestamp;
    this.ready = true;

    console.log(`[CACHE] ${this.key.toLowerCase()} is ready to work`);
  }

  get(key: KT): VT {
    return this.data[key];
  }

  getTime() {
    return this.timestamp;
  }

  place(key: KT, value: VT) {
    this.data[key] = value;
    this.timestamp = Date.now();
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
