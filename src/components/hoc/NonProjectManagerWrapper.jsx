import React from 'react'
import RoleGuard from './RoleGuard'
import { DESIGNER, DEVELOPER, SECURITY, TESTER } from '../../lib/constants'

const NonProjectManagerWrapper = ({ children }) => {
  return (
    <RoleGuard roles={[DESIGNER, DEVELOPER, SECURITY, TESTER]}>
        {children}
    </RoleGuard>
  )
}

export default NonProjectManagerWrapper
