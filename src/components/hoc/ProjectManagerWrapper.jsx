import React from 'react'
import RoleGuard from './RoleGuard'
import { PROJECT_MANAGER } from '../../lib/constants';

const ProjectManagerWrapper = ({ children }) => {
  return (
    <RoleGuard roles={[PROJECT_MANAGER]}>
        {children}
    </RoleGuard>
  )
}

export default ProjectManagerWrapper
