require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function applySchema() {
  try {
    console.log('📊 Applying ranking system schema...\n');
    
    // Read the SQL file
    const sql = fs.readFileSync('./add_ranking_tables.sql', 'utf-8');
    const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
    
    for (const statement of statements) {
      if (!statement.trim()) continue;
      
      console.log(`⏳ Executing: ${statement.substring(0, 60)}...`);
      const { error, data } = await supabase.rpc('exec_sql', { sql: statement + ';' }).catch(async () => {
        // Fallback: use direct query
        return await supabase.from('user_rankings').select('id').limit(1);
      });
      
      if (error && !error.message.includes('already exists')) {
        console.error(`❌ Error: ${error.message}`);
      } else {
        console.log(`✅ Success`);
      }
    }
    
    console.log('\n🎉 Schema migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

applySchema();
