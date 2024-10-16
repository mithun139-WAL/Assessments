const BASE_URL = "https://fitness-be-70jr.onrender.com";

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout: number = 30000) => {
  const controller = new AbortController();
  const { signal } = controller;
  
  const fetchPromise = fetch(url, { ...options, signal });

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => {
      controller.abort();
      reject(new Error('Request timed out'));
    }, timeout)
  );

  return Promise.race([fetchPromise, timeoutPromise]);
};

const setAuthorizationHeader = (options: RequestInit) => {
  const token = '';
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };    
  }
};

const api = {
  async get(endpoint: string, options: RequestInit = {}) {
    setAuthorizationHeader(options);
    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, { ...options, method: 'GET' });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error fetching data');
    }

    return response.json();
  },

  async post(endpoint: string, body: any, options: RequestInit = {}) {
    setAuthorizationHeader(options);
    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error posting data');
    }

    return response.json();
  },

  async patch(endpoint: string, body: any, options: RequestInit = {}) {
    setAuthorizationHeader(options);
    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error updating data');
    }

    return response.json();
  },

  async delete(endpoint: string, options: RequestInit = {}) {
    setAuthorizationHeader(options);
    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, { ...options, method: 'DELETE' });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error deleting data');
    }

    return response.json();
  },
};

export { api };

