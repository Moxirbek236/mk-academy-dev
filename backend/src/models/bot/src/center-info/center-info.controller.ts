import { Body, Controller, Get, Put } from '@nestjs/common';
import { CenterInfoService } from './center-info.service';
import { UpdateCenterInfoDto } from './dto/update-center-info.dto';

@Controller('center-info')
export class CenterInfoController {
  constructor(private readonly centerInfoService: CenterInfoService) {}

  @Get()
  getCenterInfo() {
    return this.centerInfoService.getCenterInfo();
  }

  @Put()
  upsert(@Body() dto: UpdateCenterInfoDto) {
    return this.centerInfoService.upsert(dto);
  }
}
