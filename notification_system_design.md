#Stage1
##Rest API design for notification platform

###Core actions supoorted:
-Get all notification for a student
-Mark a notification as read
-Get unread notofication count
-Delete a notification

###API Endpoints:
####1>Get all notifications
**Endpoint:**`GET /api/notifications/{studentId}`
**Headers:**
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwZG1AZ2l0YW0uaW4iLCJleHAiOjE3ODA4MTMxNDMsImlhdCI6MTc4MDgxMjI0MywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6Ijg2YjM0ZjAxLWU1YmQtNGY2NC05MzZmLWJmODQ3YmJjOTdiMCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InBhdmFuIGt1bWFyIGQgbSIsInN1YiI6ImM5NDIzOWMzLWRmMjMtNGQwNC1hY2U5LWI4NGRmNTc2NGRmMSJ9LCJlbWFpbCI6InBkbUBnaXRhbS5pbiIsIm5hbWUiOiJwYXZhbiBrdW1hciBkIG0iLCJyb2xsTm8iOiIyMDIzMDA3MjE3IiwiYWNjZXNzQ29kZSI6IndnS3RnWiIsImNsaWVudElEIjoiYzk0MjM5YzMtZGYyMy00ZDA0LWFjZTktYjg0ZGY1NzY0ZGYxIiwiY2xpZW50U2VjcmV0Ijoic0RHemN3RFNES1BDSHVLViJ9.BQBTfgRBQ6k-vpC0do15SQolHh40oxXiM2I-auvPfvM>
Content-Type: application/json

**Response (200 OK):**
{
    "success": true,
    "data": {
        "notifications": [
            {
                "id": "uuid",
                "type": "Placement",
                "message": "Google hiring",
                "timestamp": "2026-06-07T10:00:00Z",
                "isRead": false
                }
        ],
        "totalCount": 15
    }
}

#### 2. Mark Notification as Read
**Endpoint:** `PUT /api/notifications/{notificationId}/read`
**Headers:**
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwZG1AZ2l0YW0uaW4iLCJleHAiOjE3ODA4MTMxNDMsImlhdCI6MTc4MDgxMjI0MywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6Ijg2YjM0ZjAxLWU1YmQtNGY2NC05MzZmLWJmODQ3YmJjOTdiMCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InBhdmFuIGt1bWFyIGQgbSIsInN1YiI6ImM5NDIzOWMzLWRmMjMtNGQwNC1hY2U5LWI4NGRmNTc2NGRmMSJ9LCJlbWFpbCI6InBkbUBnaXRhbS5pbiIsIm5hbWUiOiJwYXZhbiBrdW1hciBkIG0iLCJyb2xsTm8iOiIyMDIzMDA3MjE3IiwiYWNjZXNzQ29kZSI6IndnS3RnWiIsImNsaWVudElEIjoiYzk0MjM5YzMtZGYyMy00ZDA0LWFjZTktYjg0ZGY1NzY0ZGYxIiwiY2xpZW50U2VjcmV0Ijoic0RHemN3RFNES1BDSHVLViJ9.BQBTfgRBQ6k-vpC0do15SQolHh40oxXiM2I-auvPfvM>
**Response (200 OK):**
{
    "success":true,
    "message":"marked as read"
}
#### 3. Get Unread Count
**Endpoint:** `GET /api/notifications/{studentId}/unread/count`
**Response:**
{
    "success":true,
    "unreadCount":5
}
#### 4. Delete Notification
**Endpoint:** `DELETE /api/notifications/{notificationId}`
**Response:**
{
    "success": true,
    "message": "deleted"
}
# Stage 2
## Database Selection
**Choice:** PostgreSQL (Relational Database)
**Reason:** Notifications have structured data (ID, type, message, timestamp, isRead, studentId). ACID compliance needed for read/unread status updates. Good for complex queries like "unread notifications of a student".
## DB Schema
```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  studentId INTEGER REFERENCES students(id),
  type VARCHAR(20) CHECK (type IN ('Placement','Event','Result')),
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isRead BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_notifications_studentId ON notifications(studentId);
CREATE INDEX idx_notifications_isRead ON notifications(isRead);
