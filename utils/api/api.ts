export interface ApiResponse<T> {
    data: T;
  }
  
  export const apiRequest = async <T>(
    url: string,
    method: 'GET' | 'POST' = 'GET',
    params: Record<string, string> = {},
    body?: unknown
  ): Promise<T> => {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = method === 'GET' && queryString ? `${url}?${queryString}` : url;
  
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
  
    if (method === 'POST' && body) {
      options.body = JSON.stringify(body);
    }
  
    try {
      const response = await fetch(fullUrl, options);
  
      if (!response.ok) {
        throw new Error(`Failed to ${method} data from ${url}`);
      }
  
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`Error during ${method} request to ${url}:`, error);
      throw error;
    }
  };
  