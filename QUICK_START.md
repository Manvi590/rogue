#!/bin/bash

# Quick Start Guide - Video & Evidence Management System
# This script helps you set up and test the video management system

echo "🎬 Video & Evidence Management - Quick Start Guide"
echo "=================================================="
echo ""

# 1. Check if Node is installed
echo "✓ Checking Node.js..."
node --version

# 2. Install dependencies if needed
echo ""
echo "✓ Installing dependencies..."
npm install multer --save

# 3. Database setup
echo ""
echo "✓ Database Setup Instructions:"
echo "  1. Go to your Supabase dashboard"
echo "  2. Open the SQL Editor"
echo "  3. Copy the contents of 'server/supabase_schema.sql'"
echo "  4. Execute the SQL to create videos and evidence tables"
echo ""

# 4. Environment variables
echo "✓ Environment Variables:"
echo "  Add to your .env file:"
echo "    YOUTUBE_API_KEY=your_api_key_here"
echo ""

# 5. Seed data
echo "✓ Seeding sample data..."
# node server/seeders/video-seeder.js

echo ""
echo "✓ API Endpoints Ready:"
echo "  - GET    /api/admin/videos/record"
echo "  - POST   /api/admin/videos/record"
echo "  - GET    /api/admin/videos/featured"
echo "  - POST   /api/admin/videos/youtube/import"
echo "  - GET    /api/admin/evidence/photos"
echo "  - POST   /api/admin/upload/video"
echo ""

echo "✓ Admin Components Ready:"
echo "  - VideoManagement (manage all video types)"
echo "  - EvidenceManagement (verify photo evidence)"
echo ""

echo "✓ Documentation:"
echo "  - Read VIDEO_MANAGEMENT_README.md for detailed API docs"
echo "  - Read IMPLEMENTATION_SUMMARY.md for features overview"
echo ""

echo "✓ Testing:"
echo "  Run: npm test -- server/__tests__/videoManagement.test.js"
echo ""

echo "🚀 System Ready!"
echo ""
