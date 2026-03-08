# API Helper Functions Documentation

This document provides a comprehensive overview of all the helper/fetcher functions created for client-side API consumption.

## Overview

Helper functions have been created for all 9 resources, following a consistent pattern. Each resource has functions for:
- **GET** all records (with optional filters)
- **GET** single record by ID
- **POST** (create new record)
- **PUT** (update record)
- **DELETE** (delete record)

## File Structure

```
lib/
├── user/
│   └── api.ts
├── class/
│   └── api.ts
├── subject/
│   └── api.ts
├── period/
│   └── api.ts
├── class-subject/
│   └── api.ts
├── enrollment/
│   └── api.ts
├── material/
│   └── api.ts
├── assignment/
│   └── api.ts
└── submission/
    └── api.ts
```

---

## 1. User API Helper Functions
**File:** `lib/user/api.ts`

```typescript
// Get all users with optional role filter
getUsers(filters?: { role?: string }): Promise<IUser[]>

// Get single user by ID
getUserById(id: string): Promise<IUser | null>

// Create new user
createUser(userData: CreateUserPayload): Promise<IUser | null>

// Update user
updateUser(id: string, userData: UpdateUserPayload): Promise<IUser | null>

// Delete user
deleteUser(id: string): Promise<boolean>
```

**Payload Types:**
```typescript
interface CreateUserPayload {
  name: string;
  email: string;
  password_hash: string;
  noInduk: string;
  role: 'Admin' | 'Guru' | 'Siswa';
  status: 'Aktif' | 'Nonaktif';
}

interface UpdateUserPayload {
  name?: string;
  email?: string;
  password_hash?: string;
  noInduk?: string;
  role?: 'Admin' | 'Guru' | 'Siswa';
  status?: 'Aktif' | 'Nonaktif';
}
```

**Usage Example:**
```typescript
import { getUsers, createUser, updateUser } from '@/lib/user/api';

// Get all teachers
const teachers = await getUsers({ role: 'Guru' });

// Get single user
const user = await getUserById('userId123');

// Create new user
const newUser = await createUser({
  name: 'John Doe',
  email: 'john@example.com',
  password_hash: 'hashedpassword',
  noInduk: '12345',
  role: 'Siswa',
  status: 'Aktif'
});

// Update user
const updated = await updateUser('userId123', { 
  status: 'Nonaktif' 
});

// Delete user
const deleted = await deleteUser('userId123');
```

---

## 2. Class API Helper Functions
**File:** `lib/class/api.ts`

```typescript
// Get all classes with optional filters
getClasses(filters?: { grade?: string; major?: string }): Promise<IClass[]>

// Get single class by ID
getClassById(id: string): Promise<IClass | null>

// Create new class
createClass(classData: CreateClassPayload): Promise<IClass | null>

// Update class
updateClass(id: string, classData: UpdateClassPayload): Promise<IClass | null>

// Delete class
deleteClass(id: string): Promise<boolean>
```

**Payload Types:**
```typescript
interface CreateClassPayload {
  grade: string;
  major: string;
  section: string;
  Wali_kelas: string; // Teacher ID
}

interface UpdateClassPayload {
  grade?: string;
  major?: string;
  section?: string;
  Wali_kelas?: string;
}
```

---

## 3. Subject API Helper Functions
**File:** `lib/subject/api.ts`

```typescript
// Get all subjects with optional name search
getSubjects(search?: string): Promise<ISubject[]>

// Get single subject by ID
getSubjectById(id: string): Promise<ISubject | null>

// Create new subject
createSubject(subjectData: CreateSubjectPayload): Promise<ISubject | null>

// Update subject
updateSubject(id: string, subjectData: UpdateSubjectPayload): Promise<ISubject | null>

// Delete subject
deleteSubject(id: string): Promise<boolean>
```

**Payload Types:**
```typescript
interface CreateSubjectPayload {
  name: string;
}

interface UpdateSubjectPayload {
  name?: string;
}
```

---

## 4. Period API Helper Functions
**File:** `lib/period/api.ts`

```typescript
// Get all periods with optional active filter
getPeriods(filters?: { active?: boolean }): Promise<IPeriod[]>

// Get single period by ID
getPeriodById(id: string): Promise<IPeriod | null>

// Create new period
createPeriod(periodData: CreatePeriodPayload): Promise<IPeriod | null>

// Update period
updatePeriod(id: string, periodData: UpdatePeriodPayload): Promise<IPeriod | null>

// Delete period
deletePeriod(id: string): Promise<boolean>
```

