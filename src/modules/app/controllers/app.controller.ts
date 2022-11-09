import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AppService } from '../services';

@Controller()
@ApiExcludeController()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  async dashboardRender() {
    return {
      layout: false,
      title: 'Dashbord page',
    };
  }
}
