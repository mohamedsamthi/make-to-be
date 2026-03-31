const { createClient } = require('@supabase/supabase-js');
const s = createClient('https://qawcnogudduhjefsrbxo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhd2Nub2d1ZGR1aGplZnNyYnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3ODYxNTQsImV4cCI6MjA4ODM2MjE1NH0.Hzu4o_HQ8j0X_PWTWF4Qs8V3AflDdNz8CPuO9woha7o');

async function test() {
  const orderId = 'ORD-219474'; // Using the ID we found earlier
  console.log('Attempting to update order:', orderId);
  const { data, error } = await s.from('orders').update({ status: 'delivered', payment_status: 'paid' }).eq('id', orderId).select();
  if (error) {
    console.error('ERROR:', error.message);
  } else {
    console.log('SUCCESS:', JSON.stringify(data));
  }
}

test();
