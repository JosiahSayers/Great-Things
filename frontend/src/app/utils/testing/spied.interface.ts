import { Observer } from 'rxjs';

export type SpyWithObservables = jasmine.Spy & { observer?: Observer<any>, observers?: Observer<any>[] };

export interface ObservableCleanup { cleanupObservables: () => void; }

export interface SetProperties<T> { setProperty: (property: keyof T, value: any) => void; }

export type Spied<T> = { [Method in keyof T]: SpyWithObservables; } & ObservableCleanup & SetProperties<T>;
