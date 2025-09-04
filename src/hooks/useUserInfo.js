import React, {useState, useEffect} from 'react';
import { getCurrentUser } from '../lib/http/authentication.http'
import { useQuery } from '@tanstack/react-query';

const useUserInfo = () => {
    const [token, setToken] = useState(() => localStorage.getItem('token'))
    
    const [userInfo, setUserInfo] = useState(null);
    
    const updateToken = (tkn) => {
        setToken(tkn);
        window.localStorage.setItem('token', tkn);
    }

    const updateUserInfo = (usr) => {
        setUserInfo(usr);
        localStorage.setItem('userInfo', usr ? JSON.stringify(usr) : '');
    }

    const { data, isError, isSuccess } = useQuery({
        queryKey: ['currentUser', token],
        queryFn: () => getCurrentUser(token),
        staleTime: 1000 * 60 * 5
    });

    useEffect(() => {
        if (isError) {
            updateToken('');
            updateUserInfo(null);
        }

        if (isSuccess && data) {
            updateUserInfo(data || null);
        }
    }, [isError, isSuccess, data]);

    return { token, userInfo, updateToken, updateUserInfo }
}

export default useUserInfo;
