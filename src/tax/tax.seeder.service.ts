import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tax } from './tax.entity';

@Injectable()
export class TaxSeederService {
  constructor(
    @InjectRepository(Tax)
    private readonly taxRepo: Repository<Tax>,
  ) {}

  async seed() {
    // Check if data already exists to prevent duplicating the brackets
    const count = await this.taxRepo.count();
    if (count > 0) {
      console.log('✅ Tax brackets already seeded!');
      return;
    }

    // Realistic, non-overlapping progressive tax tiers
    const taxBrackets = [
      { minSalary: 0, maxSalary: 350000, percentage: 0 },
      { minSalary: 350001, maxSalary: 450000, percentage: 5 },
      { minSalary: 450001, maxSalary: 750000, percentage: 10 },
      { minSalary: 750001, maxSalary: 1150000, percentage: 15 },
      { minSalary: 1150001, maxSalary: 1650000, percentage: 20 },
      { minSalary: 1650001, maxSalary: 99999999.99, percentage: 25 },
    ];

    const taxes = this.taxRepo.create(taxBrackets);
    await this.taxRepo.save(taxes);

    console.log(`🌱 Tax seeded with ${taxBrackets.length} brackets!`);
  }
}
