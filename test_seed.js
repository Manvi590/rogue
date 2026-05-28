require('dotenv').config({ path: './server/.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('categories').insert([{ name: 'Test', slug: 'test', is_default: false, active: true }]).select().single();
  console.log('Data:', data);
  console.log('Error:', error);
}
test();
