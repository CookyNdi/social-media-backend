import { db } from '../libs/db';
import { type Request, type Response } from 'express';

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const data = await db.users.findUnique({
    where: {
      username: 'CookyNdi',
    },
  });
  res.status(200).json({ data: data });
};
