import { mocked } from 'ts-jest';
import sharp from 'sharp';

describe('PictureHelperService', () => {
  let mockedSharp: 'sharp';

  describe('processImageAndUpload', () => {

    beforeEach(() => {
      jest.mock('sharp');
      mockedSharp = mocked('sharp', true);
    });

  });
});

function spyOn<T>(spiedClass: T) {
  const methods = getMethodNames(spiedClass);
  const spied = spyOnMethods(spiedClass, methods);
  return spied;
}

function getMethodNames<T>(spiedClass: T): string[] {
  const prototype = (<any>spiedClass).prototype;

  return <string[]>Object.getOwnPropertyNames(prototype)
    .map(name => [name, Object.getOwnPropertyDescriptor(prototype, name)])
    .filter(([name, descriptor]) => {
      return (descriptor as PropertyDescriptor).value instanceof Function;
    })
    .map(([name]) => name);
}

function spyOnMethods<T>(spiedClass: T, methodNames: string[]): Spied<T> {
  methodNames.forEach((method) => (<any>spiedClass)[method] = jest.fn());
  return <any>spiedClass;
}

type Spied<T> = {
  [Method in keyof T]: jest.Mock;
}
