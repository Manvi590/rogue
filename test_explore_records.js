const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/manvirajput/Downloads/rougue_world_record-main--main 8/rougue_world_record-main--main 5/rougue_world_record-main--main 2/server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('records').select('*').limit(3).order('created_at', { ascending: false });
  console.log(data);
}
test();
