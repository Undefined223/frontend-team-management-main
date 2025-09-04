import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { createTask } from '../lib/http/tasks.http'
import useUserInfo from './useUserInfo'

const useCreateTask = (id, success, error) => {
    const { token } = useUserInfo();
    return useMutation({
        mutationFn: (payload) => createTask(payload, id, token),
        onSuccess: success,
        onError: error
    })
}

export default useCreateTask
