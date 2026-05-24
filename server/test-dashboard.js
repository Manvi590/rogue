const supabase = require('./config/supabase');
const jwt = require('jsonwebtoken');

(async () => {
  try {
    // Get admin user
    const { data: adminUser } = await supabase
      .from('users')
      .select('id, is_admin')
      .eq('email', 'admin@example.com')
      .single();

    if (!adminUser) {
      console.error('Admin user not found');
      process.exit(1);
    }

    console.log('Admin user found:', adminUser.id);

    // Generate token
    const token = jwt.sign({ id: adminUser.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    console.log('Token generated');
    
    // Test dashboard endpoint
    console.log('Calling dashboard endpoint...');
    const response = await fetch('http://localhost:5001/api/dashboard/dashboard', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    console.log('Response received, status:', response.status);
    const data = await response.json();
    console.log('Data parsed');
    
    if (response.ok) {
      console.log('✅ Dashboard loaded successfully');
      console.log('Data:', JSON.stringify(data, null, 2));
    } else {
      console.error('❌ Error:', data);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
