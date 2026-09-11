declare module 'lodash.isequal' {
  type Customizer = (value: unknown, other: unknown, indexOrKey?: number | string) => boolean | undefined;

  function isEqual(value: unknown, other: unknown, customizer?: Customizer): boolean;
  export = isEqual;
}
