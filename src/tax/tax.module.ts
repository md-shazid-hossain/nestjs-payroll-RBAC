import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tax } from './tax.entity';
import { TaxController } from './tax.controller';
import { TaxService } from './tax.service';
import { TaxSeederService } from './tax.seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tax])],
  controllers: [TaxController],
  providers: [TaxService, TaxSeederService],
})
export class TaxModule {}
