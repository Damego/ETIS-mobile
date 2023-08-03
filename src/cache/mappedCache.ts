import AsyncStorage from '@react-native-async-storage/async-storage';

export default class MappedCache<Key extends string | number | symbol, Value> {
  private readonly key: string;
  private data: Map<Key, Value>;

  constructor(key: string) {
    this.key = key;
    this.data = new Map();
  }

  async stringify() {
    await AsyncStorage.setItem(this.key, JSON.stringify(this.data));
  }

  async init() {
    const stringData = await AsyncStorage.getItem(this.key);
    this.data = JSON.parse(stringData);
  }

  async get(key: Key): Promise<Value> {
    return this.data.get(key);
  }

  async place(key: Key, value: Value) {
    this.data.set(key, value);
  }

  async delete(key: Key) {
    this.data.delete(key);
  }

  async clear() {
    this.data.clear();

    await AsyncStorage.removeItem(this.key);
  }
}
