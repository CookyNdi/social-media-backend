import { Request, Response } from 'express';
import argon2 from 'argon2';

import { sendApiResponse } from '../libs/helpers/respone';
import { db } from '../libs/db';
import { getSingleUser, imageHandler } from '../libs/user';

import { CustomRequest } from '../types/customeType';
import { userRequest } from '../types/userType';
import { createAccessToken } from '../libs/helpers/jwtConfig';

export const getUserByUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await db.users.findUnique({
      where: {
        username: req.params.username,
      },
    });
    if (!data) {
      return sendApiResponse(res, 'error', 404, null, 'user not found');
    }
    sendApiResponse(res, 'success', 200, data, null);
  } catch (error) {
    sendApiResponse(res, 'error', 500, null, error.message);
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, confirmPassword }: userRequest = req.body;
    if (password !== confirmPassword) {
      return sendApiResponse(res, 'error', 400, null, 'Password not match');
    }
    const hashPassword = await argon2.hash(password);
    await db.users.create({ data: { name: username, username, email, password: hashPassword } });
    sendApiResponse(res, 'success', 201, null, 'Registered successfuly');
  } catch (error) {
    sendApiResponse(res, 'error', 500, null, error.meta.target[0]);
  }
};

export const updateUserData = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { name, bio }: userRequest = req.body;
    const { banner, profileImage }: userRequest = req.files || {};
    const user = await getSingleUser('clpqpi7840000lyxv2sqqr7g5');
    const banner_url = imageHandler(req, banner, 'user/banner', user.banner_url);
    if (!banner_url.valid) return sendApiResponse(res, 'error', 422, null, banner_url.message);

    const profile_image_url = imageHandler(req, profileImage, 'user/profile-image', user.profile_image_url);
    if (!profile_image_url.valid) return sendApiResponse(res, 'error', 422, null, profile_image_url.message);

    await db.users.update({
      where: { id: 'clpqpi7840000lyxv2sqqr7g5' },
      data: {
        name: name,
        bio: bio,
        banner_url: banner_url.url || user.banner_url,
        profile_image_url: profile_image_url.url || user.profile_image_url,
      },
    });
    sendApiResponse(res, 'success', 200, null, 'Update user data successfuly');
  } catch (error) {
    sendApiResponse(res, 'error', 500, null, error);
  }
};

export const updateEmail = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { email, password }: userRequest = req.body;
    const user = await getSingleUser(req.userId);
    const passwordMatch = argon2.verify(user.password, password);
    if (!passwordMatch) {
      return sendApiResponse(res, 'error', 400, null, 'Password not match');
    }
    await db.users.update({ where: { id: req.userId }, data: { email } });
    sendApiResponse(res, 'success', 200, null, 'Update email successfuly');
  } catch (error) {
    sendApiResponse(res, 'error', 500, null, error.meta.target[0]);
  }
};

export const updatePassword = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { password, confirmPassword, oldPassword }: userRequest = req.body;
    if (password !== confirmPassword) {
      return sendApiResponse(res, 'error', 400, null, 'Password not match');
    }
    const user = await getSingleUser(req.userId);
    const oldPasswordMatch = argon2.verify(user.password, oldPassword);
    if (!oldPasswordMatch) {
      return sendApiResponse(res, 'error', 400, null, 'Old password not match');
    }
    const hashPassword = await argon2.hash(password);
    await db.users.update({ where: { id: req.userId }, data: { password: hashPassword } });
    sendApiResponse(res, 'success', 200, null, 'Update password successfuly');
  } catch (error) {
    sendApiResponse(res, 'error', 500, null, error.meta.target[0]);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password }: userRequest = req.body;
    const user = await db.users.findUnique({ where: { username } });
    if (!user) {
      return sendApiResponse(res, 'error', 404, null, 'Username not registered');
    }
    const passwordMatch = await argon2.verify(user.password, password);
    if (!passwordMatch) {
      return sendApiResponse(res, 'error', 400, null, 'Old password not match');
    }
    const accessToken = createAccessToken(user.username);
    res.cookie('access_token', accessToken, {
      maxAge: 86400000,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    sendApiResponse(res, 'error', 400, null, 'Login Successfully');
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
