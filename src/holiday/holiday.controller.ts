import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

import { HolidayService } from './holiday.service';
import { HolidayCreateDto } from './dtos/holidayCreate.dto';
import { HolidayUpdateDto } from './dtos/holidayUpdate.dto';

@ApiTags('Holiday')
@Controller('holiday')
export class HolidayController {
  constructor(private holidayService: HolidayService) {}

  @Post()
  @ApiOperation({ summary: 'Create holiday' })
  @ApiBody({ type: HolidayCreateDto })
  @ApiResponse({ status: 201, description: 'Holiday created successfully' })
  createHoliday(@Body() holidayCreateDto: HolidayCreateDto) {
    return this.holidayService.createHoliday(holidayCreateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all holidays' })
  @ApiResponse({ status: 200, description: 'List of holidays' })
  getAllHolidays() {
    return this.holidayService.getAllHolidays();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get holiday by id' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Holiday ID' })
  @ApiResponse({ status: 200, description: 'Holiday found' })
  @ApiResponse({ status: 404, description: 'Holiday not found' })
  getHolidayById(@Param('id', ParseIntPipe) id: number) {
    return this.holidayService.getHolidayById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update holiday' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: HolidayUpdateDto })
  @ApiResponse({ status: 200, description: 'Holiday updated successfully' })
  @ApiResponse({ status: 404, description: 'Holiday not found' })
  updateHoliday(
    @Param('id', ParseIntPipe) id: number,
    @Body() holidayUpdateDto: HolidayUpdateDto,
  ) {
    return this.holidayService.updateHoliday(id, holidayUpdateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a holiday' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Holiday ID' })
  @ApiResponse({ status: 200, description: 'Holiday deleted successfully' })
  @ApiResponse({ status: 404, description: 'Holiday not found' })
  async deleteHoliday(@Param('id', ParseIntPipe) id: number) {
    return await this.holidayService.deleteHoliday(id);
  }
}
