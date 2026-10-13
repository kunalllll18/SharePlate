const API_BASE_URL = 'http://localhost:8080/api';

async function safeFetch(url, options = {}) {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (err.name === 'TypeError' || err.message?.includes('fetch')) {
      throw new Error('Cannot connect to server. Please verify backend is running on http://localhost:8080');
    }
    throw err;
  }
}

export async function fetchFoods({ search, location, status, sortBy = 'urgency' } = {}) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (location && location !== 'All locations') params.append('location', location);
  if (status && status !== 'ALL') params.append('status', status);
  if (sortBy) params.append('sortBy', sortBy);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await safeFetch(`${API_BASE_URL}/foods${queryString}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch food listings (${response.status})`);
  }
  return response.json();
}

export async function createFood(foodData) {
  const response = await safeFetch(`${API_BASE_URL}/foods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(foodData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (errorData.details) {
      const fieldErrors = Object.entries(errorData.details)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join('; ');
      throw new Error(fieldErrors || errorData.error || 'Validation failed');
    }
    throw new Error(errorData.error || `Failed to create food listing (${response.status})`);
  }

  return response.json();
}

export async function claimFoodApi(id, claimantInfo = {}) {
  const response = await safeFetch(`${API_BASE_URL}/foods/${id}/claim`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(claimantInfo),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to claim food listing (${response.status})`);
  }

  return response.json();
}

export async function loginUser(email, password) {
  const response = await safeFetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Invalid email or password');
  }

  return response.json();
}

export async function registerUser(userData) {
  const response = await safeFetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Registration failed');
  }

  return response.json();
}
