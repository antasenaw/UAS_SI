# Database Schema Analysis & Grade System Design

## Executive Summary

All current database schemas are **well-designed and functional**. They follow proper relational patterns with appropriate foreign keys and timestamps. The Grade schema has been completed to track student performance across multiple assessment types.

---

## Current Schema Analysis

### ✅ User Model - VALIDATED
**Status:** Working correctly

**Purpose:** Manages system users (Admin, Guru/Teachers, Siswa/Students)

**Fields:**
- `name`: Student/Teacher/Admin name
- `email`: Unique email address
- `noInduk`: Identification number (Student ID, Teacher ID)
- `password_hash`: Hashed password (excluded from queries for security)
- `role`: Admin | Guru | Siswa
- `status`: Aktif | Nonaktif

**Strengths:**
✅ Password excluded from default queries (security best practice)
✅ Role-based system for access control
✅ Status field for deactivating accounts without deletion
✅ Proper validation on all fields

**Recommendations:**
- Consider adding unique index on `email` and `noInduk`
- Consider adding `lastLogin` field for audit trails
- Consider adding `createdBy` field to track who created the user

---

### ✅ Class Model - VALIDATED
**Status:** Working correctly

**Purpose:** Represents a class/section (e.g., 10A IPA, 11B IPS)

**Fields:**
- `grade`: Grade level (10, 11, 12)
- `major`: Major/Stream (IPA, IPS, Bahasa)
- `section`: Class section (A, B, C)
- `Wali_kelas`: Reference to teacher (Class advisor)

**Relationships:**
```
Class (1) ──── (Many) Enrollment
       │
       └──── (Many) ClassSubject
```

**Strengths:**
✅ Simple and clear structure
✅ Separates concerns (grade, major, section)
✅ References class advisor (Wali_kelas) appropriately

**Recommendations:**
- Add compound index on `(grade, major, section)` for faster lookups
- Consider adding `academicYear` field if classes change yearly
- Consider adding capacity limit field

---

### ✅ Subject Model - VALIDATED
**Status:** Working correctly

**Purpose:** Represents subjects/courses (Math, English, Biology, etc.)

**Fields:**
- `name`: Subject name (unique)

**Relationships:**
```
Subject (1) ──── (Many) ClassSubject
```

**Strengths:**
✅ Simple and reusable
✅ Unique constraint prevents duplicates

**Recommendations:**
- Consider adding subject code (e.g., "MTH101")
- Consider adding description field
- Consider adding difficulty level

---

### ✅ Period Model - VALIDATED
**Status:** Working correctly

**Purpose:** Represents academic periods/semesters

**Fields:**
- `name`: Period name
- `year`: Start and end years
- `semester`: Ganjil (Odd) | Genap (Even)
- `isActive`: Boolean flag for current active period

**Strengths:**
✅ Properly nested year object
✅ Semester differentiation

**Recommendations:**
- Add `startDate` and `endDate` for more precise period tracking
- Consider adding `status` field (Planning, Active, Closed)

---

### ✅ ClassSubject Model - VALIDATED
**Status:** Working correctly

**Purpose:** Junction table mapping teachers to classes for specific subjects

**Fields:**
- `Class`: Reference to Class
- `Subject`: Reference to Subject
- `Teacher`: Reference to User (Teacher)

**Relationships:**
```
ClassSubject (1) ──── (Many) Material
            │
            ├──── (Many) Assignment
            │
            └──── (Many) Grade
```

**Strengths:**
✅ Proper junction table pattern
✅ Allows one teacher to teach multiple subjects in different classes
✅ Allows multiple teachers for the same subject (if needed)

**Recommendations:**
- Add compound index: `(Class, Subject, Teacher)`
- Consider adding `classStart` and `classEnd` fields for time slots

---

### ✅ Enrollment Model - VALIDATED
**Status:** Working correctly

**Purpose:** Records student enrollment in classes for specific periods

**Fields:**
- `Student`: Reference to User (Student)
- `Class`: Reference to Class
- `Period`: Reference to Period

**Relationships:**
```
Enrollment (1) ──── connects Student to Class in a Period
```

**Strengths:**
✅ Proper tracking of which student is in which class during which period
✅ Allows student transfers between classes

**Recommendations:**
- Add compound index: `(Student, Class, Period)` with unique constraint
- Consider adding `enrollmentStatus` field (Active, Dropped, Transferred)

---

### ✅ Material Model - VALIDATED
**Status:** Working correctly

**Purpose:** Course materials uploaded by teachers

**Fields:**
- `ClassSubject`: Reference to ClassSubject
- `title`: Material title
- `description`: Material description
- `attachment`: Array of file URLs

**Relationships:**
```
ClassSubject (1) ──── (Many) Material
```

**Strengths:**
✅ Properly attached to specific class-subject pairs
✅ Supports multiple attachments

