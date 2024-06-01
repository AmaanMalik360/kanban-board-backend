import { Injectable, NestMiddleware, UseInterceptors } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as path from 'path';
import * as multer from 'multer';

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  private storage: multer.StorageEngine;

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    this.storage = multer.diskStorage({
      destination: './public/images',
      filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
      },
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    const upload = multer({ storage: this.storage }).single('file');
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: 'File upload failed', error: err.message });
      }
      next();
    });
  }
}
