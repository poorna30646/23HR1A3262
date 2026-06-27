# Notification System Design


# Stage 1

## Notification System REST API Design

### Overview

The Notification System provides users with real-time updates regarding placement events, interview schedules, results, announcements, and other important activities. All APIs are assumed to be pre-authorized, and no login or registration endpoints are required.

---

## Authentication

Every request must include the following headers:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

# Notification Object Schema

```json
{
    "id": "uuid",
    "title": "Placement Result",
    "message": "Congratulations! You have been selected for Round 2.",
    "notificationType": "Result",
    "priority": "High",
    "isRead": false,
    "createdAt": "2026-06-27T11:00:00Z"
}
```

| Field | Type | Description |
|--------|------|-------------|
| id | UUID | Unique notification ID |
| title | String | Notification title |
| message | String | Detailed notification message |
| notificationType | String | Event, Result, Placement |
| priority | String | Low, Medium, High |
| isRead | Boolean | Read status |
| createdAt | Timestamp | Notification creation time |

---

# API 1 : Get All Notifications

### Endpoint

```
GET /api/v1/notifications
```

### Headers

```
Authorization: Bearer <token>
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| page | Integer | Page Number |
| limit | Integer | Number of records |
| isRead | Boolean | Filter Read/Unread |
| notificationType | String | Event/Result/Placement |

### Success Response (200)

```json
{
    "success": true,
    "count": 2,
    "notifications": [
        {
            "id": "1",
            "title": "Placement Drive",
            "message": "Amazon placement drive starts tomorrow.",
            "notificationType": "Placement",
            "priority": "High",
            "isRead": false,
            "createdAt": "2026-06-27T11:00:00Z"
        }
    ]
}
```

---

# API 2 : Get Notification By ID

### Endpoint

```
GET /api/v1/notifications/{id}
```

### Success Response

```json
{
    "success": true,
    "notification": {
        "id": "1",
        "title": "Placement Drive",
        "message": "Amazon placement drive starts tomorrow.",
        "notificationType": "Placement",
        "priority": "High",
        "isRead": false,
        "createdAt": "2026-06-27T11:00:00Z"
    }
}
```

---

# API 3 : Mark Notification As Read

### Endpoint

```
PATCH /api/v1/notifications/{id}/read
```

### Request

```json
{}
```

### Response

```json
{
    "success": true,
    "message": "Notification marked as read."
}
```

---

# API 4 : Mark All Notifications As Read

### Endpoint

```
PATCH /api/v1/notifications/read-all
```

### Response

```json
{
    "success": true,
    "message": "All notifications marked as read."
}
```

---

# API 5 : Delete Notification

### Endpoint

```
DELETE /api/v1/notifications/{id}
```

### Response

```json
{
    "success": true,
    "message": "Notification deleted successfully."
}
```

---

# HTTP Status Codes

| Status Code | Description |
|--------------|-------------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Invalid Request |
| 401 | Unauthorized |
| 404 | Notification Not Found |
| 500 | Internal Server Error |

---

# Real-Time Notification Mechanism

The system will use **WebSockets** for real-time notification delivery.

### Workflow

1. User opens the application.
2. Client establishes a WebSocket connection with the server.
3. Whenever a new notification is generated, the server immediately pushes it to connected users.
4. The frontend updates the notification list instantly without requiring a page refresh.
5. If the user is offline, notifications remain stored in the database and are fetched through the REST API when the user reconnects.

### Why WebSockets?

- Persistent full-duplex connection
- Low latency communication
- Instant notification delivery
- Reduced polling overhead
- Better scalability for real-time systems

---

## Supported Notification Types

- Event
- Result
- Placement

---

## Future Enhancements

- Search notifications
- Notification categories
- Notification archiving
- Push notifications for mobile devices
- Email notification integration
- Notification preferences


# Stage 2

## Database Selection

I recommend **PostgreSQL** as the persistent database.

### Why PostgreSQL?

- ACID compliant transactions
- Reliable data consistency
- Excellent indexing support
- Efficient pagination
- Supports millions of notification records
- Production-ready relational database
- Easy maintenance and scalability

---

# Database Schema

## notifications

| Column | Type | Description |
|---------|------|-------------|
| id | UUID (PK) | Notification ID |
| userId | UUID | User receiving notification |
| title | VARCHAR(255) | Notification title |
| message | TEXT | Notification body |
| notificationType | VARCHAR(50) | Event / Result / Placement |
| priority | VARCHAR(20) | Low / Medium / High |
| isRead | BOOLEAN | Read status |
| createdAt | TIMESTAMP | Creation time |
| updatedAt | TIMESTAMP | Last update time |

---

# SQL Schema

```sql
CREATE TABLE notifications (

    id UUID PRIMARY KEY,

    userId UUID NOT NULL,

    title VARCHAR(255) NOT NULL,

    message TEXT NOT NULL,

    notificationType VARCHAR(50) NOT NULL,

    priority VARCHAR(20) DEFAULT 'Medium',

    isRead BOOLEAN DEFAULT FALSE,

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
```

---

# Useful Indexes

```sql
CREATE INDEX idx_user_read
ON notifications(userId,isRead);

CREATE INDEX idx_created
ON notifications(createdAt DESC);

CREATE INDEX idx_notification_type
ON notifications(notificationType);
```

---

# Scalability Challenges

As the number of users and notifications increases, the following issues may occur:

- Slower query performance
- Increased storage usage
- Longer response times
- Heavy database load
- Expensive sorting operations
- Increased concurrent requests

---

# Proposed Solutions

- Proper indexing
- Pagination
- Database partitioning
- Read replicas
- Archiving old notifications
- Connection pooling
- Query optimization
- Caching frequently accessed data

---

# SQL Queries

## Get Notifications

```sql
SELECT *
FROM notifications
WHERE userId = ?
ORDER BY createdAt DESC
LIMIT ? OFFSET ?;
```

---

## Get Notification By ID

```sql
SELECT *
FROM notifications
WHERE id = ?;
```

---

## Mark Notification Read

```sql
UPDATE notifications
SET isRead = TRUE,
updatedAt = CURRENT_TIMESTAMP
WHERE id = ?;
```

---

## Mark All Read

```sql
UPDATE notifications
SET isRead = TRUE,
updatedAt = CURRENT_TIMESTAMP
WHERE userId = ?;
```

---

## Delete Notification

```sql
DELETE
FROM notifications
WHERE id = ?;
```

---

# API Mapping

| API | SQL Query |
|------|-----------|
| GET /notifications | SELECT |
| GET /notifications/{id} | SELECT |
| PATCH /read | UPDATE |
| PATCH /read-all | UPDATE |
| DELETE /notifications/{id} | DELETE |

# Stage 3

## Query Analysis

The query is functionally correct because it retrieves unread notifications of a specific student ordered by creation time.

```sql
SELECT *
FROM notifications
WHERE studentId = 1042
AND isRead = FALSE
ORDER BY createdAt ASC;
```

However, as the database grows to millions of notifications, this query becomes increasingly slow without proper indexing.

---

## Why is it slow?

Without indexes, the database performs a full table scan.

For every request it must:

- Scan millions of rows
- Filter matching studentId
- Filter unread notifications
- Sort matching rows by createdAt

This increases response time significantly.

---

## Improved Index

Instead of indexing every column, create a composite index matching the query.

```sql
CREATE INDEX idx_notifications_user_read_created
ON notifications(studentId, isRead, createdAt);
```

This allows PostgreSQL to directly locate matching unread notifications for the student in sorted order.

---

## Time Complexity

### Without Index

```
O(N)
```

Database scans the entire notifications table.

### With Composite Index

```
O(log N)
```

Only matching rows are searched through the index.

---

## Should every column be indexed?

No.

Adding indexes on every column is not recommended because:

- consumes additional storage
- slows INSERT operations
- slows UPDATE operations
- slows DELETE operations
- increases maintenance cost

Indexes should only be created on frequently searched or sorted columns.

---

## Recommended Indexes

```sql
CREATE INDEX idx_user_read
ON notifications(studentId, isRead);

CREATE INDEX idx_created
ON notifications(createdAt);

CREATE INDEX idx_type
ON notifications(notificationType);
```

---

## Query for Placement Notifications in the Last 7 Days

```sql
SELECT *
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

If only student IDs are required:

```sql
SELECT DISTINCT studentId
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

---

## Final Recommendation

The best optimization is to use targeted composite indexes based on query patterns instead of indexing every column. This improves read performance while keeping write operations efficient and storage usage under control.

# Stage 4

## Performance Improvements

Fetching notifications from the database on every page load creates unnecessary load when thousands of students access the system simultaneously.

To improve scalability, the following optimizations are proposed.

### 1. Pagination

Instead of returning all notifications, the API should support pagination.

Example:

```
GET /notifications?page=1&limit=20
```

Only a small subset of notifications is transferred, reducing database workload and response size.

---

### 2. Redis Cache

Frequently accessed notifications should be cached in Redis.

Flow:

Frontend → Backend → Redis → Database

If data exists in Redis, the database is not queried.

---

### 3. WebSocket Push Notifications

Instead of polling the server repeatedly, establish a WebSocket connection so the server can instantly push newly generated notifications to connected students.

This eliminates unnecessary API calls and provides real-time updates.

---

### 4. Infinite Scrolling

Older notifications should be fetched only when the user scrolls.

This minimizes data transfer and improves frontend performance.

---

### 5. Incremental Fetching

The client should request only notifications created after the last synchronization time.

Example:

```
GET /notifications?after=<timestamp>
```

This significantly reduces repeated data transfer.

---

## Architecture

Frontend

↓

Backend

↓

Redis Cache

↓

PostgreSQL

WebSocket connections are maintained for real-time notification delivery.

---

## Tradeoffs

| Solution | Advantages | Disadvantages |
|-----------|------------|---------------|
| Pagination | Smaller responses, faster loading | Multiple requests for older data |
| Redis Cache | Extremely fast reads, reduces DB load | Additional infrastructure |
| WebSockets | Real-time notifications | Persistent server connections |
| Infinite Scroll | Lower memory usage | Slightly more frontend complexity |
| Incremental Fetching | Minimal network traffic | Requires timestamp synchronization |

---

## Conclusion

Combining pagination, Redis caching, WebSockets, incremental fetching, and proper indexing provides a scalable notification system capable of serving tens of thousands of concurrent students while maintaining low latency and minimizing database load.

# Stage 5

## Problems in the Existing Implementation

The current implementation processes every student sequentially.

```
notify_all()

↓

send_email()

↓

save_to_db()

↓

push_notification()
```

This approach has several issues:

- Email sending is slow (200 ms per user).
- Processing 50,000 students sequentially can take several hours.
- Failure while sending one email may interrupt the remaining process.
- Database writes, emails, and push notifications are tightly coupled.
- The system cannot scale for large user volumes.

---

## Proposed Architecture

The notification request should be processed asynchronously.

```
HR

↓

Notification Service

↓

Message Queue

├── Database Worker
├── Email Worker
└── Push Notification Worker
```

The API immediately queues jobs and returns a success response.

Background workers independently process database storage, email delivery, and push notifications.

---

## Revised Pseudocode

```text
function notify_all(studentIds, message):

    for each studentId:

        save_notification(studentId, message)

        enqueue_email(studentId, message)

        enqueue_push(studentId, message)

    return SUCCESS
```

Email Worker

```text
while queue not empty:

    job = dequeue()

    send_email(job)

    if failed:

        retry()
```

Push Worker

```text
while queue not empty:

    job = dequeue()

    send_push(job)
```

---

## Should Database Storage and Email Sending Happen Together?

No.

The notification should first be stored in the database.

Email and push notifications should be processed asynchronously using separate background workers.

This guarantees that the notification is permanently stored even if external services such as email providers are temporarily unavailable.

---

## Benefits

- Immediate API response
- Parallel processing
- Improved scalability
- Independent services
- Retry support
- Fault tolerance
- Easier horizontal scaling

## Future Enhancement:

Future Enhancement: The message queue can be implemented using systems like RabbitMQ, Apache Kafka, AWS SQS, or Redis Streams depending on the deployment requirements.

# Stage 6

## Priority Notification System

The application should always display the ten highest-priority notifications.

Priority order:

- Placement
- Result
- Event

If multiple notifications have the same priority, the most recent notification should appear first.

---

## Proposed Solution

Instead of sorting every notification whenever new data arrives, maintain a fixed-size Priority Queue (Max Heap).

Each incoming notification is assigned a priority score.

```
Placement = 3
Result = 2
Event = 1
```

The notification is inserted into the heap.

If the heap size exceeds ten, remove the lowest-priority notification.

This ensures that only the ten highest-priority notifications are retained at any time.

---

## Algorithm

```
priorityMap = {
    Placement : 3,
    Result : 2,
    Event : 1
}

for each notification:

    priority = priorityMap[type]

    heap.insert(notification)

    if heap.size > 10:

        heap.removeLowestPriority()

return heap
```

---

## Complexity

Sorting every notification:

```
O(N log N)
```

Priority Queue approach:

```
Insertion : O(log K)

K = 10
```

Since K is constant, the algorithm is highly efficient even when millions of notifications exist.

---

## Architecture

```
Notification API

↓

Notification Service

↓

Priority Queue (Max Heap)

↓

Top 10 Notifications

↓

Frontend
```

---

## Benefits

- No full sorting required
- Constant memory usage (only 10 notifications stored)
- Excellent scalability
- Efficient for continuous notification streams
- Fast response time

---

## Conclusion

Using a fixed-size Priority Queue provides an efficient solution for maintaining the top ten highest-priority notifications while supporting continuous incoming notification streams with minimal computational overhead.