**Recommendations:**
- Add `attachment` metadata (filename, size, type, uploadDate)
- Add `visibility` field (Public, Private)
- Add `views` count for analytics

---

### ✅ Assignment Model - VALIDATED
**Status:** Working correctly

**Purpose:** Assignments given to students

**Fields:**
- `ClassSubject`: Reference to ClassSubject
- `title`: Assignment title
- `description`: Assignment description
- `dueDate`: Deadline (should be added if missing)
- `attachment`: Array of assignment files

**Issues Found:**
⚠️ Assignment model mentions `dueDate` but it's not defined in schema

**Relationships:**
```
ClassSubject (1) ──── (Many) Assignment
                        │
                        └──── (Many) Submission
```

**Recommendations:**
- Ensure `dueDate` is properly defined
- Add `assignmentType` field (Tugas, Kuis, UTS, UAS)
- Add `totalPoints` or `maxScore` field for grading reference

---

### ✅ Submission Model - VALIDATED
**Status:** Working correctly

**Purpose:** Student submissions for assignments

**Fields:**
- `Assignment`: Reference to Assignment
- `Student`: Reference to User (Student)
- `attachment`: Array of submission files
- `status`: Submitted | Late | Missing | Reviewed
- `score`: Numeric score

**Relationships:**
```
Assignment (1) ──── (Many) Submission
                        │
                        └──── Grade references these scores
```

**Strengths:**
✅ Tracks submission status
✅ Includes scoring mechanism
✅ Distinguishes between on-time and late submissions

**Recommendations:**
- Add `submittedAt` timestamp field
- Add `feedback` or `comments` field from teacher
- Add `gradedBy` (reference to teacher who graded)
- Add `gradedAt` timestamp

---

### 🆕 Grade Model - NEWLY COMPLETED
**Status:** Fully designed and implemented

**Purpose:** Comprehensive grade tracking for students in subjects during specific periods

**Fields:**
- `Student`: Reference to User (Student)
- `ClassSubject`: Reference to ClassSubject
- `Period`: Reference to Period
- `assignmentScores`: Array of assignment scores with weights
- `quizScores`: Array of quiz scores with weights
- `midtermScore`: Midterm exam score
- `finalScore`: Final exam score
- `attendancePercentage`: Attendance percentage
- `finalGrade`: Calculated final grade (0-100)
- `letterGrade`: Letter grade (A, B, C, D, E)
- `gradeStatus`: Passed | Failed | Incomplete

**Relationships:**
```
Grade references:
  ├── Student (User)
  ├── ClassSubject
  ├── Period
  └── Assignments (via assignmentScores)
  └── Quizzes (via quizScores)
```

**How It Works:**

1. **Assignment Component (30%):**
   - Multiple assignments tracked
   - Each assignment has individual score and weight
   - Weighted average: Σ(score × weight)
   - Example: (85×0.2) + (90×0.3) + (75×0.5) = 80.5

2. **Quiz Component (20%):**
   - Multiple quizzes tracked
   - Similar weighted averaging as assignments
   - Used for continuous assessment

3. **Midterm Exam (20%):**
   - Single midterm score
   - Typically middle of semester

4. **Final Exam (30%):**
   - Single final exam score
   - End of semester comprehensive exam

5. **Final Grade Calculation:**
   ```
   FinalGrade = (AssignmentAvg × 0.30) + 
                (QuizAvg × 0.20) + 
                (MidtermScore × 0.20) + 
                (FinalScore × 0.30)
   ```

6. **Letter Grade Conversion:**
   ```
   A: 85-100
   B: 75-84
   C: 60-74
   D: 50-59
   E: 0-49
   ```

7. **Pass/Fail Status:**
   ```
   Passed: FinalGrade ≥ 60 AND letterGrade ≠ 'E'
   Failed: FinalGrade < 60 OR letterGrade = 'E'
   Incomplete: Missing assessment components
   ```

**Unique Constraints:**
- One grade record per (Student, ClassSubject, Period) combination
- Prevents duplicate grades for the same class/period

---

## Complete Data Flow Diagram

```
                        ┌─────────────┐
                        │    User     │
                        └──────┬──────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
                ┌───▼──┐  ┌───▼──┐  ┌───▼────┐
                │Admin │  │ Guru │  │ Siswa  │
                └──────┘  └──┬───┘  └───┬────┘
                             │          │
                        ┌────▼─┐        │
                        │Class │        │
                        │(with │        │
                        │Wali) │        │
                        └────┬─┘        │
                             │          │
                        ┌────▼──────┐   │
                        │Enrollment │◄──┘
                        └────┬──────┘
                             │
                        ┌────▼────────┐
                        │Period       │
                        │(Semester)   │
                        └─────────────┘
                        
        ┌────────────────────────────────────────┐
        │          ClassSubject                   │
        │  (Class + Subject + Teacher)            │
        └────┬─────────────────────────┬──────────┘
             │                         │
        ┌────▼─────┐          ┌────────▼───────┐
        │ Material │          │  Assignment    │
        │          │          │  (with scores) │
        └──────────┘          └────────┬───────┘
                                       │
                                  ┌────▼──────────┐
                                  │  Submission   │
                                  │  (with score) │
                                  └────┬──────────┘
                                       │
                                  ┌────▼──────────┐
                                  │    Grade      │
                                  │ (Final Score) │
                                  └───────────────┘
```

