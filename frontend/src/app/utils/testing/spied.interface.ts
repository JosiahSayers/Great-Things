export type Spied<T> = {
  [Method in keyof T]: jasmine.Spy;
};

export interface Writeable<T> {
  setProperty<P extends keyof T>(propertyName: P, value: T[P]): void;
}

export type Stubbed<T> = Spied<T> & Writeable<T>;