**Payload Types:**
```typescript
interface CreatePeriodPayload {
  name: string;
  year: {
    start: number;
    end: number;
  };
  semester: 'Ganjil' | 'Genap';
  isActive?: boolean;
}

interface UpdatePeriodPayload {
  name?: string;
  year?: { start: number; end: number };
  semester?: 'Ganjil' | 'Genap';
  isActive?: boolean;
}
```

---

## 5. ClassSubject API Helper Functions
**File:** `lib/class-subject/api.ts`

```typescript
// Get all class-subject mappings with optional filters
getClassSubjects(filters?: { 
  classId?: string; 
  subjectId?: string; 
  teacherId?: string 
}): Promise<IClassSubject[]>

// Get single mapping by ID
getClassSubjectById(id: string): Promise<IClassSubject | null>

// Create new mapping
createClassSubject(classSubjectData: CreateClassSubjectPayload): Promise<IClassSubject | null>

// Update mapping
updateClassSubject(id: string, classSubjectData: UpdateClassSubjectPayload): Promise<IClassSubject | null>

// Delete mapping
deleteClassSubject(id: string): Promise<boolean>
```

**Payload Types:**
```typescript
interface CreateClassSubjectPayload {
  Class: string;    // Class ID
  Subject: string;  // Subject ID
  Teacher: string;  // Teacher ID
}

interface UpdateClassSubjectPayload {
  Class?: string;
  Subject?: string;
  Teacher?: string;
}
```

---

## 6. Enrollment API Helper Functions
**File:** `lib/enrollment/api.ts`

```typescript
// Get all enrollments with optional filters
getEnrollments(filters?: { 
  studentId?: string; 
  classId?: string; 
  periodId?: string 
}): Promise<IEnrollment[]>

// Get single enrollment by ID
getEnrollmentById(id: string): Promise<IEnrollment | null>

// Create new enrollment
createEnrollment(enrollmentData: CreateEnrollmentPayload): Promise<IEnrollment | null>

// Update enrollment
updateEnrollment(id: string, enrollmentData: UpdateEnrollmentPayload): Promise<IEnrollment | null>

// Delete enrollment
deleteEnrollment(id: string): Promise<boolean>
```

**Payload Types:**
```typescript
interface CreateEnrollmentPayload {
  Student: string;  // Student ID
  Class: string;    // Class ID
  Period: string;   // Period ID
}

interface UpdateEnrollmentPayload {
  Student?: string;
  Class?: string;
  Period?: string;
}
```

---

## 7. Material API Helper Functions
**File:** `lib/material/api.ts`

```typescript
// Get all materials with optional filters
getMaterials(filters?: { 
  classSubjectId?: string; 
  search?: string 
}): Promise<IMaterial[]>

// Get single material by ID
getMaterialById(id: string): Promise<IMaterial | null>

// Create new material
createMaterial(materialData: CreateMaterialPayload): Promise<IMaterial | null>

// Update material
updateMaterial(id: string, materialData: UpdateMaterialPayload): Promise<IMaterial | null>

// Delete material
deleteMaterial(id: string): Promise<boolean>
```

**Payload Types:**
```typescript
interface CreateMaterialPayload {
  ClassSubject: string;     // ClassSubject ID
  title: string;
  description?: string;
  attachment?: string[];
}

interface UpdateMaterialPayload {
  ClassSubject?: string;
  title?: string;
  description?: string;
  attachment?: string[];
}
```

---

## 8. Assignment API Helper Functions
**File:** `lib/assignment/api.ts`

```typescript
// Get all assignments with optional filters
getAssignments(filters?: { 
  classSubjectId?: string; 
  search?: string 
}): Promise<IAssignment[]>

// Get single assignment by ID
getAssignmentById(id: string): Promise<IAssignment | null>

// Create new assignment
createAssignment(assignmentData: CreateAssignmentPayload): Promise<IAssignment | null>

// Update assignment
updateAssignment(id: string, assignmentData: UpdateAssignmentPayload): Promise<IAssignment | null>

// Delete assignment
deleteAssignment(id: string): Promise<boolean>
```

