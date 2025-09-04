import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getProjects } from '../../../lib/http/projects.http';
import useUserInfo from '../../../hooks/useUserInfo'
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
  CardFooter
} from '../card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';
import AvatarGroup from '../avatar-group';
import { PROJECT_MANAGER } from '../../../lib/constants';
import RoleGuard from '../../hoc/RoleGuard';
import { PlusCircle } from 'lucide-react';
import ProjectForm from '../ProjectForm/ProjectForm';
import { toast } from 'sonner'

const ProjectsList = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { token } = useUserInfo();

  const { isSuccess, data } = useQuery({
    queryKey: ['projectsList'],
    queryFn: () => getProjects(token)
  })

  const onSuccess = (data) => {
    setOpen(false)
    toast.success(data || "Project Added successfully");
    queryClient.invalidateQueries({queryKey: ['projectsList']})
  }
  const onError = (err) => {
    toast.error(err?.response?.data?.message || 'Something went wrong');
  }

  const redirectToDashboard = (id) => navigate(`/dashboard/${id}`)
  
  return isSuccess ? (
    <div className='grid grid-cols-12 gap-2 mt-5'>
      {data?.map(project => (
        <Card key={project._id} className='col-span-3 gap-y-2 cursor-pointer hover:bg-secondary' onClick={() => redirectToDashboard(project._id)}>
          <CardHeader>
            <CardTitle className="text-xl">{project?.name}</CardTitle>
          </CardHeader>
          <CardContent className="leading-6 h-[calc(3*1.5rem)]">
            <CardDescription className="line-clamp-3">
              {project?.description}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex justify-end sticky bottom-0">
            <AvatarGroup users={(project?.teamMembers || []).map(member => member?.name) || []} />
          </CardFooter>
        </Card>
      ))}
      <RoleGuard roles={[PROJECT_MANAGER]}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Card className='col-span-3 hover:bg-secondary hover:text-card-foreground cursor-pointer' onClick={() => {}}>
              <CardContent className="flex-1 flex items-center justify-center">
                <CardTitle className="flex items-center gap-x-3">
                  <PlusCircle />
                  <span>Add</span>
                </CardTitle>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-6xl">
            <DialogHeader>
              <DialogTitle>Add new project</DialogTitle>
              <DialogDescription>
                Through this form create a new project
              </DialogDescription>
            </DialogHeader>
            <ProjectForm onSuccess={onSuccess} onError={onError} />
          </DialogContent>
        </Dialog>
      </RoleGuard>
    </div>
  ) : (
    <h1>Domething went wrong</h1>
  )
}

export default ProjectsList
