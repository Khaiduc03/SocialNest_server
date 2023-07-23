import { BadRequestException, Controller, ForbiddenException, Get, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common';


@Controller('test')
export class TestController {

  @Get()
  @UseFilters(new HttpExceptionFilter())
  test() {
    throw new BadRequestException();
  }

}
