import { useMutation } from '@tanstack/react-query';
import { updateTaskGeneral } from '../lib/http/tasks.http';
import useUserInfo from './useUserInfo';

const useUpdateTaskGeneral = (projectId, taskId, success, error) => {
  const { token } = useUserInfo();
  return useMutation({
    mutationFn: (payload) => updateTaskGeneral(payload, projectId, token, taskId),
    onSuccess: success,
    onError: error
  });
};

export default useUpdateTaskGeneral;