require('dotenv').config();
const supabase = require('./config/supabase');
async function test() {
  const { data, error } = await supabase.from('records').select('views, likes').limit(1);
  console.log(JSON.stringify({ data, error }, null, 2));
}
test();
