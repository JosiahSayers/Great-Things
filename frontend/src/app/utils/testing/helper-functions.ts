import { Type } from '@angular/core';
import { Spied } from './spied.interface';

export function spyOnClass<T>(spiedClass: Type<T>): Spied<T> {
  const prototype = spiedClass.prototype;

  const methods = Object.getOwnPropertyNames(prototype)
    // Object.getOwnPropertyDescriptor is required to filter functions
    .map(name => [name, Object.getOwnPropertyDescriptor(prototype, name)])
    .filter(([name, descriptor]) => {
      // select only functions
      return (descriptor as PropertyDescriptor).value instanceof Function;
    })
    .map(([name]) => name);
  // return spy object 
  return jasmine.createSpyObj('spy', [...methods]);
}

export function provideMock<T>(spiedClass: Type<T>, localVariable?: Spied<T>) {
  const spied = spyOnClass(spiedClass);
  localVariable = spied;

  return {
    provide: spiedClass,
    useValue: localVariable
  };
}
