import { useMutation } from '@tanstack/react-query';
import { updateTaskAssignee } from '../lib/http/tasks.http';
import useUserInfo from './useUserInfo';

const useUpdateTaskAssignee = (projectId, taskId, success, error) => {
  const { token } = useUserInfo();
  return useMutation({
    mutationFn: (payload) => updateTaskAssignee(payload, projectId, token, taskId),
    onSuccess: success,
    onError: error
  });
};

export default useUpdateTaskAssignee;