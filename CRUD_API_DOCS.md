# CRUD APIs Documentation

This document provides a comprehensive overview of all the CRUD (Create, Read, Update, Delete) APIs created for the UAS_SI system.

## Overview

Complete CRUD API routes have been created for all 9 MongoDB schemas. Each API follows a consistent pattern with proper error handling and query filtering capabilities.

---

## 1. User API
**Route:** `/api/user`

### GET - Retrieve Users
- Query parameters:
  - `id` (optional): Get a specific user by ID
  - `role` (optional): Filter by role ('Admin', 'Guru', 'Siswa')
- Response: Returns list of users with count (password excluded)

### POST - Create User
- Body: User data (name, email, password_hash, noInduk, role, status)
- Validation: Checks for duplicate email
- Response: 201 with created user data

### PUT - Update User
- Query parameter: `id` (required)
- Body: Updated user data
- Response: 200 with updated user

### DELETE - Delete User
- Query parameter: `id` (required)
- Response: 200 with deletion confirmation

---

## 2. Class API
**Route:** `/api/class`

### GET - Retrieve Classes
- Query parameters:
  - `id` (optional): Get a specific class
  - `grade` (optional): Filter by grade
  - `major` (optional): Filter by major
- Response: Classes with populated teacher info (Wali_kelas)

### POST - Create Class
- Body: Class data (grade, major, section, Wali_kelas)
- Response: 201 with created class

### PUT - Update Class
- Query parameter: `id` (required)
- Body: Updated class data
- Response: 200 with updated class

### DELETE - Delete Class
- Query parameter: `id` (required)
- Response: 200 with deletion confirmation

---

## 3. Subject API
**Route:** `/api/subject`

### GET - Retrieve Subjects
- Query parameters:
  - `id` (optional): Get a specific subject
  - `name` (optional): Search by subject name (case-insensitive)
- Response: List of subjects with count

### POST - Create Subject
- Body: Subject data (name)
- Validation: Ensures unique subject names
- Response: 201 with created subject

### PUT - Update Subject
- Query parameter: `id` (required)
- Body: Updated subject data
- Response: 200 with updated subject

### DELETE - Delete Subject
- Query parameter: `id` (required)
- Response: 200 with deletion confirmation

---

## 4. Period API
**Route:** `/api/period`

### GET - Retrieve Periods
- Query parameters:
  - `id` (optional): Get a specific period
  - `active` (optional): Filter by isActive status ('true' or 'false')
- Response: List of academic periods with count

### POST - Create Period
- Body: Period data (name, year, semester, isActive)
- Response: 201 with created period

### PUT - Update Period
- Query parameter: `id` (required)
- Body: Updated period data
- Response: 200 with updated period

### DELETE - Delete Period
- Query parameter: `id` (required)
- Response: 200 with deletion confirmation

---

## 5. ClassSubject API
**Route:** `/api/class-subject`

### GET - Retrieve Class-Subject Mappings
- Query parameters:
  - `id` (optional): Get a specific mapping
  - `classId` (optional): Filter by class
  - `subjectId` (optional): Filter by subject
  - `teacherId` (optional): Filter by teacher
- Response: Populated with Class, Subject, and Teacher details

### POST - Create Class-Subject
- Body: Class-Subject data (Class, Subject, Teacher)
- Validation: Prevents duplicate combinations
- Response: 201 with created mapping

### PUT - Update Class-Subject
- Query parameter: `id` (required)
- Body: Updated mapping data
- Response: 200 with updated mapping

### DELETE - Delete Class-Subject
- Query parameter: `id` (required)
- Response: 200 with deletion confirmation

---

## 6. Enrollment API
**Route:** `/api/enrollment`

### GET - Retrieve Enrollments
- Query parameters:
  - `id` (optional): Get a specific enrollment
  - `studentId` (optional): Filter by student
  - `classId` (optional): Filter by class
  - `periodId` (optional): Filter by period
- Response: Populated with Student, Class, and Period details

### POST - Create Enrollment
- Body: Enrollment data (Student, Class, Period)
- Validation: Prevents duplicate enrollments
- Response: 201 with created enrollment

### PUT - Update Enrollment
- Query parameter: `id` (required)
- Body: Updated enrollment data
- Response: 200 with updated enrollment

