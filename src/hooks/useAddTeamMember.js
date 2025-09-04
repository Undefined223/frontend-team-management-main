import { useMutation } from '@tanstack/react-query'
import { addProjectTeamMember } from '../lib/http/projects.http'
import React from 'react'
import useUserInfo from './useUserInfo'

const useAddTeamMember = (projectId, success, error) => {
  const { token } = useUserInfo();
  return useMutation({
    mutationFn: (memberId) => addProjectTeamMember(projectId, memberId, token),
    onSuccess: success,
    onError: error
  })
}

export default useAddTeamMember
