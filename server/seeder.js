const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Record = require('./models/Record');
const Product = require('./models/Product');
const Event = require('./models/Event');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Record.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();
    await Event.deleteMany();

    const createdUsers = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        isAdmin: true,
      },
      {
        name: 'Elite Athlete',
        email: 'athlete@example.com',
        password: 'password123',
      },
    ]);

    const adminUser = createdUsers[0]._id;
    const regularUser = createdUsers[1]._id;

    await Record.create([
      {
        user: regularUser,
        title: 'Most Consecutive Backflips',
        category: 'Athletics',
        description: 'Set a new world record for the most consecutive backflips on a hard surface.',
        value: '42',
        unit: 'reps',
        status: 'verified',
        evidenceUrl: 'https://example.com/video1',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      },
      {
        user: regularUser,
        title: 'Fastest 100m Handstand Walk',
        category: 'Gymnastics',
        description: 'Walking 100 meters on hands in record time.',
        value: '18.4',
        unit: 'seconds',
        status: 'verified',
        evidenceUrl: 'https://example.com/video2',
        thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2158?auto=format&fit=crop&w=800&q=80',
      },
    ]);

    await Event.create([
      {
        title: 'Rogue Summer Games 2026',
        description: 'The ultimate showcase of human performance.',
        date: new Date('2026-07-15'),
        location: 'Los Angeles, CA',
        image: 'https://images.unsplash.com/photo-1517649763962-0c6234278a0b?auto=format&fit=crop&w=1200&q=80',
        isLive: true,
        streamUrl: 'https://example.com/live',
      },
    ]);

    await Product.create([
      {
        name: 'Rogue Elite Hoodie',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
        description: 'High-performance apparel for elite athletes.',
        brand: 'ROGUE',
        category: 'Apparel',
        price: 89.99,
        countInStock: 50,
      },
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Record.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();
    await Event.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
