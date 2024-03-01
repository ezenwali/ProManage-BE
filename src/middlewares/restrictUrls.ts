import { HttpStatus } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { environmentVariables } from 'src/config/env.variables';
import { includes } from 'lodash';

export function restrictUrl(req: Request, res: Response, next: NextFunction) {
  if (includes(environmentVariables.origins, req.get('origin'))) {
    return next();
  }

  res.status(HttpStatus.UNAUTHORIZED).send('You cannot access this API');
}
