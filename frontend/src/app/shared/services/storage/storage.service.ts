export abstract class StorageService {
  set: (key: string, value: string) => void;
  get: (key: string) => string;
  remove: (key: string) => void;
  removeAll: () => void;
}
