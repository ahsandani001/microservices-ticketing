import express, { Request, Response, RequestHandler } from 'express';

import { currentUser } from '@tickets-packages/common';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
