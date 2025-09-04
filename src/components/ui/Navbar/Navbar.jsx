import React from 'react'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from '../navigation-menu';
import useUserInfo from '../../../hooks/useUserInfo';
import { useNavigate } from 'react-router-dom';
// import './Navbar.css'

const Navbar = () => {
  const { updateToken, updateUserInfo } = useUserInfo();
  const navigate = useNavigate();
  const logout = () => {
    updateToken('');
    updateUserInfo(null);
    navigate('/')
  }
  return (
    <NavigationMenu viewport={false} className="w-full flex-0 p-5 max-w-none">
        <NavigationMenuList className="w-full !justify-between">
            <div className='flex-1'>
              <NavigationMenuItem className="w-fit">
                  <NavigationMenuLink href="/home">
                      Home
                  </NavigationMenuLink>
              </NavigationMenuItem>
            </div>
            <div className="w-fit flex gap-2">
              <NavigationMenuItem>
                  <NavigationMenuLink href="/profile">
                      Profile
                  </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="cursor-pointer">
                  <NavigationMenuLink onClick={logout}>Log out</NavigationMenuLink>
              </NavigationMenuItem>
            </div>
        </NavigationMenuList>
    </NavigationMenu>
  )
}

export default Navbar
