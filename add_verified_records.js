const supabase = require('./server/config/supabase');

const verifiedRecords = [
  {
    title: "Most Consecutive Push-Ups",
    category: "Strength",
    description: "Non-stop push-ups performed without rest",
    value: "234",
    unit: "reps",
    evidence_url: "https://youtu.be/example1",
    thumbnail_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    venue_name: "Home Gym",
    city: "Mumbai"
  },
  {
    title: "Fastest 100m Sprint",
    category: "Speed",
    description: "Running 100 meters at maximum speed",
    value: "9.8",
    unit: "seconds",
    evidence_url: "https://youtu.be/example2",
    thumbnail_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    venue_name: "Sports Track",
    city: "Delhi"
  },
  {
    title: "Longest Plank Hold",
    category: "Endurance",
    description: "Holding plank position without moving",
    value: "8",
    unit: "minutes",
    evidence_url: "https://youtu.be/example3",
    thumbnail_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80",
    venue_name: "Fitness Center",
    city: "Bangalore"
  },
  {
    title: "Most Pull-Ups in 1 Minute",
    category: "Strength",
    description: "Maximum pull-ups completed in 60 seconds",
    value: "45",
    unit: "reps",
    evidence_url: "https://youtu.be/example4",
    thumbnail_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",
    venue_name: "CrossFit Box",
    city: "Pune"
  },
  {
    title: "Highest Basketball Dunk",
    category: "Athletics",
    description: "Dunk performed from highest height",
    value: "3.65",
    unit: "meters",
    evidence_url: "https://youtu.be/example5",
    thumbnail_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
    venue_name: "Basketball Court",
    city: "Hyderabad"
  },
  {
    title: "Longest Handstand Hold",
    category: "Balance",
    description: "Maintaining handstand position",
    value: "12",
    unit: "minutes",
    evidence_url: "https://youtu.be/example6",
    thumbnail_url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80",
    venue_name: "Gymnastics Center",
    city: "Chennai"
  },
  {
    title: "Most Burpees in 10 Minutes",
    category: "Fitness",
    description: "Burpees completed in 10 minute duration",
    value: "156",
    unit: "reps",
    evidence_url: "https://youtu.be/example7",
    thumbnail_url: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=600&q=80",
    venue_name: "Home Gym",
    city: "Kolkata"
  },
  {
    title: "Fastest 50m Swimming",
    category: "Speed",
    description: "50 meter freestyle swim at maximum speed",
    value: "22.5",
    unit: "seconds",
    evidence_url: "https://youtu.be/example8",
    thumbnail_url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80",
    venue_name: "Swimming Pool",
    city: "Goa"
  },
  {
    title: "Most Sit-Ups in 1 Minute",
    category: "Core",
    description: "Sit-ups completed in 60 seconds",
    value: "67",
    unit: "reps",
    evidence_url: "https://youtu.be/example9",
    thumbnail_url: "https://images.unsplash.com/photo-1591123720164-de1348028a82?auto=format&fit=crop&w=600&q=80",
    venue_name: "Fitness Studio",
    city: "Jaipur"
  },
  {
    title: "Longest Wall Sit",
    category: "Strength",
    description: "Maintaining wall sit position",
    value: "15",
    unit: "minutes",
    evidence_url: "https://youtu.be/example10",
    thumbnail_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80",
    venue_name: "Home Gym",
    city: "Ahmedabad"
  }
];

async function addRecords() {
  try {
    console.log('Adding verified records to Supabase...');
    
    // Check how many verified records already exist
    const { data: existingRecords, error: checkError } = await supabase
      .from('records')
      .select('id')
      .eq('status', 'verified');
    
    if (checkError) throw checkError;
    
    const existingCount = existingRecords?.length || 0;
    console.log(`\n📊 Existing verified records: ${existingCount}`);
    
    const recordsToAdd = Math.max(0, 10 - existingCount);
    console.log(`✅ Adding ${recordsToAdd} new records to reach 10 total\n`);
    
    if (recordsToAdd <= 0) {
      console.log('✨ Already have 10 or more verified records!');
      process.exit(0);
    }
    
    // Take only the records needed
    const recordsForInsertion = verifiedRecords.slice(0, recordsToAdd).map(record => ({
      title: record.title,
      category: record.category,
      description: record.description,
      value: record.value,
      unit: record.unit,
      evidence_url: record.evidence_url,
      thumbnail_url: record.thumbnail_url,
      venue_name: record.venue_name,
      city: record.city,
      status: 'verified',
      record_type: 'standard'
    }));
    
    // Insert records
    const { data, error } = await supabase
      .from('records')
      .insert(recordsForInsertion)
      .select();
    
    if (error) throw error;
    
    console.log(`✅ Successfully added ${data.length} verified records!\n`);
    
    // Display added records
    data.forEach((record, idx) => {
      console.log(`${idx + 1}. ${record.title} (${record.value} ${record.unit})`);
    });
    
    console.log('\n🎉 Homepage should now show all records!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding records:', error.message);
    process.exit(1);
  }
}

addRecords();
