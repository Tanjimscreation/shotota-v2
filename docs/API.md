# 🔌 Shotota V2 - API Documentation

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://shotota.com/api`

---

## Authentication

All protected endpoints require JWT token in headers:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Auth
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user (protected)

### Courses
- `GET /courses` - List all courses
- `GET /courses/[id]` - Get course details
- `POST /courses` - Create course (admin only)
- `PUT /courses/[id]` - Update course (admin only)
- `DELETE /courses/[id]` - Delete course (admin only)

### Enrollments
- `GET /enrollments` - List user's enrollments (protected)
- `POST /enrollments` - Enroll in course (protected)
- `GET /enrollments/[id]` - Get enrollment details (protected)

### Exams
- `GET /exams` - List exams for course
- `GET /exams/[id]` - Get exam details & questions
- `POST /exams` - Create exam (admin only)
- `POST /exams/[id]/upload` - Upload questions from PDF/Word (admin only)

### Results
- `POST /results` - Submit exam (protected)
- `GET /results` - Get user's exam results (protected)
- `GET /results/[examId]` - Get specific result (protected)

### Leaderboard
- `GET /leaderboard` - Global leaderboard
- `GET /leaderboard/[courseId]` - Course-specific leaderboard
- `GET /leaderboard?period=week` - Filter by time period (day/week/month/all)

### Uploads
- `POST /uploads` - Upload file (protected)
- `GET /uploads` - List user's uploads (protected)
- `DELETE /uploads/[id]` - Delete upload (protected)

### Admin
- `GET /admin/users` - List all users (admin only)
- `GET /admin/enrollments` - List all enrollments (admin only)
- `PUT /admin/enrollments/[id]` - Verify payment (admin only)
- `GET /admin/stats` - System statistics (admin only)

---

## Request/Response Examples

### POST /auth/signup
**Request**:
```json
{
  "email": "student@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "xyz123",
    "email": "student@example.com",
    "name": "John Doe",
    "role": "STUDENT"
  }
}
```

### GET /courses
**Response** (200 OK):
```json
{
  "courses": [
    {
      "id": "course1",
      "title": "Advanced JavaScript",
      "description": "...",
      "price": 2999,
      "instructor": "Jane Smith",
      "duration": 24,
      "category": "Programming",
      "thumbnail": "..."
    }
  ],
  "total": 15,
  "page": 1
}
```

### POST /enrollments
**Request**:
```json
{
  "courseId": "course1",
  "transactionId": "bkash-tx-12345",
  "paymentProof": "uploads/proof-xyz.png"
}
```

**Response** (201 Created):
```json
{
  "id": "enrollment1",
  "userId": "user1",
  "courseId": "course1",
  "paymentStatus": "PENDING",
  "enrolledAt": "2026-04-04T10:30:00Z"
}
```

### GET /exams/[id]
**Response** (200 OK):
```json
{
  "exam": {
    "id": "exam1",
    "title": "JavaScript Basics Quiz",
    "duration": 30,
    "totalQuestions": 10,
    "negativeMarking": 0.25
  },
  "questions": [
    {
      "id": "q1",
      "questionText": "What is a closure?",
      "options": [
        { "label": "A", "text": "A function inside another function" },
        { "label": "B", "text": "A method of closing files" },
        { "label": "C", "text": "A loop construct" },
        { "label": "D", "text": "A database operation" }
      ]
    }
  ]
}
```

### POST /results
**Request**:
```json
{
  "examId": "exam1",
  "answers": {
    "q1": "A",
    "q2": "B",
    "q3": "C"
  },
  "timeTaken": 1200
}
```

**Response** (201 Created):
```json
{
  "id": "result1",
  "userId": "user1",
  "examId": "exam1",
  "correctAnswers": 8,
  "wrongAnswers": 2,
  "unattempted": 0,
  "score": 7.5,
  "percentage": 75,
  "negativeMarks": 0.5,
  "timeTaken": 1200,
  "createdAt": "2026-04-04T11:45:00Z"
}
```

### GET /leaderboard
**Response** (200 OK):
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user1",
      "userName": "Ahmed Khan",
      "totalScore": 1250,
      "examCount": 15,
      "avgScore": 83.3
    },
    {
      "rank": 2,
      "userId": "user2",
      "userName": "Sarah Ali",
      "totalScore": 1180,
      "examCount": 14,
      "avgScore": 84.3
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": {
    "email": "Invalid email format"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Token is invalid or expired"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Course with id 'xyz' not found"
}
```

### 500 Server Error
```json
{
  "error": "Server error",
  "message": "Internal server error"
}
```

---

## Rate Limiting

- 100 requests per 15 minutes per IP
- 1000 requests per hour per user (authenticated)

---

## File Upload

### POST /uploads
**multipart/form-data**:
- `file`: Binary file data (max 10MB)

**Response** (201 Created):
```json
{
  "id": "upload1",
  "filename": "1712233200000-document.pdf",
  "originalName": "document.pdf",
  "fileType": "pdf",
  "fileSize": 2048576,
  "filePath": "uploads/1712233200000-document.pdf"
}
```

---

## Pagination

All list endpoints support:
```
GET /endpoint?page=1&limit=10
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

## WebSocket (Optional Future Feature)

```
ws://localhost:3000/api/ws
```

Used for:
- Real-time exam timer
- Live leaderboard updates
- Notification delivery

---

## Testing API with cURL

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Get courses
curl -X GET http://localhost:3000/api/courses

# Get exam with token
curl -X GET http://localhost:3000/api/exams/exam1 \
  -H "Authorization: Bearer eyJhbGc..."

# Upload file
curl -X POST http://localhost:3000/api/uploads \
  -H "Authorization: Bearer eyJhbGc..." \
  -F "file=@document.pdf"

# Submit exam result
curl -X POST http://localhost:3000/api/results \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{"examId":"exam1","answers":{"q1":"A"},"timeTaken":1200}'
```

---

## Testing with Postman

1. Create environment variables:
   - `base_url`: http://localhost:3000/api
   - `token`: (set after login)

2. Create auth request:
   - `POST {{base_url}}/auth/login`
   - Store token in variable: `pm.environment.set("token", pm.response.json().token)`

3. Use token in headers:
   - `Authorization: Bearer {{token}}`

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 500 | Server Error |

---

## Versioning

All endpoints are currently v1. Future versions will use:
- `/api/v2/courses`
- `/api/v3/exams`

Current version header (optional):
```
API-Version: 1.0.0
```
