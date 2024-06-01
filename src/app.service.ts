import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This is Kanban Board. We are making a kanban board here. Do you wanna see it';
  }
}
