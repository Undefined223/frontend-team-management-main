import axios from 'axios';
import { BASE_URL } from '../constants'

const login = async ({ email, password }) => {
    const response = await axios.post(
        `${BASE_URL}/auth/login`,
        { email, password },
        {
            headers: { 'Content-Type': 'application/json' }
        }
    );
    return response?.data?.data || {}
};


const getCurrentUser = async (token) => {
    const response = await axios.get(
        `${BASE_URL}/auth/me`,
        {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response?.data?.data || null
}

const updateProfile = async (payload, token) => {
    const response = await axios.post(
        `${BASE_URL}/auth/me`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response?.data?.data || ""
}


export { login, getCurrentUser, updateProfile };
