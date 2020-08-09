import { Type } from '@angular/core';
import { Spied } from './spied.interface';

export function spyOnClass<T>(spiedClass: Type<T>): Spied<T> {
  const prototype = spiedClass.prototype;

  const methods = Object.getOwnPropertyNames(prototype)
    .map(name => [name, Object.getOwnPropertyDescriptor(prototype, name)])
    .filter(([name, descriptor]) => {
      return (descriptor as PropertyDescriptor).value instanceof Function;
    })
    .map(([name]) => name);

  return jasmine.createSpyObj('spy', [...methods]);
}
