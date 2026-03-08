import { IEnrollment } from "@/models/Enrollment";

interface APIResponse {
  success: boolean;
  count: number;
  data: IEnrollment[];
}

interface CreateEnrollmentPayload {
  Student: string;
  Class: string;
  Period: string;
}

interface UpdateEnrollmentPayload {
  Student?: string;
  Class?: string;
  Period?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function getEnrollments(filters?: { studentId?: string; classId?: string; periodId?: string }) {
  const endpoint = '/api/enrollment';
  
  if (!baseUrl) {
    console.error("BASE_URL is not defined in the environment.");
    return [];
  }

  const url = new URL(`${baseUrl}${endpoint}`);
  if (filters?.studentId) url.searchParams.append('studentId', filters.studentId);
  if (filters?.classId) url.searchParams.append('classId', filters.classId);
  if (filters?.periodId) url.searchParams.append('periodId', filters.periodId);

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
      throw new Error(`Failed to fetch enrollments, status: ${response.status}`);
    }

    const result: APIResponse = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return [];
    }

    return result.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown fetching error";
    console.error(`[Data Fetcher] Failed to fetch enrollments: ${errorMessage}`);
    return [];
  }
}

export async function getEnrollmentById(id: string) {
  const endpoint = '/api/enrollment';
  
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
      throw new Error(`Failed to fetch enrollment, status: ${response.status}`);
    }

    const result: APIResponse = await response.json();

    if (!result.success || !result.data || result.data.length === 0) {
      console.error("Enrollment not found");
      return null;
    }

    return result.data[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown fetching error";
    console.error(`[Data Fetcher] Failed to fetch enrollment: ${errorMessage}`);
    return null;
  }
}

export async function createEnrollment(enrollmentData: CreateEnrollmentPayload) {
  const endpoint = '/api/enrollment';
  
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
      body: JSON.stringify(enrollmentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create enrollment, status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return null;
    }

    return result.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Data Fetcher] Failed to create enrollment: ${errorMessage}`);
    return null;
  }
}

export async function updateEnrollment(id: string, enrollmentData: UpdateEnrollmentPayload) {
  const endpoint = '/api/enrollment';
  
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
      body: JSON.stringify(enrollmentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update enrollment, status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return null;
    }

    return result.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Data Fetcher] Failed to update enrollment: ${errorMessage}`);
    return null;
  }
}

export async function deleteEnrollment(id: string) {
  const endpoint = '/api/enrollment';
  
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
      throw new Error(errorData.error || `Failed to delete enrollment, status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return false;
    }

    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Data Fetcher] Failed to delete enrollment: ${errorMessage}`);
    return false;
  }
}
