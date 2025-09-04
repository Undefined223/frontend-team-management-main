import React from 'react'
import { deleteProjectTeamMember } from '../lib/http/projects.http'
import { useMutation } from '@tanstack/react-query'
import useUserInfo from './useUserInfo'

const useDeleteTeamMember = (ProjectId, success, error) => {
    const { token } = useUserInfo();
    return useMutation({
        mutationFn: (teamMemberId) => deleteProjectTeamMember(ProjectId, teamMemberId, token),
        onSuccess: success,
        onError: error
    })
}

export default useDeleteTeamMember
