import React, { useState } from 'react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { 
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from "../dialog";
import { Button } from "../button";
import useCreateTask from '../../../hooks/useCreateTask'
import { Input } from "../input";
import { Textarea } from "../textarea";
import { PlusCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskModel } from '../../../models/Task.model'
import { toast } from 'sonner';
import StoryPointsInput from '../StoryPointsInput/StoryPointsInput';


const AddTaskToProject = ({ project }) => {
  const { _id: projectId, teamMembers } = project;
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false)
  const mutation = useCreateTask(
    projectId,
    (data) => {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] })
        form.reset();
        setIsOpen(false);
        toast.success(data)
    },
    (err) => toast.error(err?.response?.data?.message || 'Something went wrong')
  );
  const form = useForm({
    resolver: zodResolver(createTaskModel),
    defaultValues: {
        title: '',
        description: '',
        assignedTo: '',
        storyPoints: null
    }
  })
  const closeModal = (state) => {
    form.reset();
    setIsOpen(state);
  }
  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogTrigger asChild>
            <Button className={`w-full`}>
                <PlusCircle />
                <span>Add Task</span>
            </Button>
        </DialogTrigger>
        <DialogContent className="p-8 w-[50%] !max-w-none space-y-8">
            <DialogHeader>
                <DialogTitle>Add Task</DialogTitle>
                <DialogDescription>
                    Through this dialog, you can add a new Task.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form className='space-y-8' onSubmit={form.handleSubmit(mutation.mutate)}>
                    <FormField
                        className="w-full"
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="w-full space-y-4">
                                <FormLabel>Project name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Project name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        className="w-full"
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full space-y-4">
                                <FormLabel>Project description</FormLabel>
                                <FormControl>
                                    <Textarea resize="none" className="h-40" placeholder="Project description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        className="w-full"
                        control={form.control}
                        name="storyPoints"
                        render={({ field }) => (
                            <FormItem className="w-full  space-y-0">
                                <FormLabel className="w-max">Story points</FormLabel>
                                    <FormControl>
                                        <StoryPointsInput value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        className="w-full"
                        control={form.control}
                        name="assignedTo"
                        render={({ field }) => (
                            <FormItem className="w-full  space-y-4">
                                <FormLabel className="w-max">Assigned to</FormLabel>
                                <Select className="w-full" onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Assigned To" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {teamMembers?.map(user => (
                                            <SelectItem className="py-4" key={user._id} value={user._id}>
                                                {user?.name} ({user?.email})
                                            </SelectItem>
                                        ))}
                                        {(teamMembers == null || teamMembers.length == 0) && (
                                            <div className='w-full h-20 flex items-center justify-center'>
                                                <p>No users to add</p>
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* <div className="w-full flex items-stretch gap-x-8 justify-center">
                        <div className='flex-1 space-y-8'>
                            
                        </div>
                        <div className='w-[20%] space-y-8 flex flex-col justify-center'>
                            
                        </div>
                    </div> */}
                    <Button
                        type="submit"
                        className="w-full"
                    >Save</Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default AddTaskToProject

