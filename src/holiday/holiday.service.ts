import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Holiday } from './holiday.entity';
import { HolidayCreateDto } from './dtos/holidayCreate.dto';
import { ConflictException } from '@nestjs/common';
import { HolidayUpdateDto } from './dtos/holidayUpdate.dto';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday)
    private holidayRepository: Repository<Holiday>,
  ) {}

  async createHoliday(holidayCreateDto: HolidayCreateDto) {
    const existingHoliday = await this.holidayRepository.findOneBy({
      date: holidayCreateDto.date,
    });

    if (existingHoliday) {
      throw new ConflictException('Holiday with this date already exists');
    } else {
      const existingHolidayByName = await this.holidayRepository.findOneBy({
        name: holidayCreateDto.name,
      });
      if (existingHolidayByName) {
        throw new ConflictException('Holiday with this name already exists');
      }
    }
    const holiday = this.holidayRepository.create(holidayCreateDto);
    return this.holidayRepository.save(holiday);
  }

  async getAllHolidays() {
    const holidays = await this.holidayRepository.find({
      select: { id: true, date: true, name: true, type: true },
    });

    if (!holidays) {
      throw new NotFoundException('No Holidays Found!');
    }

    return holidays;
  }

  async getHolidayById(id: number) {
    const holiday = await this.holidayRepository.findOne({
      where: { id: id },
      select: { id: true, date: true, name: true, type: true },
    });

    if (!holiday) {
      throw new NotFoundException('No Holiday Found!');
    }

    return holiday;
  }

  async updateHoliday(id: number, holidayUpdateDto: HolidayUpdateDto) {
    const holiday = await this.holidayRepository.findOneBy({ id });
    if (!holiday) {
      throw new Error('Holiday not found');
    }
    Object.assign(holiday, holidayUpdateDto);
    return this.holidayRepository.save(holiday);
  }

  async deleteHoliday(id: number) {
    const holiday = await this.holidayRepository.findOneBy({ id });
    if (!holiday) {
      throw new NotFoundException('Holiday not found');
    }
    await this.holidayRepository.delete(id);

    return {
      success: true,
      message: 'Holiday Deleted successfully!',
    };
  }
}
