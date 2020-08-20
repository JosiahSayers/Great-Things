import { Observer } from 'rxjs';

export type SpyWithObservables = jasmine.Spy & { observer?: Observer<any>, observers?: Observer<any>[] };

export interface ObservableCleanup { cleanupObservables: () => void; }

export type Spied<T> = { [Method in keyof T]: SpyWithObservables; } & ObservableCleanup;
