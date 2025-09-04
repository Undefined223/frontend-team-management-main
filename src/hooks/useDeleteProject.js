import React from 'react'
import { deleteProjectById } from '../lib/http/projects.http'
import { useMutation } from '@tanstack/react-query'
import useUserInfo from './useUserInfo'

const useDeleteProject = (id, success, error) => {
  const { token } = useUserInfo();
  return useMutation({
    mutationFn: () => deleteProjectById(id, token),
    onSuccess: success,
    onError: error
  })
}

export default useDeleteProject
