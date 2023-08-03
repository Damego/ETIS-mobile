import AsyncStorage from '@react-native-async-storage/async-storage';

export default class FieldCache<Value> {
  private readonly key;
  private data: Value;

  constructor(key) {
    this.key = key;
    this.data = null;

    this.init();
  }

  async stringify() {
    await AsyncStorage.setItem(this.key, JSON.stringify(this.data));
  }
  async init() {
    const stringData = await AsyncStorage.getItem(this.key);
    this.data = JSON.parse(stringData);
  }
  async get() {
    return this.data;
  }
  async place(value: Value) {
    this.data = value;
    await this.stringify();
  }
  async delete() {
    this.data = null;
    await AsyncStorage.removeItem(this.key);
  }
}