### DELETE - Delete Enrollment
- Query parameter: `id` (required)
- Response: 200 with deletion confirmation

---

## 7. Material API
**Route:** `/api/material`

### GET - Retrieve Materials
- Query parameters:
  - `id` (optional): Get a specific material
  - `classSubjectId` (optional): Filter by class-subject
  - `search` (optional): Search by title (case-insensitive)
- Response: Materials with deeply populated ClassSubject info

### POST - Create Material
- Body: Material data (ClassSubject, title, description, attachment)
- Response: 201 with created material

### PUT - Update Material
- Query parameter: `id` (required)
- Body: Updated material data
- Response: 200 with updated material

### DELETE - Delete Material
- Query parameter: `id` (required)
- Response: 200 with deletion confirmation

---

## 8. Assignment API
**Route:** `/api/assignment`

### GET - Retrieve Assignments
- Query parameters:
  - `id` (optional): Get a specific assignment
  - `classSubjectId` (optional): Filter by class-subject
  - `search` (optional): Search by title (case-insensitive)
- Response: Assignments with deeply populated ClassSubject info

### POST - Create Assignment
- Body: Assignment data (ClassSubject, title, description, dueDate, attachment)
- Response: 201 with created assignment

### PUT - Update Assignment
- Query parameter: `id` (required)
- Body: Updated assignment data
- Response: 200 with updated assignment

### DELETE - Delete Assignment
- Query parameter: `id` (required)
- Response: 200 with deletion confirmation

---

## 9. Submission API
**Route:** `/api/submission`

### GET - Retrieve Submissions
- Query parameters:
  - `id` (optional): Get a specific submission
  - `assignmentId` (optional): Filter by assignment
  - `studentId` (optional): Filter by student
  - `status` (optional): Filter by status (Submitted, Late, Missing, Reviewed)
- Response: Submissions with populated Assignment and Student info

### POST - Create Submission
- Body: Submission data (Assignment, Student, attachment, status, score)
- Validation: Prevents duplicate submissions from same student
- Response: 201 with created submission

### PUT - Update Submission
- Query parameter: `id` (required)
- Body: Updated submission data (typically for grading)
- Response: 200 with updated submission

### DELETE - Delete Submission
- Query parameter: `id` (required)
- Response: 200 with deletion confirmation

---

## Response Format

All APIs follow a consistent response format:

### Success Response
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message description"
}
```

---

## Status Codes

- `200`: Successful GET/PUT/DELETE
- `201`: Successful POST (created)
- `400`: Bad request or validation error
- `404`: Resource not found
- `409`: Conflict (duplicate entry)
- `500`: Server error

---

## Common Features

All APIs include:
- ✅ Proper error handling with try-catch
- ✅ TypeScript strict type checking
- ✅ MongoDB connection via `connectDB()`
- ✅ Consistent response format
- ✅ Query parameter filtering
- ✅ Validation for duplicate entries where applicable
- ✅ Mongoose population for related data
- ✅ Pagination-ready (can add limit/offset)

---

## Usage Notes

1. **Query Parameters**: Use query strings for filtering (e.g., `/api/user?role=Guru`)
2. **ID Parameter**: Required for PUT and DELETE operations
3. **Request Body**: Required for POST and PUT operations
4. **Error Handling**: All endpoints return proper error messages in JSON format
5. **Password Handling**: User passwords are excluded from GET responses automatically

---

## File Locations

```
app/api/
├── user/
│   └── route.ts
├── class/
│   └── route.ts
├── subject/
│   └── route.ts
├── period/
│   └── route.ts
├── class-subject/
│   └── route.ts
├── enrollment/
│   └── route.ts
├── material/
│   └── route.ts
├── assignment/
│   └── route.ts
└── submission/
    └── route.ts
```

---

## Next Steps

1. **Testing**: Test each endpoint with Postman or similar tools
2. **Frontend Integration**: Create client-side API calls using the `lib/user/api.ts` pattern
3. **Authentication**: Add authentication middleware to protect routes
4. **Authorization**: Add role-based access control (RBAC)
5. **Pagination**: Add offset/limit parameters for better performance
6. **Caching**: Consider adding Redis caching for frequently accessed data
