import { IClassSubject } from "@/models/ClassSubject";

interface APIResponse {
  success: boolean;
  count: number;
  data: IClassSubject[];
}

interface CreateClassSubjectPayload {
  Class: string;
  Subject: string;
  Teacher: string;
}

interface UpdateClassSubjectPayload {
  Class?: string;
  Subject?: string;
  Teacher?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function getClassSubjects(filters?: { classId?: string; subjectId?: string; teacherId?: string }) {
  const endpoint = '/api/class-subject';
  
  if (!baseUrl) {
    console.error("BASE_URL is not defined in the environment.");
    return [];
  }

  const url = new URL(`${baseUrl}${endpoint}`);
  if (filters?.classId) url.searchParams.append('classId', filters.classId);
  if (filters?.subjectId) url.searchParams.append('subjectId', filters.subjectId);
  if (filters?.teacherId) url.searchParams.append('teacherId', filters.teacherId);

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
      throw new Error(`Failed to fetch class subjects, status: ${response.status}`);
    }

    const result: APIResponse = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return [];
    }

    return result.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown fetching error";
    console.error(`[Data Fetcher] Failed to fetch class subjects: ${errorMessage}`);
    return [];
  }
}

export async function getClassSubjectById(id: string) {
  const endpoint = '/api/class-subject';
  
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
      throw new Error(`Failed to fetch class subject, status: ${response.status}`);
    }

    const result: APIResponse = await response.json();

    if (!result.success || !result.data || result.data.length === 0) {
      console.error("Class subject not found");
      return null;
    }

    return result.data[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown fetching error";
    console.error(`[Data Fetcher] Failed to fetch class subject: ${errorMessage}`);
    return null;
  }
}

export async function createClassSubject(classSubjectData: CreateClassSubjectPayload) {
  const endpoint = '/api/class-subject';
  
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
      body: JSON.stringify(classSubjectData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create class subject, status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return null;
    }

    return result.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Data Fetcher] Failed to create class subject: ${errorMessage}`);
    return null;
  }
}

export async function updateClassSubject(id: string, classSubjectData: UpdateClassSubjectPayload) {
  const endpoint = '/api/class-subject';
  
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
      body: JSON.stringify(classSubjectData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update class subject, status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return null;
    }

    return result.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Data Fetcher] Failed to update class subject: ${errorMessage}`);
    return null;
  }
}

export async function deleteClassSubject(id: string) {
  const endpoint = '/api/class-subject';
  
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
      throw new Error(errorData.error || `Failed to delete class subject, status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return false;
    }

    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Data Fetcher] Failed to delete class subject: ${errorMessage}`);
    return false;
  }
}