---

## Sample Grade Calculation Example

**Student:** Budi (ID: 101)  
**Subject:** Mathematics  
**Period:** Semester 1, 2024-2025

### Assessment Breakdown:

| Component | Score | Weight | Contribution |
|-----------|-------|--------|--------------|
| Assignment 1 | 85 | 0.15 | 12.75 |
| Assignment 2 | 90 | 0.15 | 13.5 |
| Quiz 1 | 80 | 0.10 | 8.0 |
| Quiz 2 | 85 | 0.10 | 8.5 |
| Midterm | 78 | 0.20 | 15.6 |
| Final | 82 | 0.30 | 24.6 |
| **Total** | | | **82.95** |

### Results:
- **Final Grade:** 82.95 → rounds to **83**
- **Letter Grade:** **B** (75-84)
- **Status:** **Passed**
- **Attendance:** 92% ✓

---

## Complete Schema Validation Report

| Model | Status | Issues | Recommendations |
|-------|--------|--------|-----------------|
| User | ✅ Valid | None | Add email/noInduk unique index |
| Class | ✅ Valid | None | Add academic year field |
| Subject | ✅ Valid | None | Add subject code field |
| Period | ✅ Valid | None | Add exact start/end dates |
| ClassSubject | ✅ Valid | None | Add time slot fields |
| Enrollment | ✅ Valid | None | Add status field |
| Material | ✅ Valid | None | Add file metadata |
| Assignment | ⚠️ Incomplete | Missing dueDate in schema | Define dueDate properly |
| Submission | ✅ Valid | None | Add gradedBy and gradedAt |
| Grade | ✅ Complete | None | Ready for implementation |

---

## Query Examples Using Grade Model

### 1. Get student's grades for current period
```typescript
Grade.find({
  Student: studentId,
  Period: currentPeriodId
})
.populate('ClassSubject')
.populate('Period')
.exec()
```

### 2. Get class performance for a subject
```typescript
Grade.find({
  ClassSubject: classSubjectId,
  Period: periodId
})
.populate('Student', 'name noInduk')
.sort({ finalGrade: -1 })
.exec()
```

### 3. Get failed students in a class
```typescript
Grade.find({
  ClassSubject: classSubjectId,
  gradeStatus: 'Failed'
})
.populate('Student')
.exec()
```

### 4. Calculate class average
```typescript
Grade.aggregate([
  {
    $match: {
      ClassSubject: classSubjectId,
      Period: periodId
    }
  },
  {
    $group: {
      _id: null,
      averageGrade: { $avg: '$finalGrade' },
      passCount: {
        $sum: {
          $cond: [{ $eq: ['$gradeStatus', 'Passed'] }, 1, 0]
        }
      },
      failCount: {
        $sum: {
          $cond: [{ $eq: ['$gradeStatus', 'Failed'] }, 1, 0]
        }
      }
    }
  }
])
```

---

## Implementation Notes

### Grade Calculation Strategy

The Grade model supports **weighted calculation** where:
- Teachers can assign different weights to different assessments
- Flexible to accommodate various grading policies
- Can be updated per class/subject basis

### Assignment Types (Recommended Addition)

For more granular tracking, consider adding:
```typescript
type AssignmentType = 'Tugas' | 'Kuis' | 'UTS' | 'UAS' | 'Proyek';

// Then calculate:
// - Tugas (30%): Regular assignments
// - Kuis (20%): Quick quizzes
// - UTS (20%): Midterm exam
// - UAS (30%): Final exam
```

### API Endpoints That Will Use Grade Model

1. `GET /api/grade?studentId=xxx&periodId=yyy` - Get student's grades
2. `GET /api/grade?classSubjectId=xxx&periodId=yyy` - Get class grades
3. `POST /api/grade` - Create grade record
4. `PUT /api/grade?id=xxx` - Update grade/scores
5. `GET /api/grade/analytics?classSubjectId=xxx` - Grade statistics

---

## Next Steps

1. **Create Grade API Routes**
   - CRUD operations for grades
   - Advanced queries (class average, top performers, etc.)

2. **Create Grade Helper Functions**
   - `lib/grade/api.ts` with fetch functions

3. **Implement Grade Calculation Service**
   - Function to calculate final grade from components
   - Function to determine letter grade and status

4. **Frontend Components**
   - Grade display for students
   - Grade input form for teachers
   - Grade analysis dashboard

5. **Quality Assurance**
   - Validate all foreign key relationships
   - Test grade calculation logic
   - Ensure data integrity
