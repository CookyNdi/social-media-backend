import { UploadedFile } from 'express-fileupload';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';

import { db } from '../db';
import { imageHandlerType } from '../../types/userHelperType';

export const getSingleUser = async (id: string) => {
  const data = await db.users.findUnique({ where: { id } });
  return data;
};

export const imageHandler = (
  req: Request,
  image: UploadedFile,
  dest: string,
  oldImage: string | null
): imageHandlerType => {
  console.log(image);
  if (!image) return { valid: true, message: null, url: null };

  const ext = path.extname(image.name);
  const imageName = image.md5 + ext;
  const url = `${req.protocol}://${req.get('host')}/storage/${dest}/${imageName}`;
  const allowedType = ['.png', '.jpg', '.jpeg', '.webp'];

  if (!allowedType.includes(ext.toLowerCase())) return { valid: false, message: 'Invalid image format', url: null };
  if (image.size > 1000000) return { valid: false, message: 'Image size exceeds the limit', url: null };
  if (oldImage) {
    const pathImage = oldImage.replace(`${req.protocol}://${req.get('host')}`, '');
    fs.unlinkSync(`./public/${pathImage}`);
  }

  image.mv(`./public/storage/${dest}/${imageName}`, (error) => {
    if (error) {
      console.error('Error moving the file:', error);
    }
  });

  return { valid: true, message: null, url };
};
