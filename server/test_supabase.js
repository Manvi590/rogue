require('dotenv').config();
const supabase = require('./config/supabase');
async function test() {
  const { data, error } = await supabase.from('records').select('*, user:users!user_id(username, display_name, member_number)').limit(1);
  console.log(JSON.stringify({ data, error }, null, 2));
}
test();
