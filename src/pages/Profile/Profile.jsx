import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import UserForm from '../../components/ui/UserForm/UserForm'
import useUserInfo from '../../hooks/useUserInfo'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileModel } from '../../models/Profile.model'
import { updateProfile } from '../../lib/http/authentication.http'

const Profile = () => {
  const queryClient = useQueryClient();
  const { token, userInfo } = useUserInfo();
  const mutation = useMutation({
    mutationFn: (payload) => updateProfile(payload, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success(data)
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  });
  const [defaultValues, setDefaultValues] = useState({
    name:  '',
    email: '',
    role:  '',
    password: '',
    currentPassword: '',
    confirmPassword: ''
  });
  useEffect(() => {
    setDefaultValues(() => ({
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      role: userInfo?.role || '',
      password: '',
      currentPassword: '',
      confirmPassword: ''
    }));
  }, [userInfo]);
  return (
    <section className='my-5 space-y-12'>
      <h1 className='text-3xl text-center'>Welcome to your profile page</h1>
      <UserForm
        className="w-full max-w-xl m-auto"
        isUpdate={true}
        model={profileModel}
        defaultValues={defaultValues}
        onSubmit={mutation.mutate}
      />
    </section>
  )
}

export default Profile
