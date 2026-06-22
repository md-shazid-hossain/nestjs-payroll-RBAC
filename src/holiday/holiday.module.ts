import { Module } from '@nestjs/common';
import { HolidayController } from './holiday.controller';
import { HolidayService } from './holiday.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from './holiday.entity';
import { HolidaySeederService } from './holiday.seeder.service';

@Module({
  controllers: [HolidayController],
  providers: [HolidayService, HolidaySeederService],
  imports: [TypeOrmModule.forFeature([Holiday])],
})
export class HolidayModule {}
