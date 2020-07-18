import { Request, Response, NextFunction } from 'express';
import { greatThingsServiceHelper } from '../services/great-things/great-things-helper.service';
import { logger, baseLogObject } from '../util/logger';

const MIN_LIMIT = 2;
const MAX_LIMIT = 30;
const DEFAULT_LIMIT = 10;

const sortByValidValues = ['createdAt', 'lastUpdatedAt'];

const sortOrderValidValues = ['asc', 'ascending', 'desc', 'descending'];

export const validateQueryParams = (req: Request, res: Response, next: NextFunction): Response | void => {
  const limit = parseInt(<string>req.query['limit']);
  const sortBy = <string>req.query['sort-by'];
  const sortOrder = <string>req.query['sort-order'];
  const searchText = <string>req.query['search'];
  const page = parseInt(<string>req.query['page']);
  const before = parseInt(<string>req.query['before']);
  const after = parseInt(<string>req.query['after']);

  if (limit && limit > MAX_LIMIT) {
    return sendAndLog(`You sent ${ limit } for the limit query param, the max supported value is ${ MAX_LIMIT }.`, req, res);
  } else if (limit && limit < MIN_LIMIT) {
    return sendAndLog(`You sent ${limit} for the limit query param, the min supported value is ${MIN_LIMIT}.`, req, res);
  } else if (!limit) {
    req.query['limit'] = DEFAULT_LIMIT.toString();
  }

  if (sortBy && sortBy.length > 0 && !sortByValidValues.includes(sortBy)) {
    return sendAndLog(`You sent ${sortBy} for the sort-by query param, the valid values are: ${sortByValidValues.join(', ')}`, req, res);
  } else if (!sortBy || sortBy.length === 0) {
    req.query['sort-by'] = 'createdAt';
  }

  if (sortOrder && sortOrder.length > 0 && !sortOrderValidValues.includes(sortOrder)) {
    return sendAndLog(`You sent ${sortOrder} for the sort-order query param, the valid values are: ${sortOrderValidValues.join(', ')}`, req, res);
  } else if (!sortOrder || sortOrder.length === 0) {
    req.query['sort-order'] = 'desc';
  }

  if(searchText) {
    req.query['search'] = greatThingsServiceHelper.sanitizeSearchString(searchText);
  }

  if (page && page < 1) {
    return sendAndLog(`You sent ${page} for the page query param, but it must be a number greater than 0.`, req, res);
  } else if (!page) {
    req.query['page'] = '1';
  }

  if ((!before && !isNaN(before)) || before < 0) {
    return sendAndLog(`You sent ${before} for the before query param, but it must be a valid integer timestamp.`, req, res);
  }
  
  if ((!after && !isNaN(after)) || after < 0) {
    return sendAndLog(`You sent ${after} for the after query param, but it must be a valid integer timestamp.`, req, res);
  }

  return next();
};

export const validateQueryParamsForRandom = (req: Request, res: Response, next: NextFunction): Response | void => {
  const limit = parseInt(<string>req.query['limit']);

  if (limit && limit < MIN_LIMIT) {
    return sendAndLog(`You sent ${limit} for the limit query param, but it must be a number greater than 0.`, req, res);
  } else if (limit && limit > MAX_LIMIT) {
    return sendAndLog(`You sent ${limit} for the limit query param, but it must be a number less than 0.`, req, res);
  } else if (!limit) {
    req.query['limit'] = '1';
  }

  return next();
};

const sendAndLog = (msg: string, req: Request, res: Response, statusCode: number = 400): void => {
  logger.debug({
    msg: 'User sent a request that failed query string validation',
    response: {
      statusCode,
      msg
    },
    ...baseLogObject(req)
  });
  res.status(statusCode).send({ msg });
};
