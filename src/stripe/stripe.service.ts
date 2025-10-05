import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key is not configured.');
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-09-30.clover',
    });
  }

  async createCheckoutSession(
    courseId: string,
    courseName: string,
    coursePrice: number,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>,
  ): Promise<Stripe.Checkout.Session> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: courseName,
              description: `Enrollment for course: ${courseName}`,
            },
            unit_amount: Math.round(coursePrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        courseId,
        ...metadata,
      },
    });

    return session;
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, string>,
  ): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
    });

    return paymentIntent;
  }

  async createCustomer(
    email: string,
    name: string,
    metadata?: Record<string, string>,
  ): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.create({
      email,
      name,
      metadata,
    });

    return customer;
  }

  async retrieveCustomer(customerId: string): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.retrieve(customerId);
    return customer as Stripe.Customer;
  }

  async createSubscription(
    customerId: string,
    priceId: string,
    metadata?: Record<string, string>,
  ): Promise<Stripe.Subscription> {
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata,
    });

    return subscription;
  }

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  }

  async constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
    webhookSecret: string,
  ): Promise<Stripe.Event> {
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.retrieve(sessionId);
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.retrieve(paymentIntentId);
  }
}
