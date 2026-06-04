require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function assignRandomPoints() {
  console.log("Starting random points assignment...");
  
  // Get all users who have at least one verified record
  const { data: records, error: recordError } = await supabase
    .from('records')
    .select('user_id')
    .eq('status', 'verified');
    
  if (recordError) {
    console.error("Error fetching records:", recordError);
    return;
  }
  
  const uniqueUsers = [...new Set(records.map(r => r.user_id))];
  console.log(`Found ${uniqueUsers.length} users with verified records.`);
  
  // If no verified records, fallback to all users just to populate the leaderboard for testing
  let usersToUpdate = uniqueUsers;
  if (usersToUpdate.length === 0) {
    console.log("No verified records found. Fallback: generating points for ALL users.");
    const { data: allUsers, error: userError } = await supabase.from('users').select('id');
    if (userError) {
      console.error("Error fetching users:", userError);
      return;
    }
    usersToUpdate = allUsers.map(u => u.id);
  }
  
  if (usersToUpdate.length === 0) {
    console.log("No users found in database.");
    return;
  }

  // Iterate and assign points
  let rankingsToUpsert = [];
  
  for (let i = 0; i < usersToUpdate.length; i++) {
    const userId = usersToUpdate[i];
    
    // Random points between 1000 and 20000
    const randomPoints = Math.floor(Math.random() * 19000) + 1000;
    
    let tier = 'Challenger';
    if (randomPoints >= 15000) tier = 'Grand Champion';
    else if (randomPoints >= 10000) tier = 'Elite Master';
    else if (randomPoints >= 5000) tier = 'Pro Competitor';
    
    // Upsert directly to user_rankings
    const { data: existing } = await supabase
      .from('user_rankings')
      .select('id')
      .eq('user_id', userId)
      .single();
      
    if (existing) {
      rankingsToUpsert.push({
        id: existing.id,
        user_id: userId,
        total_points: randomPoints,
        tier_badge: tier,
        updated_at: new Date()
      });
    } else {
      rankingsToUpsert.push({
        user_id: userId,
        total_points: randomPoints,
        tier_badge: tier,
      });
    }
  }
  
  // Execute upserts
  const { data, error: upsertError } = await supabase
    .from('user_rankings')
    .upsert(rankingsToUpsert, { onConflict: 'id' });
    
  if (upsertError) {
    console.error("Error upserting rankings:", upsertError);
    return;
  }
  
  console.log(`Successfully assigned points to ${rankingsToUpsert.length} users.`);
  
  // Now recalculate global ranks
  console.log("Recalculating global ranks...");
  const { data: allRankings, error: fetchError } = await supabase
    .from('user_rankings')
    .select('id')
    .order('total_points', { ascending: false });
    
  if (fetchError) {
    console.error("Error fetching rankings for recalculation:", fetchError);
    return;
  }
  
  for (let i = 0; i < allRankings.length; i++) {
    await supabase
      .from('user_rankings')
      .update({ global_rank: i + 1 })
      .eq('id', allRankings[i].id);
  }
  
  console.log("Rankings recalculated successfully!");
}

assignRandomPoints();
