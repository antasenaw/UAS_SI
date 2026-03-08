import { IAssignment } from "@/models/Assignment";

interface APIResponse {
  success: boolean;
  count: number;
  data: IAssignment[];
}

interface CreateAssignmentPayload {
  ClassSubject: string;
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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function getAssignments(filters?: { classSubjectId?: string; search?: string }) {
  const endpoint = '/api/assignment';
  
  if (!baseUrl) {
    console.error("BASE_URL is not defined in the environment.");
    return [];
  }

  const url = new URL(`${baseUrl}${endpoint}`);
  if (filters?.classSubjectId) url.searchParams.append('classSubjectId', filters.classSubjectId);
  if (filters?.search) url.searchParams.append('search', filters.search);

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
      throw new Error(`Failed to fetch assignments, status: ${response.status}`);
    }

    const result: APIResponse = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return [];
    }

    return result.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown fetching error";
    console.error(`[Data Fetcher] Failed to fetch assignments: ${errorMessage}`);
    return [];
  }
}

export async function getAssignmentById(id: string) {
  const endpoint = '/api/assignment';
  
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
      throw new Error(`Failed to fetch assignment, status: ${response.status}`);
    }

    const result: APIResponse = await response.json();

    if (!result.success || !result.data || result.data.length === 0) {
      console.error("Assignment not found");
      return null;
    }

    return result.data[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown fetching error";
    console.error(`[Data Fetcher] Failed to fetch assignment: ${errorMessage}`);
    return null;
  }
}

export async function createAssignment(assignmentData: CreateAssignmentPayload) {
  const endpoint = '/api/assignment';
  
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
      body: JSON.stringify(assignmentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create assignment, status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return null;
    }

    return result.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Data Fetcher] Failed to create assignment: ${errorMessage}`);
    return null;
  }
}

export async function updateAssignment(id: string, assignmentData: UpdateAssignmentPayload) {
  const endpoint = '/api/assignment';
  
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
      body: JSON.stringify(assignmentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update assignment, status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return null;
    }

    return result.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Data Fetcher] Failed to update assignment: ${errorMessage}`);
    return null;
  }
}

export async function deleteAssignment(id: string) {
  const endpoint = '/api/assignment';
  
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
      throw new Error(errorData.error || `Failed to delete assignment, status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return false;
    }

    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Data Fetcher] Failed to delete assignment: ${errorMessage}`);
    return false;
  }
}
