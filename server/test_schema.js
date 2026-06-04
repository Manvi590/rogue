const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkSchema() {
  const { data: recordsData } = await supabase.from('records').select('*').limit(1);
  console.log("Records schema:", recordsData ? Object.keys(recordsData[0] || {}) : "No data");
  
  const { data: commentsData, error: commentsError } = await supabase.from('record_comments').select('*').limit(1);
  console.log("Comments table:", commentsError ? commentsError.message : "Exists");
  
  const { data: likesData, error: likesError } = await supabase.from('record_likes').select('*').limit(1);
  console.log("Likes table:", likesError ? likesError.message : "Exists");
}
checkSchema();
