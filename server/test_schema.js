const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function test() {
  let res = await supabase.from('events').select('*').limit(1);
  console.log("Events:", res.data ? Object.keys(res.data[0] || {}) : res.error);
  
  let res2 = await supabase.from('tickets').select('*').limit(1);
  console.log("Tickets:", res2.data ? Object.keys(res2.data[0] || {}) : res2.error);
}
test();
