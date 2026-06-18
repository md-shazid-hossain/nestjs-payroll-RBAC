import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeTable } from './stripe.entity';
import { Payroll } from '../payroll/payroll.entity';
import { Employees } from '../employees/employees.entity';
import Stripe from 'stripe';
@Module({
  imports: [TypeOrmModule.forFeature([StripeTable, Employees, Payroll])],
  controllers: [StripeController],
  providers: [
    StripeService,
    {
      provide: 'STRIPE_CLIENT',
      useFactory: () => {
        return new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: '2026-05-27.dahlia',
        });
      },
    },
  ],
})
export class StripeModule {}
