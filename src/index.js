import { callRpc, supabase } from './supabaseClient.js';

async function checkAvailability(clothId, from, to) {
  const available = await callRpc('check_availability', {
    p_cloth_id: clothId,
    p_from: from,
    p_to: to,
  });

  console.log(`Cloth ${clothId} available ${from} → ${to}:`, available);
  return available;
}

async function createBooking({
  clothId,
  customerName,
  phone,
  email,
  bookingFrom,
  bookingTo,
  remarks = null,
}) {
  const bookingId = await callRpc('create_booking', {
    p_cloth_id: clothId,
    p_customer_name: customerName,
    p_phone: phone,
    p_email: email,
    p_booking_from: bookingFrom,
    p_booking_to: bookingTo,
    p_remarks: remarks,
  });

  console.log('Booking created with id:', bookingId);
  return bookingId;
}

async function listClothes() {
  const { data, error } = await supabase
    .from('clothes')
    .select('id, name, category, festival, price, active')
    .eq('active', true)
    .order('name');

  if (error) {
    throw new Error(`Failed to list clothes: ${error.message}`);
  }

  console.log('Available clothes:');
  console.table(data);
  return data;
}

const commands = {
  'check-availability': async () => {
    const clothId = process.argv[3] ?? '1';
    const from = process.argv[4] ?? '2026-10-01';
    const to = process.argv[5] ?? '2026-10-03';
    await checkAvailability(clothId, from, to);
  },
  'create-booking': async () => {
    await createBooking({
      clothId: process.argv[3] ?? '1',
      customerName: process.argv[4] ?? 'Test Customer',
      phone: process.argv[5] ?? '9876543210',
      email: process.argv[6] ?? 'test@example.com',
      bookingFrom: process.argv[7] ?? '2026-10-01',
      bookingTo: process.argv[8] ?? '2026-10-03',
    });
  },
  'list-clothes': listClothes,
};

async function main() {
  const command = process.argv[2];

  if (!command || command === 'help') {
    console.log(`
Festive Clothing — Supabase RPC demo

Usage:
  npm start                          Run default demo (list clothes + check availability)
  npm run list-clothes               List active clothes
  npm run check-availability -- <clothId> <from> <to>
  npm run create-booking -- <clothId> <name> <phone> <email> <from> <to>

Setup:
  1. Copy .env.example to .env and add your Supabase credentials
  2. Run sql/rpc_functions.sql in the Supabase SQL Editor
  3. npm install && npm start
`);
    return;
  }

  const handler = commands[command];
  if (!handler) {
    throw new Error(`Unknown command: ${command}. Run "npm start help" for usage.`);
  }

  await handler();
}

async function runDefaultDemo() {
  console.log('--- Listing clothes ---');
  await listClothes();

  console.log('\n--- Checking availability (cloth 1, Oct 1–3 2026) ---');
  await checkAvailability('1', '2026-10-01', '2026-10-03');
}

const command = process.argv[2];

if (!command) {
  runDefaultDemo().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
} else {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
