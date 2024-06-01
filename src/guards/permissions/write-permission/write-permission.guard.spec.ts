import { WritePermissionGuard } from './write-permission.guard';

describe('WritePermissionGuard', () => {
  it('should be defined', () => {
    expect(new WritePermissionGuard()).toBeDefined();
  });
});
