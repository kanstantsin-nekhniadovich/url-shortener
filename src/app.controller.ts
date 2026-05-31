import { Controller, Get } from '@nestjs/common';

@Controller('healthcheck')
export class AppController {
  constructor() {}

  @Get()
  heathcheck() {
    return { message: 'Service is alive' };
  }
}
