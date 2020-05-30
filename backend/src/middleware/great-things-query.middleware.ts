import { Request, Response, NextFunction } from 'express';

const MAX_LIMIT = 30;
const DEFAULT_LIMIT = 10;

const sortByValidValues = ['createdAt', 'lastUpdatedAt'];

const sortOrderValidValues = ['asc', 'ascending', 'desc', 'descending'];

export const validateQueryParams = (req: Request, res: Response, next: NextFunction): Response | void => {
  const limit = parseInt(<string>req.query['limit']);
  const sortBy = <string>req.query['sort-by'];
  const sortOrder = <string>req.query['sort-order'];

  if (limit && limit > MAX_LIMIT) {
    return res.status(400).send({ msg: `You sent ${limit} for the limit query param, the max supported value is ${30}.` });
  } else if (!limit) {
    req.query['limit'] = DEFAULT_LIMIT.toString();
  }

  if (sortBy && sortBy.length > 0 && !sortByValidValues.includes(sortBy)) {
    return res.status(400).send({ msg: `You sent ${sortBy} for the sort-by query param, the valid values are: ${sortByValidValues.join(', ')}` });
  } else if (!sortBy || sortBy.length === 0) {
    req.query['sort-by'] = 'createdAt';
  }

  if (sortOrder && sortOrder.length > 0 && !sortOrderValidValues.includes(sortOrder)) {
    return res.status(400).send({ msg: `You sent ${sortOrder} for the sort-order query param, the valid values are: ${sortOrderValidValues.join(', ')}` });
  } else if (!sortOrder || sortOrder.length === 0) {
    req.query['sort-order'] = 'desc';
  }

  return next();
};
