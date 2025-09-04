import React from 'react'
import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { format } from "date-fns"
import { zodResolver } from '@hookform/resolvers/zod';
import { projectModel } from '../../../models/Project.model'
import { cn } from '../../../lib/utils';
import { useMutation } from '@tanstack/react-query'

import { Input } from '../input'
import { Textarea } from '../textarea'
import { Button } from '../button'
import { Calendar } from "../calendar"
import {
  Card,
  CardContent,
} from '../card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../popover"
import { createProject } from '../../../lib/http/projects.http';
import useUserInfo from '../../../hooks/useUserInfo';

const ProjectForm = ({ onSuccess, onError }) => {
  const { token } = useUserInfo();
  const form = useForm({
    resolver: zodResolver(projectModel),
    defaultValues: {
      name: '',
      description: '',
      deadline: '',
    }
  });

  const mutation = useMutation({
    mutationFn: (val) => createProject(val, token),
    onSuccess,
    onError
  })
  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8 relative" onSubmit={form.handleSubmit(mutation.mutate)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>
                  <FormControl>
                    <Input placeholder="Project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project description</FormLabel>
                  <FormControl>
                    <Textarea resize="none" className="h-40" placeholder="Project description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline</FormLabel>
                  <Popover className="!w-full">
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a due date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="!w-full p-0" align="center">
                      <Calendar
                        mode="single"
                        className={"!w-full"}
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date <= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              size="lg"
              variant="secondary"
              type="submit"
              disabled={!form.formState.isDirty}
            >
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ProjectForm

