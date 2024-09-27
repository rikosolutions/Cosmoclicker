
const AUTH_TOKEN_KEY = 'auth_token';

//*************** Session Functions ***************//

export function setItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return localStorage.getItem(key) === value;
  } catch (error) {
    console.error(`Failed to set item: ${key}`, error);
    return false;
  }
}

/**
 * Sets multiple items in localStorage.
 * @param {Object} data - An object containing key-value pairs to store.
 * @returns {boolean} True if all items were successfully set, false otherwise.
 * @throws {Error} Throws an error if any item fails to be set.
 */
export function setItems(data) {
  for (const [key, value] of Object.entries(data)) {
    if (!setItem(key, value)) {
      throw new Error(`Failed to set session item: ${key}`);
    }
  }
  return true;
}


export function clearStorage() {
  localStorage.clear();
}

//*************** Session Functions ***************//

//*************** Auth Functions ***************//

export function isAuth() {
  return localStorage.getItem(AUTH_TOKEN_KEY) !== null;
}


export function setAuth(token) {
  return setItem(AUTH_TOKEN_KEY, token);
}

export function getAuth() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return localStorage.getItem(AUTH_TOKEN_KEY) === null;
  } catch (error) {
    console.error('Failed to clear auth token', error);
    return false;
  }
}

//*************** Auth Functions ***************//
