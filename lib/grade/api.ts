import { IGrade } from "@/models/Grade";

interface APIResponse {
  success: boolean;
  count: number;
  data: IGrade[];
}

interface AssignmentScore {
  assignment: string;
  score: number;
  weight: number;
}

interface QuizScore {
  quiz: string;
  score: number;
  weight: number;
}

interface CreateGradePayload {
  Student: string;
  ClassSubject: string;
  Period: string;
  assignmentScores?: AssignmentScore[];
  quizScores?: QuizScore[];
  midtermScore?: number;
  finalScore?: number;
  attendancePercentage?: number;
  finalGrade?: number;
  letterGrade?: 'A' | 'B' | 'C' | 'D' | 'E';
  gradeStatus?: 'Passed' | 'Failed' | 'Incomplete';
}

interface UpdateGradePayload {
  assignmentScores?: AssignmentScore[];
  quizScores?: QuizScore[];
  midtermScore?: number;
  finalScore?: number;
  attendancePercentage?: number;
  finalGrade?: number;
  letterGrade?: 'A' | 'B' | 'C' | 'D' | 'E';
  gradeStatus?: 'Passed' | 'Failed' | 'Incomplete';
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function getGrades(filters?: {
  studentId?: string;
  classSubjectId?: string;
  periodId?: string;
  status?: string;
}) {
  const endpoint = '/api/grade';

  if (!baseUrl) {
    console.error("BASE_URL is not defined in the environment.");
    return [];
  }

  const url = new URL(`${baseUrl}${endpoint}`);
  if (filters?.studentId) url.searchParams.append('studentId', filters.studentId);
  if (filters?.classSubjectId) url.searchParams.append('classSubjectId', filters.classSubjectId);
  if (filters?.periodId) url.searchParams.append('periodId', filters.periodId);
  if (filters?.status) url.searchParams.append('status', filters.status);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`API Error: Status ${response.status}`);
      throw new Error(`Failed to fetch grades, status: ${response.status}`);
    }

    const result: APIResponse = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return [];
    }

    return result.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown fetching error";
    console.error(`[Data Fetcher] Failed to fetch grades: ${errorMessage}`);
    return [];
  }
}

export async function getGradeById(id: string) {
  const endpoint = '/api/grade';

  if (!baseUrl) {
    console.error("BASE_URL is not defined in the environment.");
    return null;
  }

  const url = new URL(`${baseUrl}${endpoint}`);
  url.searchParams.append('id', id);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`API Error: Status ${response.status}`);
      throw new Error(`Failed to fetch grade, status: ${response.status}`);
    }

    const result: APIResponse = await response.json();

    if (!result.success || !result.data || result.data.length === 0) {
      console.error("Grade not found");
      return null;
    }

    return result.data[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown fetching error";
    console.error(`[Data Fetcher] Failed to fetch grade: ${errorMessage}`);
    return null;
  }
}

export async function createGrade(gradeData: CreateGradePayload) {
  const endpoint = '/api/grade';

  if (!baseUrl) {
    console.error("BASE_URL is not defined in the environment.");
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gradeData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create grade, status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return null;
    }

    return result.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Data Fetcher] Failed to create grade: ${errorMessage}`);
    return null;
  }
}

export async function updateGrade(id: string, gradeData: UpdateGradePayload) {
  const endpoint = '/api/grade';

  if (!baseUrl) {
    console.error("BASE_URL is not defined in the environment.");
    return null;
  }

  const url = new URL(`${baseUrl}${endpoint}`);
  url.searchParams.append('id', id);

  try {
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gradeData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update grade, status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return null;
    }

    return result.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Data Fetcher] Failed to update grade: ${errorMessage}`);
    return null;
  }
}

export async function deleteGrade(id: string) {
  const endpoint = '/api/grade';

  if (!baseUrl) {
    console.error("BASE_URL is not defined in the environment.");
    return false;
  }

  const url = new URL(`${baseUrl}${endpoint}`);
  url.searchParams.append('id', id);

  try {
    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete grade, status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return false;
    }

    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Data Fetcher] Failed to delete grade: ${errorMessage}`);
    return false;
  }
}

/**
 * Utility function to calculate final grade from components
 * @param assignments - Array of assignment scores with weights
 * @param quizzes - Array of quiz scores with weights
 * @param midtermScore - Midterm exam score
 * @param finalScore - Final exam score
 * @returns Calculated final grade (0-100)
 */
export function calculateFinalGrade(
  assignments: Array<{ score: number; weight: number }> = [],
  quizzes: Array<{ score: number; weight: number }> = [],
  midtermScore: number = 0,
  finalScore: number = 0
): number {
  // Calculate weighted averages for assignments and quizzes
  const assignmentAvg = assignments.length > 0
    ? assignments.reduce((sum, a) => sum + a.score * a.weight, 0) /
      assignments.reduce((sum, a) => sum + a.weight, 0)
    : 0;

  const quizAvg = quizzes.length > 0
    ? quizzes.reduce((sum, q) => sum + q.score * q.weight, 0) /
      quizzes.reduce((sum, q) => sum + q.weight, 0)
    : 0;

  // Final grade = (Assignment 30% + Quiz 20% + Midterm 20% + Final 30%)
  const finalGrade =
    assignmentAvg * 0.3 +
    quizAvg * 0.2 +
    (midtermScore || 0) * 0.2 +
    (finalScore || 0) * 0.3;

  return Math.round(finalGrade * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert numeric grade to letter grade
 * @param grade - Numeric grade (0-100)
 * @returns Letter grade (A-E)
 */
export function getLetterGrade(grade: number): 'A' | 'B' | 'C' | 'D' | 'E' {
  if (grade >= 85) return 'A';
  if (grade >= 75) return 'B';
  if (grade >= 60) return 'C';
  if (grade >= 50) return 'D';
  return 'E';
}

/**
 * Determine pass/fail status
 * @param finalGrade - Final numeric grade
 * @param letterGrade - Letter grade
 * @param isComplete - Whether all assessment components are complete
 * @returns Grade status
 */
export function getGradeStatus(
  finalGrade: number,
  letterGrade: 'A' | 'B' | 'C' | 'D' | 'E',
  isComplete: boolean = true
): 'Passed' | 'Failed' | 'Incomplete' {
  if (!isComplete) return 'Incomplete';
  if (finalGrade >= 60 && letterGrade !== 'E') return 'Passed';
  return 'Failed';
}
