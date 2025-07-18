import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // Create an intance of ticket
  const ticket = Ticket.build({ title: 'concert', price: 20, userId: '123' });

  // Save the ticket to DB
  await ticket.save();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save the first fetched ticket
  await firstInstance!.save();

  // Save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    return;
  }

  throw new Error('Should not reach to this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({ title: 'concert', price: 20, userId: '123' });
  await ticket.save();

  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
