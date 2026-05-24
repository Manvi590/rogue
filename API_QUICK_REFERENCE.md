# Video Management API - Quick Reference

## Base URL
```
http://localhost:5000/api/admin/videos
```

## Authentication Header (Required for all endpoints)
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

## 🎬 RECORD VIDEOS

### List Record Videos
```bash
GET /record
```
**Response:**
```json
[
  {
    "id": "uuid",
    "record_id": "uuid",
    "title": "Record Video Title",
    "video_url": "/uploads/videos/file.mp4",
    "source": "uploaded",
    "is_published": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Create Record Video
```bash
POST /record
Content-Type: application/json

{
  "recordId": "uuid",
  "title": "Record Title",
  "description": "Optional description",
  "videoUrl": "/uploads/videos/file.mp4",
  "thumbnailUrl": "/uploads/thumbnails/thumb.jpg",
  "source": "uploaded|youtube|external_url",
  "youtubeVideoId": "VIDEO_ID",
  "duration": 45,
  "isPublished": true
}
```

### Update Record Video
```bash
PUT /record/:id

{
  "title": "Updated Title",
  "description": "Updated description",
  "videoUrl": "new_url",
  "thumbnailUrl": "new_thumb",
  "isPublished": false
}
```

### Delete Record Video
```bash
DELETE /record/:id
```

---

## 🎥 ATTEMPT VIDEOS

### List Attempt Videos
```bash
GET /attempt
```

### Create Attempt Video
```bash
POST /attempt

{
  "attemptId": "uuid",
  "title": "Attempt Title",
  "videoUrl": "/uploads/videos/attempt.mp4",
  "source": "uploaded",
  "duration": 60
}
```

### Delete Attempt Video
```bash
DELETE /attempt/:id
```

---

## ⭐ FEATURED VIDEOS

### List Featured Videos
```bash
GET /featured
```

### Create Featured Video
```bash
POST /featured

{
  "recordId": "uuid",
  "title": "Featured Video",
  "videoUrl": "https://www.youtube.com/embed/VIDEO_ID",
  "source": "youtube",
  "youtubeVideoId": "VIDEO_ID"
}
```

### Delete Featured Video
```bash
DELETE /featured/:id
```

---

## 🆕 NEWEST RECORD VIDEOS

### List Newest Records
```bash
GET /newest?limit=20
```

### Create Newest Record Video
```bash
POST /newest

{
  "recordId": "uuid",
  "title": "Newest Record",
  "videoUrl": "/uploads/videos/newest.mp4",
  "source": "uploaded"
}
```

### Delete Newest Record Video
```bash
DELETE /newest/:id
```

---

## 📹 ATTEMPT HISTORY VIDEOS

### List Attempt History
```bash
GET /attempt-history
```

### Create Attempt History Video
```bash
POST /attempt-history

{
  "attemptId": "uuid",
  "title": "Attempt History",
  "videoUrl": "/uploads/videos/history.mp4",
  "source": "uploaded"
}
```

### Delete Attempt History Video
```bash
DELETE /attempt-history/:id
```

---

## 🖼️ THUMBNAILS

### Update Video Thumbnail
```bash
PUT /:videoId/thumbnail

{
  "thumbnailUrl": "/uploads/thumbnails/new_thumb.jpg"
}
```

---

## 📷 PHOTO EVIDENCE

### List All Evidence
```bash
GET /evidence/photos
```

### Create Evidence
```bash
POST /evidence/photos

{
  "recordId": "uuid",
  "userId": "uuid",
  "title": "Evidence Title",
  "description": "Optional description",
  "fileUrl": "/uploads/evidence/photo.jpg",
  "fileName": "photo.jpg",
  "fileSize": 1024576,
  "mimeType": "image/jpeg"
}
```

### Verify Evidence
```bash
PUT /evidence/photos/:id/verify

{
  "verificationNotes": "Evidence is valid and acceptable"
}
```

### Reject Evidence
```bash
PUT /evidence/photos/:id/reject

{
  "rejectionReason": "Evidence quality insufficient"
}
```

### Delete Evidence
```bash
DELETE /evidence/photos/:id
```

---

## 🎬 YOUTUBE INTEGRATION

### Validate YouTube URL
```bash
GET /youtube/validate?url=https://www.youtube.com/watch?v=VIDEO_ID

