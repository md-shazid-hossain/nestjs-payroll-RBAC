import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  // ApiResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session/:emp_id')
  @ApiOperation({
    summary: 'Create a new checkout session',
    description:
      'Creates a Stripe checkout session for a specific employee to process payment.',
  })
  @ApiParam({
    name: 'emp_id',
    description: 'Employee ID',
    type: Number,
    example: 12345,
  })
  @ApiCreatedResponse({
    description: 'Checkout session created successfully',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://checkout.stripe.com/c/pay/cs_test_...',
        },
        id: { type: 'string', example: 'cs_test_a1b2c3...' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid employee ID provided' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  async createCheckoutSession(@Param('emp_id') emp_id: number) {
    const sessionData = await this.stripeService.createPaymentIntent(emp_id);
    return sessionData;
  }

  @Get('/session-status')
  @ApiOperation({
    summary: 'Get checkout session status',
    description: 'Retrieves the current status of a Stripe checkout session.',
  })
  @ApiQuery({
    name: 'session_id',
    description: 'Stripe checkout session ID',
    required: true,
    type: String,
    example: 'cs_test_a1b2c3d4e5f6g7h8i9j0',
  })
  @ApiOkResponse({
    description: 'Session status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['complete', 'expired', 'open'],
          example: 'complete',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid session ID provided' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  async sessionStatus(@Query('session_id') sessionId: string) {
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
