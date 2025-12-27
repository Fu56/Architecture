import { jwtDecode } from 'jwt-decode';

export type Role = 'student' | 'faculty' | 'admin';

export const getToken = () => localStorage.getItem('token');
export const setToken = (t: string) => localStorage.setItem('token', t);
export const clearToken = () => localStorage.removeItem('token');

export const getUser = () => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
};
export const setUser = (u: any) => localStorage.setItem('user', JSON.stringify(u));

export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;

    try {
        const decoded: { exp: number } = jwtDecode(token);
        // Check if token is expired
        if (Date.now() >= decoded.exp * 1000) {
            clearToken();
            localStorage.removeItem('user');
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
};

export const currentRole = (): Role | null => {
    if (!isAuthenticated()) return null;
    return getUser()?.role ?? null;
};
