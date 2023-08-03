import AsyncStorage from '@react-native-async-storage/async-storage';

export default class FieldCache<Value> {
  private readonly key: string;
  private data: Value;

  constructor(key: string) {
    this.key = key;
    this.data = null;
  }

  async save() {
    await AsyncStorage.setItem(this.key, JSON.stringify(this.data));
  }

  async init() {
    const stringData = await AsyncStorage.getItem(this.key);
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
    await AsyncStorage.removeItem(this.key);
  }
}
