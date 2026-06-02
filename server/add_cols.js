require('dotenv').config();
const { Pool } = require('pg');
// Supabase REST doesn't support DDL, but we can't easily get the postgres connection string if it's not in .env.
// Let's check if there is a postgres connection string in .env
console.log(process.env.DATABASE_URL ? "Has DB URL" : "No DB URL");
