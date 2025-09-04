import React, { useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select"
import { 
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
    DialogFooter,
} from "../dialog";
import { Button } from "../button";
import { PlusCircle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers } from '../../../lib/http/users.http'
import useUserInfo from '../../../hooks/useUserInfo';
import useAddTeamMember from '../../../hooks/useAddTeamMember';
import { toast } from 'sonner';


const AddUserToProject = ({ projectId }) => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState('');
  const { token } = useUserInfo();
  const { isLoading, data } = useQuery({
    queryKey: ['fetchUser', projectId],
    queryFn: () => getUsers(token, projectId)
  });
  const mutation = useAddTeamMember(
    projectId,
    (data) => {
        queryClient.invalidateQueries({ queryKey: ['fetchUser', projectId] })
        queryClient.invalidateQueries({ queryKey: ['project', projectId] })
        setSelectedUser('')
        toast.success(data)
    },
    (err) => toast.error(err?.response?.data?.message || 'Something went wrong')
  );
  return (
    <Dialog onOpenChange={() => setSelectedUser('')}>
        <DialogTrigger asChild>
            <Button className={`w-full ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`} disabled={isLoading}>
                <PlusCircle />
                <span>Add team member</span>
            </Button>
        </DialogTrigger>
        <DialogContent className="p-8 space-y-8">
            <DialogHeader>
                <DialogTitle>Add team member</DialogTitle>
                <DialogDescription>
                    Through this dialog, you can add a new team member.
                </DialogDescription>
            </DialogHeader>
            <div className='flex gap-x-2 items-center'>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                        {data?.map(user => (
                            <SelectItem className="py-4" key={user._id} value={user._id}>
                                {user?.name} ({user?.email})
                            </SelectItem>
                        ))}
                        {(data == null || data.length == 0) && (
                            <div className='w-full h-20 flex items-center justify-center'>
                                <p>No users to add</p>
                            </div>
                        )}
                    </SelectContent>    
                </Select>
                <Button disabled={selectedUser == ''} onClick={() => setSelectedUser('')}>Clear</Button>
            </div>
            <DialogFooter className="m-0 gap-x-2">
                <Button 
                    disabled={selectedUser == ''}
                    className="cursor-pointer"
                    onClick={() => mutation.mutate(selectedUser)}
                >
                    Continue
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default AddUserToProject
