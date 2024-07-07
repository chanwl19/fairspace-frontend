import axios from '../http/axios';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

function useRefreshToken(){

    const { storeAccessToken, loginUser } = useContext(AuthContext);

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        storeAccessToken(response.data.accessToken);
        loginUser(response.data.user);
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;