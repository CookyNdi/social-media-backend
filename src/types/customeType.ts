import { Request } from 'express';
import { UploadedFile } from 'express-fileupload';

export type CustomRequest = Request & {
  userId: string;
  projectId: string;
  taskId: string;
  files: UploadedFile | undefined;
};
