const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

// Supabase client handles connection lazily, so we don't need a dedicated connectDB call here.
// However, we can log that we are ready to use Supabase.
console.log('Supabase initialized.');


const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection has been removed since the backend has been fully migrated to Supabase.


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/shop', require('./routes/shopRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/memberships', require('./routes/membershipRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/age-groups', require('./routes/ageGroupRoutes'));
app.use('/api/records/meta', require('./routes/recordMetaRoutes'));
app.use('/api/admin/videos', require('./routes/videoRoutes'));

app.get('/', (req, res) => {
  res.send('ROGUE API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
