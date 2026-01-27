const ROLE_KEY = 'user_role';

export const loginAsAdmin = () => {
  localStorage.setItem(ROLE_KEY, 'admin');
};

export const loginAsManager = () => {
  localStorage.setItem(ROLE_KEY, 'manager');
};

export const getUserRole = () => {
  return localStorage.getItem(ROLE_KEY) || 'admin';
};

export const logout = () => {
  localStorage.removeItem(ROLE_KEY);
  window.location.reload();
};
