const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './server/.env' });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
supabase.from('users').select('*').limit(1).then(({data, error}) => console.log(JSON.stringify(data, null, 2), error));
