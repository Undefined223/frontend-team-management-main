import React from 'react'
import RoleGuard from '../../components/hoc/RoleGuard';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../components/ui/tabs';
import ProjectsList from '../../components/ui/ProjectsList/ProjectsList';
import UsersList from '../../components/ui/UsersList/UsersList';
import { PROJECT_MANAGER } from '../../lib/constants';

const Home = () => {
  return (
    <Tabs defaultValue="projects">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <RoleGuard roles={[PROJECT_MANAGER]}>
              <TabsTrigger value="users">Users</TabsTrigger>
            </RoleGuard>
        </TabsList>
        <TabsContent value="projects">
            <ProjectsList />
        </TabsContent>
        <RoleGuard roles={[PROJECT_MANAGER]}>
          <TabsContent value="users">
              <UsersList />
          </TabsContent>
        </RoleGuard>
    </Tabs>
  )
}

export default Home
