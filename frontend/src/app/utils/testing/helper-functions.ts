import { Type } from '@angular/core';
import { Spied, SpyWithObservables } from './spied.interface';
import { Observable } from 'rxjs';

export function provideMock<T>(spiedClass: Type<T>, localVariable: Spied<T>, observables?: (keyof T)[]): ProviderMock {
  const spy = spyOnClass(spiedClass, observables);
  const output = {
    provide: spiedClass,
    useFactory: () => localVariable = spy
  };
  return output;
}

export function spyOnClass<T>(spiedClass: Type<T>, observables?: (keyof T)[]): Spied<T> {
  const prototype = spiedClass.prototype;
  let spy = jasmine.createSpyObj('spy', getMethodNames(prototype), getPropertyNames(prototype));
  spy = stubObservables(spy, observables);
  return spy;
}

function getMethodNames(prototype): string[] {
  const methodNames: string[] = [];

  while (prototype.constructor !== Object) {
    Object.getOwnPropertyNames(prototype)
      .map(name => [name, Object.getOwnPropertyDescriptor(prototype, name)])
      .filter(([name, descriptor]) => {
        return (descriptor as PropertyDescriptor).value instanceof Function;
      })
      .forEach(([name]) => methodNames.push(<string>name));

    prototype = prototype.__proto__;
  }
  return methodNames;
}

function getPropertyNames(prototype): string[] {
  const propertyNames: string[] = [];

  while (prototype.constructor !== Object) {
    Object.getOwnPropertyNames(prototype)
      .map(name => [name, Object.getOwnPropertyDescriptor(prototype, name)])
      .filter(([name, descriptor]) => !!(descriptor as PropertyDescriptor).get)
      .map(([name]) => propertyNames.push(<string>name));

    prototype = prototype.__proto__;
  }

  return propertyNames;
}

function stubObservables<T>(spy: Spied<T>, observables: (keyof T)[] = []): Spied<T> {
  observables.forEach((obsName) => {
    const nameAsString = <string>obsName;
    const spiedMethod = <SpyWithObservables>spy[nameAsString];

    if (spiedMethod) {
      spiedMethod.observers = [];
      spiedMethod.and.returnValue(new Observable((observer) => {
        spiedMethod.observer = observer;
        spiedMethod.observers.push(observer);
      }));
    }
  });

  spy.cleanupObservables = cleanupObservables;

  return spy;
}

function cleanupObservables(): void {
  Object.keys(this).forEach(key => {
    if (this[key].observers) {
      this[key].observers.forEach((obs) => obs.complete());
    }
  });
}

export interface ProviderMock {
  provide: any;
  useFactory: () => any;
}
