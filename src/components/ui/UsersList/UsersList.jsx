import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, addUser, deleteUser } from '../../../lib/http/users.http';
import useUserInfo from '../../../hooks/useUserInfo'
import { PlusCircle, Trash } from 'lucide-react'
import { Button } from '../button';
import {
  Table,
  TableHeader,
  TableBody, 
  TableRow,
  TableCell,
  TableHead
} from '../table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';
import UserForm from '../UserForm/UserForm';
import { userModel } from '../../../models/User.model'

import { toast } from 'sonner';

const UsersList = () => {
  const { token } = useUserInfo();
  const [open, setOpen] = useState(false);
  
  const queryClient = useQueryClient();

  const deletionMutation = useMutation({
    mutationFn: (id) => deleteUser(id, token),
    onSuccess : (data) => {
      toast.success(data || "user deeeeeeeleted");
      queryClient.invalidateQueries({queryKey: ['UsersList']})
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  });

  const addingMutation = useMutation({
    mutationFn: (payload) => addUser(payload, token),
    onSuccess : (data) => {
      setOpen(false)
      toast.success(data || "user Added successfully");
      queryClient.invalidateQueries({queryKey: ['UsersList']})
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  });

  const { data, isSuccess } = useQuery({
    queryKey: ['UsersList'],
    queryFn: () => getUsers(token)
  })

  return isSuccess ? (
    <div className='flex-1 flex flex-col gap-y-2'>
      <div className='flex items-center justify-between'>
        <h2>Platform's users</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-6xl">
            <DialogHeader>
              <DialogTitle>Add new profile</DialogTitle>
              <DialogDescription>
                Through this form create a new profile
              </DialogDescription>
            </DialogHeader>
            <UserForm
              className="grid gap-4 py-4"
              isUpdate={false}
              model={userModel}
              onSubmit={addingMutation.mutate}
              defaultValues={{
                name: '',
                email: '',
                role: '',
                password: ''
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table className="flex-1">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(user => (
            <TableRow key={user._id}>
              <TableCell>{user?.name || ""}</TableCell>
              <TableCell>{user?.email || ""}</TableCell>
              <TableCell>{user?.role || ""}</TableCell>
              <TableCell>{user?.createdAt || ""}</TableCell>
              <TableCell>
                <Button onClick={() => deletionMutation.mutate(user._id)} className="bg-destructive">
                  <Trash/>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ) : (
    <h1>Something went wrong</h1>
  )
}

export default UsersList
