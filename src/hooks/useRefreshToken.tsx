import axios from '../http/axios';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

function useRefreshToken(){

    const { storeAccessToken, loginUser } = useContext(AuthContext);

    const refreshToken = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        storeAccessToken(response.data.token);
        loginUser(response.data.user);
        return response.data.token;
    }
    return refreshToken;
};

export default useRefreshToken;