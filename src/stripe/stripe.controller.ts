import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session/:emp_id')
  async createCheckoutSession(@Param('emp_id') emp_id: number) {
    const sessionData = await this.stripeService.createPaymentIntent(emp_id);
    // return { url: sessionData.url };
    return sessionData;
  }

  @Get('/session-status')
  async sessionStatus(@Query('session_id') sessionId) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-05-27.dahlia',
    });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log(session);

    return {
      status: session.status,
    };
  }
}
