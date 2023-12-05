import { UploadedFile } from 'express-fileupload';

export type userRequest = {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  oldPassword?: string;
  bio?: string;
  banner?: UploadedFile | undefined;
  profileImage?: UploadedFile | undefined;
};
