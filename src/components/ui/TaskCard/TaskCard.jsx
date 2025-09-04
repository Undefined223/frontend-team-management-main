import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
    CardDescription,
    CardFooter
} from '../card';
import {
    TooltipProvider,
    TooltipContent,
    TooltipTrigger,
    Tooltip
} from "../tooltip";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from "../dialog";

import { Avatar, AvatarFallback } from '../avatar'
import NonProjectManagerWrapper from '../../hoc/NonProjectManagerWrapper';
import ProjectManagerWrapper from '../../hoc/ProjectManagerWrapper';
import useUpdateTaskAssignee from '../../../hooks/useUpdateTaskAssignee';
import useUpdateTaskGeneral from '../../../hooks/useUpdateTaskGeneral';

const TaskCard = ({ project, task, ...props }) => {
    console.log("project", project)
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [storyPoints, setStoryPoints] = useState(task?.storyPoints || 0);

    const [assigneeId, setAssigneeId] = useState(task?.assignedTo?._id || '');

    const updateGeneral = useUpdateTaskGeneral(
        project?._id,
        task?._id,
        () => console.log('General info updated!'),
        (error) => console.error('Update failed:', error)
    );

    const updateAssignee = useUpdateTaskAssignee(
        project?._id,
        task?._id,
        () => console.log('Assignee updated!'),
        (error) => console.error('Assignee update failed:', error)
    );

    const handleGeneralSubmit = (e) => {
        e.preventDefault();
        updateGeneral.mutate({ title, description, storyPoints });
    };

    const handleAssigneeSubmit = (e) => {
        e.preventDefault();
        updateAssignee.mutate({ assignedTo: assigneeId });
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="cursor-pointer" {...props}>
                    <CardHeader>
                        <CardTitle>{task?.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="leading-6 h-[calc(1*1.5rem)]">
                        <CardDescription className="line-clamp-1">
                            {task?.description}
                        </CardDescription>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-x-2 sticky bottom-0">
                        <div className='border flex items-center justify-center w-9 h-9'>
                            <span>
                                {task?.storyPoints}
                            </span>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Avatar>
                                        <AvatarFallback>
                                            {task?.assignedTo?.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{task?.assignedTo?.name}</p>
                                    <p>{task?.assignedTo?.email}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardFooter>
                </Card>
            </DialogTrigger>
            <DialogContent>
                <NonProjectManagerWrapper>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Task Details</DialogTitle>
                        <DialogDescription className="mt-2">
                            View task information and current status
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">General Information</h3>
                            <div className="grid gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Title</p>
                                    <p className="text-base mt-1">{task?.title || '-'}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                                    <p className="text-base mt-1 whitespace-pre-line">
                                        {task?.description || 'No description provided'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Story Points
                                    </p>
                                    <div className="inline-flex items-center justify-center rounded-full bg-accent px-3 py-1 text-sm mt-1">
                                        {task?.storyPoints || '0'} points
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Assignment</h3>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback className="text-lg">
                                        {task?.assignedTo?.name[0] || '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                                    <p className="text-base mt-1">
                                        {task?.assignedTo?.name || 'Unassigned'}
                                    </p>
                                    {task?.assignedTo?.email && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {task?.assignedTo?.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Workflow</h3>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground mt-1">
                                    <div className="h-2 w-2 rounded-full bg-current" />
                                    <span className="text-sm capitalize">{task?.status || 'unknown'}</span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Contact your project manager to request changes to this task
                            </p>
                        </div>
                    </div>
                </NonProjectManagerWrapper>
                <ProjectManagerWrapper>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Edit Task Details</DialogTitle>
                        <DialogDescription className="mt-2">
                            Update task information and manage assignments
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        {/* General Information Form */}
                        <form onSubmit={handleGeneralSubmit} className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">General Information</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Title</label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="3"
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Story Points</label>
                                    <select
                                        value={storyPoints}
                                        onChange={(e) => setStoryPoints(Number(e.target.value))}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        {[1, 2, 3, 5, 8, 13].map((points) => (
                                            <option key={points} value={points}>
                                                {points} points
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                disabled={updateGeneral.isPending}
                            >
                                {updateGeneral.isPending ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Saving...
                                    </span>
                                ) : 'Save General Info'}
                            </button>
                        </form>

                        {/* Assignment Form */}
                        <form onSubmit={handleAssigneeSubmit} className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Assignment</h3>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback className="text-lg">
                                        {project?.teamMembers?.find(m => m._id === assigneeId)?.name[0] || '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium leading-none">Assign To</label>
                                    <select
                                        value={assigneeId}
                                        onChange={(e) => setAssigneeId(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option value="">Unassign</option>
                                        {project?.teamMembers?.map((member) => (
                                            <option key={member._id} value={member._id}>
                                                {member.name} ({member.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                disabled={updateAssignee.isPending}
                            >
                                {updateAssignee.isPending ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Updating...
                                    </span>
                                ) : 'Update Assignment'}
                            </button>
                        </form>

                        {/* Workflow Display (Read-only) */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Workflow</h3>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Current Status</label>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground">
                                    <div className="h-2 w-2 rounded-full bg-current" />
                                    <span className="text-sm capitalize">{task?.status}</span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Status updates are managed by team members through their workflow actions.
                            </p>
                        </div>
                    </div>
                </ProjectManagerWrapper>
            </DialogContent>
        </Dialog> 
    )
}

export default TaskCard