Response:
{
  "valid": true,
  "videoId": "VIDEO_ID",
  "watchUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "embedUrl": "https://www.youtube.com/embed/VIDEO_ID",
  "thumbnailUrl": "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg",
  "metadata": {
    "title": "Video Title",
    "description": "Video Description",
    "duration": 213,
    "viewCount": 1000000
  }
}
```

### Import YouTube Video
```bash
POST /youtube/import

{
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "recordId": "uuid",
  "videoType": "record|featured|attempt",
  "title": "Optional Title",
  "description": "Optional Description",
  "isPublished": true
}
```

---

## 📤 FILE UPLOADS

### Upload Video File
```bash
POST /upload/video
Content-Type: multipart/form-data

Form Data:
  video: <file.mp4>

Response:
{
  "url": "/uploads/videos/video-1234567890.mp4",
  "filename": "video-1234567890.mp4",
  "size": 12345678,
  "mimetype": "video/mp4"
}
```

### Upload Thumbnail
```bash
POST /upload/thumbnail
Content-Type: multipart/form-data

Form Data:
  thumbnail: <image.jpg>
```

### Upload Evidence File
```bash
POST /upload/evidence
Content-Type: multipart/form-data

Form Data:
  evidence: <file>
```

---

## 📊 STATISTICS

### Get Video Statistics
```bash
GET /stats

Response:
{
  "total": 42,
  "byType": {
    "record": 15,
    "attempt": 12,
    "featured": 8,
    "newestRecord": 5,
    "attemptHistory": 2
  },
  "bySource": {
    "uploaded": 25,
    "youtube": 15,
    "externalUrl": 2
  },
  "published": 35
}
```

---

## 🔐 ERROR RESPONSES

### 400 Bad Request
```json
{
  "message": "recordId and videoUrl are required"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized as an admin"
}
```

### 404 Not Found
```json
{
  "message": "Video not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error description"
}
```

---

## 📝 EXAMPLE WORKFLOWS

### Workflow 1: Upload and Create Video
```bash
# 1. Upload video file
curl -X POST http://localhost:5000/api/admin/upload/video \
  -H "Authorization: Bearer TOKEN" \
  -F "video=@video.mp4"

# Response: { "url": "/uploads/videos/xxx.mp4" }

# 2. Create video record
curl -X POST http://localhost:5000/api/admin/videos/record \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recordId": "uuid",
    "title": "My Record",
    "videoUrl": "/uploads/videos/xxx.mp4",
    "source": "uploaded"
  }'
```

### Workflow 2: Import YouTube Video
```bash
# 1. Validate URL
curl "http://localhost:5000/api/admin/videos/youtube/validate?url=https://www.youtube.com/watch?v=VIDEO_ID" \
  -H "Authorization: Bearer TOKEN"

# 2. Import video
curl -X POST http://localhost:5000/api/admin/videos/youtube/import \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
    "title": "My Featured Video",
    "videoType": "featured"
  }'
```

### Workflow 3: Verify Evidence
```bash
# 1. List pending evidence
curl http://localhost:5000/api/admin/evidence/photos \
  -H "Authorization: Bearer TOKEN"

# 2. Verify evidence
curl -X PUT http://localhost:5000/api/admin/evidence/photos/EVIDENCE_ID/verify \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "verificationNotes": "Evidence is valid"
  }'
```

---

## 💾 STORAGE LIMITS

| Type | Max Size | Path |
|------|----------|------|
| Video | 500 MB | `/uploads/videos/` |
| Thumbnail | 10 MB | `/uploads/thumbnails/` |
| Evidence | 50 MB | `/uploads/evidence/` |

---

## 📋 SUPPORTED FORMATS

**Videos:** MP4, MPEG, MOV, AVI
**Images:** JPEG, PNG, GIF, WebP
**Documents:** PDF, DOC, DOCX (for evidence)

---

## 🔗 Related Documentation

- [Full API Documentation](./VIDEO_MANAGEMENT_README.md)
- [Implementation Details](./IMPLEMENTATION_SUMMARY.md)
- [Setup Guide](./QUICK_START.md)

---

Generated: 2024
