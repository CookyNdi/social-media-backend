import { Response, NextFunction } from 'express';

import { db } from '../libs/db';
import { sendApiResponse } from '../libs/helpers/respone';
import { verifyAccessToken } from '../libs/helpers/jwtConfig';
import { CustomRequest } from '@/types/customeType';

export const authentication = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.access_token;
  if (!accessToken) {
    return sendApiResponse(res, 'error', 401, null, 'Please Login First!');
  }
  try {
    const { valid, message, data } = verifyAccessToken(accessToken);
    if (!valid) {
      return res.status(400).json({ msg: message });
    }
    const user = await db.users.findUnique({
      where: { username: data },
      select: { id: true },
    });
    if (user == null) {
      return res.status(404).json({ msg: 'User Not Found' });
    }
    req.userId = user.id;
    next();
  } catch (error) {
    return sendApiResponse(res, 'error', 500, null, error.message);
  }
};
