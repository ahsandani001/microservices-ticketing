export enum OrderStatus {
  // Order is created but ticket it is trying to order is not reserved
  Created = 'created',

  // The ticket is trying to reserved has already been reserved
  // OR user has cancelled the order
  // OR The order expires before payment
  Cancelled = 'cancelled',

  // The order has successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',

  // The order has reserved the ticket and user has completed payment
  Complete = 'complete',
}
