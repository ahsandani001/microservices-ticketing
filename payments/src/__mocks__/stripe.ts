const Stripe = jest.fn(() => ({
  charges: {
    create: jest.fn().mockResolvedValue({}),
  },
  paymentIntents: {
    create: jest.fn().mockResolvedValue({ id: 'pi_3RiZ2qRkuqjUGdRE0d9ZWKR4' }),
    list: jest
      .fn()
      .mockResolvedValue({
        data: [
          { id: 'pi_3RiZ2qRkuqjUGdRE0d9ZWKR4', amount: 1000, currency: 'usd' },
        ],
      }),
  },
}));

export = Stripe;
