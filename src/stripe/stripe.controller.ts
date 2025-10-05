import { Controller, Post, Body, Req, Res, Get, Param } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private configService: ConfigService,
  ) {}

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() body: { courseId: string; courseName: string; coursePrice: number; successUrl: string; cancelUrl: string }) {
    const session = await this.stripeService.createCheckoutSession(
      body.courseId,
      body.courseName,
      body.coursePrice,
      body.successUrl,
      body.cancelUrl,
    );
    return { sessionId: session.id };
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new Error('Stripe webhook secret is not configured.');
    }

    let event: Stripe.Event;

    try {
      if (!sig) {
        throw new Error("Stripe-Signature header missing.");
      }
      event = await this.stripeService.constructWebhookEvent(req.body, sig as string, webhookSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Checkout session completed: ${session.id}`);
        // TODO: Fulfill the purchase, e.g., update enrollment status in your DB
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent was successful: ${paymentIntent.id}`);
        // TODO: Handle successful payment
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  }

  @Get('session-status/:sessionId')
  async getSessionStatus(@Param('sessionId') sessionId: string) {
    const session = await this.stripeService.retrieveSession(sessionId);
    return { status: session.status, payment_status: session.payment_status };
  }

  @Get('payment-intent-status/:paymentIntentId')
  async getPaymentIntentStatus(@Param('paymentIntentId') paymentIntentId: string) {
    const paymentIntent = await this.stripeService.retrievePaymentIntent(paymentIntentId);
    return { status: paymentIntent.status, amount: paymentIntent.amount };
  }
}
