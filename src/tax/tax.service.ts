import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Tax } from './tax.entity';
import { CreateTaxDto } from './dtos/tax.dto';

@Injectable()
export class TaxService {
  constructor(
    @InjectRepository(Tax)
    private taxRepository: Repository<Tax>,
  ) {}

  //! create tax
  async createTax(createTaxDto: CreateTaxDto) {
    const existingSlab = await this.taxRepository.findOne({
      where: {
        minSalary: LessThanOrEqual(createTaxDto.maxSalary),
        maxSalary: MoreThanOrEqual(createTaxDto.minSalary),
      },
    });

    if (existingSlab) {
      throw new ConflictException('This slab exists in DB');
    }

    const newTax = this.taxRepository.create(createTaxDto);

    await this.taxRepository.save(newTax);

    return newTax;
  }

  async getAllTax() {
    const data = await this.taxRepository.find({
      select: {
        id: true,
        maxSalary: true,
        minSalary: true,
        percentage: true,
      },
    });

    if (!data) {
      throw new NotFoundException('No Tax Found');
    }
    return data;
  }

  async getTaxById(id: number) {
    const tax = await this.taxRepository.findOne({
      where: { id },
      select: {
        id: true,
        maxSalary: true,
        minSalary: true,
        percentage: true,
      },
    });

    if (!tax) {
      throw new NotFoundException('TAX Not Found!');
    }

    return tax;
  }

  async updateTax(id: number, createTaxDto: CreateTaxDto) {
    const tax = await this.taxRepository.findOne({
      where: { id },
    });

    if (!tax) {
      throw new NotFoundException('Employee Does not exists');
    }

    tax.maxSalary = createTaxDto.maxSalary;
    tax.minSalary = createTaxDto.minSalary;
    tax.percentage = createTaxDto.percentage;

    return await this.taxRepository.save(tax);
  }

  async deleteTax(id: number) {
    const tax = await this.taxRepository.findOne({ where: { id: id } });

    if (!tax) {
      throw new NotFoundException('Tax not found');
    }

    await this.taxRepository.delete(id);

    return {
      success: true,
      message: 'Tax deleted successfully',
    };
  }
}
