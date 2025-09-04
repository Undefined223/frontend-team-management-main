import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { ScrollArea } from '../scroll-area'
import useUserInfo from '../../../hooks/useUserInfo'
import { PROJECT_MANAGER } from '../../../lib/constants'
import AddTaskToProject from '../AddTaskToProject/AddTaskToProject'
import TaskCard from '../TaskCard/TaskCard'
import { toast } from 'sonner';
import ProjectManagerWrapper from '../../hoc/ProjectManagerWrapper'

import { updateTaskStatus } from '../../../lib/http/tasks.http';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'

const orderedStatuses = ['to-do', 'in-progress', 'done'];

const ProjectKanban = ({ project }) => {
  const { token, userInfo } = useUserInfo();
  const [tasksMap, setTasksMap] = useState({});
  useEffect(() => {
    if (project?.tasks != null) {
      const tasks = project.tasks;
      const tmp = tasks.reduce((acc, curr) => {
        if (acc[curr?.status] != null) {
          acc[curr.status].push(curr);
        } else {
          acc[curr.status] = [curr];
        }
        return acc;
      }, {});
  
      tmp['to-do'] = tmp['to-do'] || [];
      tmp['in-progress'] = tmp['in-progress'] || [];
      tmp['done'] = tmp['done'] || [];
      setTasksMap(tmp);
    }
  }, [project?.tasks]);

  const queryClient = useQueryClient();
  const updateStatusMutation = useMutation({
    mutationFn: async ({taskId, status}) => updateTaskStatus(project?._id, taskId, status, token),
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['project', project?._id] })
    },
    onError: (err) => {
      queryClient.invalidateQueries({ queryKey: ['project', project?._id] })
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  })

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const sourceCol = tasksMap[source.droppableId];
    const sourceItems = [...sourceCol];
    const [movedItem] = sourceItems.splice(source.index, 1);
    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, movedItem);
      setTasksMap({ ...tasksMap, [source.droppableId]: sourceItems });
    } else {
      updateStatusMutation.mutate({taskId: movedItem?._id, status: destination.droppableId})
    }
  }

  return (
    <div className="flex-1 grid grid-cols-3 gap-4 p-10 w-full max-w-auto">
      <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(tasksMap)
            .filter(e => ['to-do', 'in-progress', 'done'].includes(e[0]))
            .sort(([a], [b]) => orderedStatuses.indexOf(a) - orderedStatuses.indexOf(b))
            .map(([columnId, tasks]) => (
              <Droppable
                isDropDisabled={userInfo?.role == PROJECT_MANAGER}
                isCombineEnabled={false}
                ignoreContainerClipping={false}
                key={columnId}
                droppableId={columnId}
              >
                  {(provided) => (
                  <div
                      className="p-4 border rounded flex flex-col gap-y-4"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                  >
                      <h2 className="text-2xl hover:underline text-center capitalize">
                          {columnId}
                      </h2>
                      <ScrollArea className='h-[500px] rounded border p-6'>
                          {tasks.map((task, index) => (
                              <Draggable
                                isDragDisabled={userInfo?.role == PROJECT_MANAGER}
                                key={task._id}
                                draggableId={task._id}
                                index={index}
                              >
                                  {(provided) => (
                                      <TaskCard
                                      project={project}
                                        task={task}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      />
                                  )}
                              </Draggable>
                          ))}
                      </ScrollArea>
                      {columnId == 'to-do' && (
                        <ProjectManagerWrapper>
                          <AddTaskToProject project={project}/>
                        </ProjectManagerWrapper>
                      )}
                      {provided.placeholder}
                  </div>
                  )}
              </Droppable>
          ))}
      </DragDropContext>
    </div>
  )
}

export default ProjectKanban
