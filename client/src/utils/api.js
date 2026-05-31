const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5001/api'
  : 'https://rogue-7rnu.onrender.com/api';

export const apiCall = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Check if the response is JSON before trying to parse it
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // If it's not JSON (like a 404 HTML page), handle it gracefully
      if (!response.ok) {
        throw new Error(`API returned an error (${response.status}): Endpoint not found or invalid response`);
      }
      data = {}; // Fallback for non-JSON success responses
    }

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Dynamic Product Image Formatter
export const formatProductImage = (url) => {
  if (!url) return "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    const backendBase = API_URL.replace("/api", "");
    if (url.includes("localhost:5000")) {
      return url.replace("http://localhost:5000", backendBase);
    }
    if (url.includes("localhost:5001")) {
      return url.replace("http://localhost:5001", backendBase);
    }
    return url;
  }
  const backendBase = API_URL.replace("/api", "");
  return `${backendBase}${url.startsWith("/") ? "" : "/"}${url}`;
};
