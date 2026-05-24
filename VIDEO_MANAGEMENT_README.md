# Video & Evidence Management System

## Overview

This system provides comprehensive management of videos and evidence for record submissions, including:

- **Record Videos**: Video evidence for submitted records
- **Attempt Videos**: Videos of attempts and challenges
- **Featured Videos**: Showcase videos for the homepage
- **Newest Records Videos**: Videos highlighting the latest world records
- **Attempt History Videos**: Archive videos from attempt history
- **Photo Evidence**: Photo-based evidence submission and verification
- **YouTube Integration**: Import and manage YouTube videos
- **Thumbnails**: Custom thumbnail management for videos

## Architecture

### Backend Structure

```
server/
├── models/
│   ├── Video.js          # Video data model
│   ├── Evidence.js       # Evidence data model
├── controllers/
│   ├── videoController.js         # Core video operations
│   ├── videoUploadController.js   # File uploads & YouTube integration
├── routes/
│   └── videoRoutes.js    # Admin video routes
├── middleware/
│   └── authMiddleware.js # Auth & admin protection
├── config/
│   └── upload.js         # File upload configuration
├── utils/
│   └── youtubeIntegration.js  # YouTube utilities
└── seeders/
    └── video-seeder.js   # Sample data
```

### Frontend Structure

```
client/src/
├── components/
│   ├── VideoManagement.jsx   # Video admin panel
│   └── EvidenceManagement.jsx # Evidence admin panel
└── utils/
    └── api.js            # API calls
```

## Database Schema

### Videos Table

```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY,
  record_id UUID REFERENCES records(id),
  attempt_id UUID,
  user_id UUID REFERENCES users(id),
  video_type TEXT CHECK (video_type IN ('record', 'attempt', 'featured', 'newest_record', 'attempt_history')),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  source TEXT CHECK (source IN ('uploaded', 'youtube', 'external_url')),
  youtube_video_id TEXT,
  duration INTEGER,
  is_published BOOLEAN,
  view_count INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Evidence Table

```sql
CREATE TABLE evidence (
  id UUID PRIMARY KEY,
  record_id UUID REFERENCES records(id),
  user_id UUID REFERENCES users(id),
  evidence_type TEXT CHECK (evidence_type IN ('photo', 'screenshot', 'document', 'certificate')),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  status TEXT CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_by UUID REFERENCES users(id),
  verification_notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## API Endpoints

### Record Videos

```
GET    /api/admin/videos/record           # List all record videos
POST   /api/admin/videos/record           # Create record video
PUT    /api/admin/videos/record/:id       # Update record video
DELETE /api/admin/videos/record/:id       # Delete record video
```

### Attempt Videos

```
GET    /api/admin/videos/attempt          # List all attempt videos
POST   /api/admin/videos/attempt          # Create attempt video
DELETE /api/admin/videos/attempt/:id      # Delete attempt video
```

### Featured Videos

```
GET    /api/admin/videos/featured         # List featured videos
POST   /api/admin/videos/featured         # Create featured video
DELETE /api/admin/videos/featured/:id     # Delete featured video
```

### Newest Record Videos

```
GET    /api/admin/videos/newest           # List newest record videos
POST   /api/admin/videos/newest           # Create newest record video
DELETE /api/admin/videos/newest/:id       # Delete newest record video
```

### Attempt History Videos

```
GET    /api/admin/videos/attempt-history           # List attempt history videos
POST   /api/admin/videos/attempt-history           # Create attempt history video
DELETE /api/admin/videos/attempt-history/:id       # Delete attempt history video
```

### Thumbnails

```
PUT    /api/admin/videos/:id/thumbnail    # Update video thumbnail
```

### Photo Evidence

```
GET    /api/admin/evidence/photos                  # List all photo evidence
POST   /api/admin/evidence/photos                  # Create photo evidence
PUT    /api/admin/evidence/photos/:id/verify       # Verify evidence
PUT    /api/admin/evidence/photos/:id/reject       # Reject evidence
DELETE /api/admin/evidence/photos/:id              # Delete evidence
```

### YouTube Integration

```
POST   /api/admin/videos/youtube/import   # Import video from YouTube
GET    /api/admin/videos/youtube/validate # Validate YouTube URL
```

### File Uploads

```
POST   /api/admin/upload/video            # Upload video file
POST   /api/admin/upload/thumbnail        # Upload thumbnail image
POST   /api/admin/upload/evidence         # Upload evidence file
```

### Analytics

```
GET    /api/admin/videos/stats            # Get video statistics
```

## File Upload Configuration

### Supported Formats

**Videos:**
- `.mp4` (video/mp4)
- `.mpeg` (video/mpeg)
- `.mov` (video/quicktime)
- `.avi` (video/x-msvideo)
- Max size: 500MB

**Thumbnails/Images:**
- `.jpg`, `.jpeg` (image/jpeg)
- `.png` (image/png)
- `.gif` (image/gif)
- `.webp` (image/webp)
- Max size: 10MB

**Evidence:**
- Images: `.jpg`, `.png`, `.gif`, `.webp`
- Documents: `.pdf`, `.doc`, `.docx`
- Max size: 50MB

### Upload Directories

```
server/uploads/
├── videos/       # Video files
├── thumbnails/   # Thumbnail images
└── evidence/     # Evidence files
```

## YouTube Integration

### Features

- **URL Validation**: Validate YouTube URLs in multiple formats
- **Metadata Fetching**: Extract video title, duration, thumbnail (requires API key)
- **Automatic Thumbnail**: Generate YouTube thumbnail URLs
- **Embed URLs**: Generate embed-ready URLs

### Environment Variables

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### YouTube URL Formats Supported

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/v/VIDEO_ID`
- `VIDEO_ID` (raw ID)

## Usage Examples

### Create a Record Video

```javascript
const response = await fetch('/api/admin/videos/record', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    recordId: 'record-uuid',
    title: 'Record Video Title',
    description: 'Record description',
    videoUrl: '/uploads/videos/video.mp4',
    thumbnailUrl: '/uploads/thumbnails/thumb.jpg',
    source: 'uploaded',
    duration: 45,
    isPublished: true
  })
});
```

### Import YouTube Video

```javascript
const response = await fetch('/api/admin/videos/youtube/import', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    recordId: 'record-uuid',
    videoType: 'record',
    title: 'YouTube Record',
    description: 'Imported from YouTube',
    isPublished: true
  })
});
```

### Upload and Create Video

```javascript
// 1. Upload video file
const formData = new FormData();
formData.append('video', videoFile);

