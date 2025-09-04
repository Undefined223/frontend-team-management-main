import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom'
import { getProjectById } from '../../lib/http/projects.http';
import useUserInfo from '../../hooks/useUserInfo';
import { TooltipProvider, TooltipContent, TooltipTrigger, Tooltip } from "../../components/ui/tooltip";
import { 
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "../../components/ui/sheet";
import { 
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
    DialogFooter,
} from "../../components/ui/dialog";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Eye, PenSquare, Delete, Trash } from 'lucide-react';
import NonProjectManagerWrapper from '../../components/hoc/NonProjectManagerWrapper';
import ProjectManagerWrapper from '../../components/hoc/ProjectManagerWrapper';
import useDeleteProjectMutation from '../../hooks/useDeleteProject'
import useDeleteTeamMemberMutation from '../../hooks/useDeleteTeamMember'
import { toast } from 'sonner';
import AddUserToProject from '../../components/ui/AddUserToProject/AddUserToProject';
import ProjectKanban from '../../components/ui/ProjectKanban/ProjectKanban';
const Dashboard = () => {
	const errorDisplay = (err) => toast.error(err?.response?.data?.message || 'Something went wrong');
  //utilities
	const { projectId } = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	//user related
    const { token } = useUserInfo();

	//query related
	const { isSuccess, data, isLoading } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => getProjectById(projectId, token)
    });
	
	const projectDeletionMutation = useDeleteProjectMutation(
		projectId,
		(data) => navigate('/'),
		errorDisplay
	);

	const teamMemberDeletionMutation = useDeleteTeamMemberMutation(
		projectId,
		(data) => {
			toast.success(data);
			queryClient.invalidateQueries({ queryKey: ['project', projectId] });
            queryClient.invalidateQueries({ queryKey: ['fetchUser', projectId] });
		},
		errorDisplay
	);

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  if (isLoading) return (
    <h1>Loading</h1>
  )
  return isSuccess ? (
    <div className='space-y-8 h-max flex-1 flex flex-col'>
        <div className='w-full flex items-end justify-between gap-x-2'>
            <h1 className='text-2xl/[normal] '>{data?.name}</h1>
            <div className='flex items-end gap-x-2'>
                <Sheet>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <SheetTrigger>
                                    <>
                                        <ProjectManagerWrapper>
                                            <PenSquare className='cursor-pointer' />
                                        </ProjectManagerWrapper>
                                        <NonProjectManagerWrapper>
                                            <Eye className='cursor-pointer' />
                                        </NonProjectManagerWrapper>
                                    </>
                                </SheetTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <>
                                    <ProjectManagerWrapper>
                                        <p>Edit the project</p>
                                    </ProjectManagerWrapper>
                                    <NonProjectManagerWrapper>
                                        <p>View the project's details</p>
                                    </NonProjectManagerWrapper>
                                </>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <SheetContent className="flex flex-col gap-y-0" side="left">
                        <SheetHeader>
                            <SheetTitle>Project's information</SheetTitle>
                            <SheetDescription>
                                This section contains info about the list of memebers name and descritpion of the projects.
                            </SheetDescription>
                        </SheetHeader>
                        <NonProjectManagerWrapper>
                            <div className='flex-1 space-y-6 p-6'>
                                <h1 className='text-3xl hover:underline cursor-pointer'>{data?.name}</h1>
                                <ScrollArea className="w-full border p-3 h-72 rounded-md">
                                    {data?.description}
                                </ScrollArea>
                                <ScrollArea className="w-full h-72 border flex-1 p-3 rounded-md">
                                    <div className="space-y-4 py-5">
                                        {data?.teamMembers?.map(member => (
                                            <>
                                                <div key={member?._id} className="flex items-center gap-x-5 hover:bg-secondary">
                                                    <Avatar>
                                                        <AvatarFallback>{member.name[0] || "PM"}</AvatarFallback>
                                                    </Avatar>
                                                    <p>{member?.name}</p>
                                                </div>
                                                <Separator />
                                            </>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </NonProjectManagerWrapper>
                        <ProjectManagerWrapper>
                            <div className='flex-1 space-y-6 p-6'>
                                <h1>Project info</h1>
                                <h1 className='text-3xl hover:underline cursor-pointer'>{data?.name}</h1>
                                <ScrollArea className="w-full border p-3 h-40 rounded-md">
                                    {data?.description}
                                </ScrollArea>
                                <Separator></Separator>
                                <h1>Team members</h1>
                                <ScrollArea className="w-full h-60 border flex-1 p-3 rounded-md">
                                        <div className="space-y-4 py-5">
                                                {data?.teamMembers?.map(member => (
                                                        <>
                                                                <div className="flex items-center justify-between">
                                                                        <div className="flex-1 flex items-center gap-x-5 hover:bg-secondary">
                                                                                <Avatar>
                                                                                        <AvatarFallback>{member.name[0] || "PM"}</AvatarFallback>
                                                                                </Avatar>
                                                                                <p>{member?.name}</p>
                                                                        </div>
                                                                        <Button onClick={() => teamMemberDeletionMutation.mutate(member?._id)}>
                                                                                <Trash />
                                                                        </Button>
                                                                </div>
                                                                <Separator />
                                                        </>
                                                ))}
                                        </div>
                                </ScrollArea>
                                <AddUserToProject projectId={projectId} />
                            </div>
                        </ProjectManagerWrapper>
                    </SheetContent>
                </Sheet>
                <ProjectManagerWrapper>
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DialogTrigger>
                                        <Delete className='cursor-pointer'/>
                                    </DialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete project</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <DialogContent className="p-8 space-y-8">
                            <DialogHeader>
                                <DialogTitle>
                                    Are you sure you want to delete this project?
                                </DialogTitle>
                                <DialogDescription>
                                    By continuing you will delete this project along side all of it's tasks
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="m-0 gap-x-2">
                                <Button
																	onClick={projectDeletionMutation.mutate}
																	className="cursor-pointer"
																>Continue</Button>
                                <Button
																	className="cursor-pointer"
																	onClick={() => setIsDeleteDialogOpen(false)}
																	variant="secondary"
																>Cancel</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </ProjectManagerWrapper>
            </div>
        </div>
        <ProjectKanban project={data} />
    </div>
  ): (
    <h1>Something went wrong</h1>
  )
}

export default Dashboard
