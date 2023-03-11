import { Controller, Delete } from '@nestjs/common';

@Controller('testing')
export class TestController {
  @Delete('/all-data')
  deleteAllData() {}
}