const uploadResponse = await fetch('/api/admin/upload/video', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: formData
});

const { url } = await uploadResponse.json();

// 2. Create video record with uploaded file
const response = await fetch('/api/admin/videos/record', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    recordId: 'record-uuid',
    title: 'Record Video',
    videoUrl: url,
    source: 'uploaded',
    isPublished: true
  })
});
```

### Verify Evidence

```javascript
const response = await fetch('/api/admin/evidence/photos/evidence-id/verify', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    verificationNotes: 'Evidence is valid and acceptable'
  })
});
```

## Authentication & Authorization

All endpoints require:
1. **Valid JWT Token** in Authorization header: `Bearer <token>`
2. **Admin Privileges**: User must have `is_admin = true`

Routes are protected by middleware:
```javascript
router.use(protect);  // Requires auth
router.use(admin);    // Requires admin role
```

## Error Handling

Standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (invalid data)
- `401` - Unauthorized (missing token/not admin)
- `404` - Not Found
- `500` - Server Error

Error response format:
```json
{
  "message": "Error description"
}
```

## Seeding Sample Data

Run the seeder to populate test data:

```bash
node server/seeders/video-seeder.js
```

**Note:** Update the seeded data with actual record_id, user_id, and verified_by UUIDs.

## Frontend Components

### VideoManagement Component

Complete video management interface with:
- Tabbed interface for different video types
- Search and filtering
- Add/edit/delete videos
- YouTube import
- Statistics dashboard
- File upload

Usage:
```jsx
import VideoManagement from '../components/VideoManagement';

function AdminPanel() {
  return <VideoManagement />;
}
```

### EvidenceManagement Component

Evidence verification interface with:
- Grid view of evidence items
- Status filtering (pending/verified/rejected)
- Photo preview
- Verification modal with notes
- Statistics

Usage:
```jsx
import EvidenceManagement from '../components/EvidenceManagement';

function AdminPanel() {
  return <EvidenceManagement />;
}
```

## Configuration

### Environment Variables

```env
# Server
NODE_ENV=development
JWT_SECRET=your_jwt_secret
YOUTUBE_API_KEY=your_youtube_api_key

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Upload Limits

Modify in `server/config/upload.js`:

```javascript
// Video: 500MB
limits: { fileSize: 500 * 1024 * 1024 }

// Thumbnail: 10MB
limits: { fileSize: 10 * 1024 * 1024 }

// Evidence: 50MB
limits: { fileSize: 50 * 1024 * 1024 }
```

## Best Practices

1. **Always validate file types** before uploading
2. **Generate thumbnails** for better UX
3. **Use YouTube API key** for metadata extraction
4. **Add verification notes** when rejecting evidence
5. **Keep file storage organized** by type
6. **Implement image compression** for thumbnails
7. **Use CDN** for video delivery in production
8. **Enable CORS** for cross-origin requests
9. **Implement rate limiting** on upload endpoints
10. **Regular backups** of uploaded files

## Troubleshooting

### YouTube Import Not Working

- Verify YouTube URL format is correct
- Check `YOUTUBE_API_KEY` is set (optional for basic import)
- YouTube videos may have restrictions on embedding

### File Upload Errors

- Check file size doesn't exceed limit
- Verify MIME type is supported
- Ensure upload directory has write permissions

### Evidence Verification Issues

- Confirm user has admin privileges
- Check that record_id and user_id exist
- Verify file URLs are accessible

## Future Enhancements

- [ ] Video transcoding and optimization
- [ ] Advanced video editing tools
- [ ] Bulk upload functionality
- [ ] Video streaming analytics
- [ ] Automated thumbnail generation
- [ ] Video compression
- [ ] Live streaming support
- [ ] Social media integration
- [ ] Advanced filtering and search
- [ ] Video quality variants (480p, 720p, 1080p)

## Support

For issues or questions, refer to the main project documentation or contact the development team.
