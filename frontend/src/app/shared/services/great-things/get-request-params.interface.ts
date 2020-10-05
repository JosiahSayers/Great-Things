export interface GetRequestParams {
  'sort-order'?: 'desc' | 'asc';
  'sort-by'?: 'createdAt' | 'lastUpdatedAt';
  page?: number;
  after?: number;
  before?: number;
  limit?: number;
  search?: string;
}
