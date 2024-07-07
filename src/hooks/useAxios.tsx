import axios from "../http/axios";
import { useEffect, useContext } from "react";
import useRefreshToken from "./useRefreshToken";
import { AuthContext } from '../context/AuthContext';

function useAxios(){
    const refresh = useRefreshToken();
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {

        const requestIntercept = axios.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axios.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axios(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return function() {
            axios.interceptors.request.eject(requestIntercept);
            axios.interceptors.response.eject(responseIntercept);
        }
    }, [accessToken, refresh])

    return axios;
}

export default useAxios;