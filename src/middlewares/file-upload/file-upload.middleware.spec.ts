import { FileUploadMiddleware } from './file-upload.middleware';

describe('FileUploadMiddleware', () => {
  it('should be defined', () => {
    expect(new FileUploadMiddleware()).toBeDefined();
  });
});
