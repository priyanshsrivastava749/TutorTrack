import { User, Assignment, ResourceQuery } from '../types';

// In production (Vercel), we use the VITE_API_URL env var.
// In dev, we fallback to '/api' which Vite proxies.
// In production (Vercel), we use the VITE_API_URL env var.
// In dev, we fallback to '/api' which Vite proxies.
const BASE_URL = import.meta.env.VITE_API_URL || 'https://tutortrack-backend-55tf.onrender.com';
export const API_URL = `${BASE_URL}/api`;

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Token ${token}` } : {})
    };
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.reload();
        }
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'Request failed');
    }
    return response.json();
};

export const api = {
    // Auth
    login: async (email, password): Promise<{ success: boolean; user?: User; message?: string }> => {
        try {
            const res = await fetch(`${API_URL}/auth/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                return { success: true, user: data.user };
            }
            return { success: false, message: data.message };
        } catch (e) {
            return { success: false, message: 'Server error' };
        }
    },

    register: async (name, email, password, role): Promise<{ success: boolean; user?: User; message?: string }> => {
        try {
            const res = await fetch(`${API_URL}/auth/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                return { success: true, user: data.user };
            }
            return { success: false, message: data.message };
        } catch (e) {
            return { success: false, message: 'Server error' };
        }
    },

    getMe: async (): Promise<User | null> => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const res = await fetch(`${API_URL}/users/me/`, { headers: getHeaders() });
            return res.ok ? await res.json() : null;
        } catch {
            return null;
        }
    },

    // Users
    getUsers: async (): Promise<User[]> => {
        const res = await fetch(`${API_URL}/users/`, { headers: getHeaders() });
        return handleResponse(res);
    },

    linkStudent: async (studentUniqueId: string): Promise<boolean> => {
        const res = await fetch(`${API_URL}/link-student/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ student_code: studentUniqueId })
        });
        const data = await res.json();
        return data.success;
    },

    updateUserResources: async (user: User) => {
        const res = await fetch(`${API_URL}/users/${user.id}/update_resources/`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(user)
        });
        return handleResponse(res);
    },

    // Assignments
    getAssignments: async (): Promise<Assignment[]> => {
        const res = await fetch(`${API_URL}/assignments/`, { headers: getHeaders() });
        return handleResponse(res);
    },

    addAssignment: async (assignment: Partial<Assignment>) => {
        const res = await fetch(`${API_URL}/assignments/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(assignment)
        });
        return handleResponse(res);
    },

    updateAssignment: async (assignment: Assignment) => {
        const res = await fetch(`${API_URL}/assignments/${assignment.id}/`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(assignment)
        });
        return handleResponse(res);
    },

    deleteAssignment: async (id: string) => {
        await fetch(`${API_URL}/assignments/${id}/`, {
            method: 'DELETE',
            headers: getHeaders()
        });
    },

    // Resources
    getResourceQueries: async (): Promise<ResourceQuery[]> => {
        const res = await fetch(`${API_URL}/queries/`, { headers: getHeaders() });
        return handleResponse(res);
    },

    addResourceQuery: async (query: Partial<ResourceQuery>) => {
        const res = await fetch(`${API_URL}/queries/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(query)
        });
        return handleResponse(res);
    },

    updateResourceQuery: async (query: ResourceQuery) => {
        const res = await fetch(`${API_URL}/queries/${query.id}/`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(query)
        });
        return handleResponse(res);
    },

    deleteResourceQuery: async (id: string) => {
        await fetch(`${API_URL}/queries/${id}/`, {
            method: 'DELETE',
            headers: getHeaders()
        });
    }
};
