import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employees } from '../employees/employees.entity';
import { Payroll } from '../payroll/payroll.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { StripeTable } from './stripe.entity';

@Injectable()
export class StripeService {
  private stripe: Stripe.Stripe;

  constructor(
    @InjectRepository(Employees)
    private employeeRepository: Repository<Employees>,

    @InjectRepository(Payroll)
    private readonly payrollRepository: Repository<Payroll>,

    @InjectRepository(StripeTable)
    private readonly stripeRepository: Repository<StripeTable>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-05-27.dahlia',
    });
  }

  async createPaymentIntent(emp_id: number) {
    const employeeExists = await this.employeeRepository.findOne({
      where: { id: emp_id },
    });

    if (!employeeExists) {
      throw new NotFoundException('Employee Not Found!');
    }

    const payAmount = await this.payrollRepository.findOne({
      where: { employee: { id: emp_id } },
    });

    if (!payAmount) {
      throw new NotFoundException('Payroll Not Found!');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Employee Salary',
            },
            unit_amount: Math.trunc(Number(payAmount.gross)),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });

    // console.log(session);

    return { url: session.url, sessionId: session.id };
  }
}
