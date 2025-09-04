import axios from 'axios';
import { BASE_URL } from '../constants'

export const getProjects = async (token) => {
    const response = await axios.get(
        `${BASE_URL}/projects/`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response?.data?.data || []
}

export const getProjectById = async (id, token) => {
    const response = await axios.get(
        `${BASE_URL}/projects/${id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response?.data?.data || {}
}

export const deleteProjectById = async (id, token) => {
    const response = await axios.delete(
        `${BASE_URL}/projects/${id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response?.data?.data || ""
}

export const deleteProjectTeamMember = async (projectId, teamMemberId, token) => {
    const response = await axios.delete(
        `${BASE_URL}/projects/${projectId}/teamMembers/${teamMemberId}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response?.data?.data || ""
}

export const addProjectTeamMember = async (projectId, teamMemberId, token) => {
    const response = await axios.post(
        `${BASE_URL}/projects/${projectId}/teamMembers`,
        { userId: teamMemberId },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response?.data?.data || ""
}

export const createProject = async (payload, token) => {
    const response = await axios.post(
        `${BASE_URL}/projects`,
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
