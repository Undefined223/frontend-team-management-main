import axios from 'axios';
import { BASE_URL } from '../constants'

export const getUsers = async (token, projectId) => {
    const response = await axios.get(
        `${BASE_URL}/users${projectId != null ? `?projectId=${projectId}` : ''}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response?.data?.data || [];
}

export const addUser = async (payload, token) => {
    const response = await axios.post(
        `${BASE_URL}/users/`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response?.data?.data || '';
}

export const deleteUser = async (id, token) => {
    const response = await axios.delete(
        `${BASE_URL}/users/${id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response?.data?.data || "";
}
