import React from 'react'
import useUserInfo from '../../hooks/useUserInfo';

const RoleGuard = ({ children, roles }) => {
  const { userInfo } = useUserInfo();
  if(userInfo == null) return null;
  if(!roles.includes(userInfo.role)) return null;
  return children;
}

export default RoleGuard
