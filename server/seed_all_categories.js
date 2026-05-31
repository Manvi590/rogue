require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const slugify = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const DEFAULT_CATEGORIES = [
  { name: 'Strength', order: 1 },
  { name: 'Speed', order: 2 },
  { name: 'Endurance', order: 3 },
  { name: 'Balance', order: 4 },
  { name: 'Flexibility', order: 5 },
  { name: 'Fitness', order: 6 },
  { name: 'Sports', order: 7 },
  { name: 'Gaming', order: 8 },
  { name: 'Entertainment', order: 9 },
  { name: 'Creative Skills', order: 10 },
  { name: 'Stunts', order: 11 },
  { name: 'Food Challenges', order: 12 },
  { name: 'Team Records', order: 13 },
  { name: 'Youth Records', order: 14 },
  { name: 'Senior Records', order: 15 },
  { name: 'Extreme Challenges', order: 16 },
  { name: 'Precision Skills', order: 17 },
  { name: 'Technology / Innovation', order: 18 },
  { name: 'Animal Records', order: 19 },
  { name: 'Miscellaneous', order: 20 }
];

async function seedCategories() {
  try {
    console.log('🌱 Starting to seed 20 default categories...');
    let seededCount = 0;

    for (const cat of DEFAULT_CATEGORIES) {
      const slug = slugify(cat.name);
      
      // Check if category already exists
      const { data: existing } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!existing) {
        const { data: createdCat, error } = await supabase
          .from('categories')
          .insert([{
            name: cat.name,
            slug: slug,
            description: '',
            parent: null,
            order_num: cat.order,
            active: true,
            is_default: true,
            rules: '',
            submission_requirements: ''
          }])
          .select()
          .single();

        if (error) {
          console.error(`❌ Error seeding ${cat.name}:`, error.message);
        } else {
          console.log(`✅ Seeded: ${cat.name}`);
          seededCount++;
        }
      } else {
        console.log(`⏭️  Already exists: ${cat.name}`);
      }
    }

    console.log(`\n🎉 Successfully seeded ${seededCount} new categories!`);
    console.log(`📊 Total categories in database should now be 20`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

seedCategories();
