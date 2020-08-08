import { TestBed } from '@angular/core/testing';

import { WebStorageService } from './web-storage.service';
import { Spied } from '../../../utils/testing/spied.interface';

describe('StorageService', () => {
  let service: WebStorageService;
  const mockWindow = {
    localStorage: jasmine.createSpyObj('localStorage', [
      'setItem',
      'getItem',
      'removeItem',
      'clear'
    ])
  };
  const storage: Spied<Storage> = mockWindow.localStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WebStorageService,
        {
          provide: 'window',
          useValue: mockWindow
        }
      ]
    });
    service = TestBed.inject(WebStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('set', () => {
    it('calls localStorage.setItem', () => {
      service.set('KEY', 'VALUE');
      expect(storage.setItem).toHaveBeenCalledWith('KEY', 'VALUE');
    });
  });

  describe('get', () => {
    it('calls localStorage.getItem and returns the value returned from that call', () => {
      storage.getItem.and.returnValue('RETURNED_STRING');
      expect(service.get('KEY')).toBe('RETURNED_STRING');
      expect(storage.getItem).toHaveBeenCalledWith('KEY');
    });
  });

  describe('remove', () => {
    it('calls localStorage.removeItem', () => {
      service.remove('KEY');
      expect(storage.removeItem).toHaveBeenCalledWith('KEY');
    });
  });

  describe('removeAll', () => {
    it('calls localStorage.clear', () => {
      service.removeAll();
      expect(storage.clear).toHaveBeenCalledWith();
    });
  });
});