**Payload Types:**
```typescript
interface CreateAssignmentPayload {
  ClassSubject: string;     // ClassSubject ID
  title: string;
  description?: string;
  dueDate?: Date;
  attachment?: string[];
}

interface UpdateAssignmentPayload {
  ClassSubject?: string;
  title?: string;
  description?: string;
  dueDate?: Date;
  attachment?: string[];
}
```

---

## 9. Submission API Helper Functions
**File:** `lib/submission/api.ts`

```typescript
// Get all submissions with optional filters
getSubmissions(filters?: { 
  assignmentId?: string; 
  studentId?: string; 
  status?: string 
}): Promise<ISubmission[]>

// Get single submission by ID
getSubmissionById(id: string): Promise<ISubmission | null>

// Create new submission
createSubmission(submissionData: CreateSubmissionPayload): Promise<ISubmission | null>

// Update submission (for grading)
updateSubmission(id: string, submissionData: UpdateSubmissionPayload): Promise<ISubmission | null>

// Delete submission
deleteSubmission(id: string): Promise<boolean>
```

**Payload Types:**
```typescript
interface CreateSubmissionPayload {
  Assignment: string;  // Assignment ID
  Student: string;     // Student ID
  attachment?: string[];
  status?: 'Submitted' | 'Late' | 'Missing' | 'Reviewed';
  score?: number;
}

interface UpdateSubmissionPayload {
  Assignment?: string;
  Student?: string;
  attachment?: string[];
  status?: 'Submitted' | 'Late' | 'Missing' | 'Reviewed';
  score?: number;
}
```

---

## Common Features

All helper functions include:

✅ **TypeScript Support**
- Full type safety with interfaces
- Optional and required parameters
- Proper return types (Promise<T> or Promise<null>)

✅ **Error Handling**
- Try-catch blocks for network errors
- Proper error messages in console
- Graceful fallbacks (empty arrays or null)

✅ **Environment Validation**
- Checks for `NEXT_PUBLIC_SITE_URL`
- Clear error logging if not configured

✅ **Consistent Response Format**
- All functions follow the API response pattern
- Check for success flag before returning data
- Proper error message extraction

✅ **Query Parameter Filtering**
- Support for optional filters via `searchParams`
- URL encoding handled automatically
- Multiple filter combinations supported

---

## Usage Patterns

### Pattern 1: Fetch Data on Component Mount
```typescript
'use client';
import { useEffect, useState } from 'react';
import { getClasses } from '@/lib/class/api';
import { IClass } from '@/models/Class';

export default function ClassList() {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getClasses({ grade: '10' });
      setClasses(data);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  return <div>{classes.map(c => <p key={c._id}>{c.grade}</p>)}</div>;
}
```

### Pattern 2: Create with Form Submission
```typescript
'use client';
import { createSubject } from '@/lib/subject/api';

export default function CreateSubjectForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const result = await createSubject({
      name: formData.get('name') as string
    });
    
    if (result) {
      alert('Subject created successfully!');
    } else {
      alert('Failed to create subject');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required />
      <button type="submit">Create</button>
    </form>
  );
}
```

### Pattern 3: Update with ID Parameter
```typescript
'use client';
import { updateUser } from '@/lib/user/api';

async function deactivateUser(userId: string) {
  const updated = await updateUser(userId, { 
    status: 'Nonaktif' 
  });
  
  if (updated) {
    console.log('User deactivated');
  }
}
```

### Pattern 4: Delete with Confirmation
```typescript
'use client';
import { deleteClass } from '@/lib/class/api';

async function handleDelete(classId: string) {
  if (confirm('Are you sure you want to delete this class?')) {
    const deleted = await deleteClass(classId);
    if (deleted) {
      alert('Class deleted');
      // Refresh data
    }
  }
}
```

---

## Environment Setup

Make sure `.env.local` has:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production:
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Error Handling Best Practices

All functions log errors to the console with clear prefixes:
- `[Data Fetcher]` - Generic fetch errors
- API errors are extracted from response bodies
- Network errors are caught and logged

Always check for null/empty returns:
```typescript
const user = await getUserById('123');
if (user) {
  // Use user data
} else {
  console.warn('User not found');
}
```

---

## Next Steps

1. **Server Actions**: Consider migrating to Next.js Server Actions for better performance
2. **Caching**: Add React Query or SWR for client-side caching
3. **Authentication**: Add auth headers to requests
4. **Rate Limiting**: Implement request throttling
5. **Optimistic Updates**: Add optimistic UI updates for better UX
