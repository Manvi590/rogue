const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './server/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function test() {
  const { data, error } = await supabase
    .from('records')
    .select('id, title, user:users!records_user_id_fkey(username, name, profile_image, member_number)')
    .eq('status', 'verified')
    .limit(5);
  
  if (error) console.error("Error:", error);
  else console.log(JSON.stringify(data, null, 2));
}

test();
