/**
 * Video & Evidence Seeder
 * Populates sample video and evidence data for testing
 * 
 * Usage: node video-seeder.js
 */

const supabase = require('./config/supabase');

const seedVideos = async () => {
  try {
    console.log('🎬 Seeding videos...');

    const sampleVideos = [
      {
        record_id: null, // Set to real record ID
        attempt_id: null,
        user_id: null, // Set to real user ID
        video_type: 'record',
        title: 'World Record Bench Press - 500 lbs',
        description: 'Epic bench press world record attempt with witnesses',
        video_url: 'https://example.com/video1.mp4',
        thumbnail_url: 'https://example.com/thumb1.jpg',
        source: 'uploaded',
        youtube_video_id: null,
        duration: 45,
        is_published: true,
      },
      {
        record_id: null,
        attempt_id: null,
        user_id: null,
        video_type: 'featured',
        title: 'Featured: Amazing Speed Run',
        description: 'Incredible athletic performance showcase',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        source: 'youtube',
        youtube_video_id: 'dQw4w9WgXcQ',
        duration: 213,
        is_published: true,
      },
      {
        record_id: null,
        attempt_id: null,
        user_id: null,
        video_type: 'newest_record',
        title: 'Newest: 100m Sprint Record',
        description: 'Latest record-breaking sprint performance',
        video_url: 'https://example.com/video3.mp4',
        thumbnail_url: 'https://example.com/thumb3.jpg',
        source: 'uploaded',
        youtube_video_id: null,
        duration: 15,
        is_published: true,
      },
      {
        record_id: null,
        attempt_id: null,
        user_id: null,
        video_type: 'attempt',
        title: 'Deadlift Attempt - 600 lbs',
        description: 'Serious deadlift training session',
        video_url: 'https://example.com/video4.mp4',
        thumbnail_url: 'https://example.com/thumb4.jpg',
        source: 'uploaded',
        youtube_video_id: null,
        duration: 60,
        is_published: true,
      },
      {
        record_id: null,
        attempt_id: null,
        user_id: null,
        video_type: 'attempt_history',
        title: 'Historical Attempt: Long Jump',
        description: 'Archive video from long jump training',
        video_url: 'https://example.com/video5.mp4',
        thumbnail_url: 'https://example.com/thumb5.jpg',
        source: 'uploaded',
        youtube_video_id: null,
        duration: 30,
        is_published: true,
      },
    ];

    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .insert(sampleVideos)
      .select();

    if (videosError) throw videosError;
    console.log(`✅ Seeded ${videos.length} videos`);

    return videos;
  } catch (error) {
    console.error('❌ Error seeding videos:', error);
    throw error;
  }
};

const seedEvidence = async () => {
  try {
    console.log('📷 Seeding evidence...');

    const sampleEvidence = [
      {
        record_id: null, // Set to real record ID
        user_id: null, // Set to real user ID
        evidence_type: 'photo',
        title: 'Record Achievement Photo',
        description: 'Photo showing the record with witnesses',
        file_url: 'https://example.com/photo1.jpg',
        file_name: 'record_photo_1.jpg',
        file_size: 2048576,
        mime_type: 'image/jpeg',
        status: 'verified',
        verified_by: null, // Set to admin user ID
        verification_notes: 'Photo clearly shows record achievement with proper witnesses',
      },
      {
        record_id: null,
        user_id: null,
        evidence_type: 'photo',
        title: 'Performance Evidence',
        description: 'Action shot during record attempt',
        file_url: 'https://example.com/photo2.jpg',
        file_name: 'performance_shot.jpg',
        file_size: 3145728,
        mime_type: 'image/jpeg',
        status: 'pending',
        verified_by: null,
        verification_notes: null,
      },
      {
        record_id: null,
        user_id: null,
        evidence_type: 'screenshot',
        title: 'Timing Screenshot',
        description: 'Digital timer screenshot showing official time',
        file_url: 'https://example.com/screenshot1.png',
        file_name: 'timer_screenshot.png',
        file_size: 1024000,
        mime_type: 'image/png',
        status: 'verified',
        verified_by: null,
        verification_notes: 'Timer clearly visible, official clock confirmed',
      },
      {
        record_id: null,
        user_id: null,
        evidence_type: 'certificate',
        title: 'Official Certificate',
        description: 'Official record certificate document',
        file_url: 'https://example.com/certificate1.pdf',
        file_name: 'record_certificate.pdf',
        file_size: 512000,
        mime_type: 'application/pdf',
        status: 'pending',
        verified_by: null,
        verification_notes: null,
      },
      {
        record_id: null,
        user_id: null,
        evidence_type: 'photo',
        title: 'Witness Signature Photo',
        description: 'Photo of witness signatures and identification',
        file_url: 'https://example.com/photo3.jpg',
        file_name: 'witness_signatures.jpg',
        file_size: 2097152,
        mime_type: 'image/jpeg',
        status: 'rejected',
        verified_by: null,
        verification_notes: 'Signatures unclear, witness identification incomplete',
      },
    ];

    const { data: evidence, error: evidenceError } = await supabase
      .from('evidence')
      .insert(sampleEvidence)
      .select();

    if (evidenceError) throw evidenceError;
    console.log(`✅ Seeded ${evidence.length} evidence items`);

    return evidence;
  } catch (error) {
    console.error('❌ Error seeding evidence:', error);
    throw error;
  }
};

const runSeeder = async () => {
  try {
    console.log('🌱 Starting Video & Evidence Seeding...\n');

    await seedVideos();
    await seedEvidence();

    console.log('\n✅ Seeding completed successfully!');
    console.log(
      '\n⚠️  NOTE: Update the record_id, user_id, and verified_by fields with real IDs from your database'
    );
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  runSeeder();
}

module.exports = { seedVideos, seedEvidence };
