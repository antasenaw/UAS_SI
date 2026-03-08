import { IClass } from "@/models/Class";

interface APIResponse {
  success: boolean;
  count: number;
  data: IClass[];
}

interface CreateClassPayload {
  grade: string;
  major: string;
  section: string;
  Wali_kelas: string;
}

interface UpdateClassPayload {
  grade?: string;
  major?: string;
  section?: string;
  Wali_kelas?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function getClasses(filters?: { grade?: string; major?: string }) {
  const endpoint = '/api/class';
  
  if (!baseUrl) {
    console.error("BASE_URL is not defined in the environment.");
    return [];
  }

  const url = new URL(`${baseUrl}${endpoint}`);
  if (filters?.grade) url.searchParams.append('grade', filters.grade);
  if (filters?.major) url.searchParams.append('major', filters.major);

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
      throw new Error(`Failed to fetch classes, status: ${response.status}`);
    }

    const result: APIResponse = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return [];
    }

    return result.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown fetching error";
    console.error(`[Data Fetcher] Failed to fetch classes: ${errorMessage}`);
    return [];
  }
}

export async function getClassById(id: string) {
  const endpoint = '/api/class';
  
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
      throw new Error(`Failed to fetch class, status: ${response.status}`);
    }

    const result: APIResponse = await response.json();

    if (!result.success || !result.data || result.data.length === 0) {
      console.error("Class not found");
      return null;
    }

    return result.data[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown fetching error";
    console.error(`[Data Fetcher] Failed to fetch class: ${errorMessage}`);
    return null;
  }
}

export async function createClass(classData: CreateClassPayload) {
  const endpoint = '/api/class';
  
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
      body: JSON.stringify(classData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create class, status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return null;
    }

    return result.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Data Fetcher] Failed to create class: ${errorMessage}`);
    return null;
  }
}

export async function updateClass(id: string, classData: UpdateClassPayload) {
  const endpoint = '/api/class';
  
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
      body: JSON.stringify(classData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update class, status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return null;
    }

    return result.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Data Fetcher] Failed to update class: ${errorMessage}`);
    return null;
  }
}

export async function deleteClass(id: string) {
  const endpoint = '/api/class';
  
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
      throw new Error(errorData.error || `Failed to delete class, status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.error("API returned success: false", result);
      return false;
    }

    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Data Fetcher] Failed to delete class: ${errorMessage}`);
    return false;
  }
}
