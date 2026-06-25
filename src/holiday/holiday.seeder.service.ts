import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Holiday } from './holiday.entity';

@Injectable()
export class HolidaySeederService {
  constructor(
    @InjectRepository(Holiday)
    private readonly holidayRepo: Repository<Holiday>,
  ) {}

  async seed() {
    const holidays: Holiday[] = [];

    for (let i = 0; i < 50; i++) {
      const randomDate = faker.date.between({
        from: '2026-01-01',
        to: '2026-12-31',
      });

      holidays.push(
        this.holidayRepo.create({
          name: faker.word.noun() + '-holiday-' + faker.string.alphanumeric(5),

          date: randomDate,

          type: faker.helpers.arrayElement([
            'National',
            'Public',
            'Religious',
            'Optional',
            'Company',
          ]),
        }),
      );
    }

    await this.holidayRepo.save(holidays);

    console.log('🌱 Holidays seeded!');
  }
}
