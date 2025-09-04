import axios from 'axios';
import { BASE_URL } from '../constants';


export const createTask = async (payload, projectId, token) => {
    const response = await axios.post(
        `${BASE_URL}/projects/${projectId}/tasks`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response?.data?.data || ''
}


export const updateTaskGeneral = async (payload, projectId, token, taskId) => {
    const response = await axios.put(
        `${BASE_URL}/projects/${projectId}/tasks/${taskId}/general`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response.data.data; 
}

export const updateTaskAssignee = async (payload, projectId, token, taskId) => {
    const response = await axios.put(
        `${BASE_URL}/projects/${projectId}/tasks/${taskId}/assignee`,
        payload,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    )
    return response?.data?.data || ''
}

export const updateTaskStatus = async (projectId, taskId, status, token) => {
    const response = await axios.put(
        `${BASE_URL}/projects/${projectId}/tasks/${taskId}/status`,
        { status },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response?.data?.data || ''
}
