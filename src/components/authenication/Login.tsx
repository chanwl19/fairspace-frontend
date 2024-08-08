import Logo from '../../images/logo/fairspace-logo.jpg';
import { User } from '../../models/User';
import { useContext, useState, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../http/axios';
import { AxiosError } from 'axios';
import Loader from '../../common/loader';
import ErrorAlert from '../uiElements/ErrorAlert';
//import { useSearchParams, useNavigate } from "react-router-dom";

export default function Login() {

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const userIdInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  async function loginUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const userId = userIdInput.current!.value;
      const password = passwordInput.current!.value;
      const response = await axios.post('auth/login', JSON.stringify({ userId, password }));
      const user = response.data.user as User;
      authCtx.loginUser(user);
      authCtx.storeAccessToken(response.data.token);
    } catch (err) {
      setLoading(false);
      const error = err as AxiosError;
      const { message } = error.response?.data as { message: string };
      setErrorMsg(message);
    }
    setLoading(false);
  }

  const authCtx = useContext(AuthContext);

  return (
    <>
      {loading && <Loader />}
      {errorMsg &&
        <ErrorAlert
          title="Error"
        >
          <p>{errorMsg}</p>
        </ErrorAlert>
      }
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex flex-row min-h-screen justify-center items-center">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <img className="dark:block" src={Logo} alt="Logo" />
          </div>
          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to Fair Space
              </h2>

              <form onSubmit={loginUser}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    User ID
                  </label>
                  <div className="relative">
                    <input
                      type="User ID"
                      id="userId"
                      placeholder="Enter your user ID"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      ref={userIdInput}
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      placeholder="Please enter your password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      ref={passwordInput}
                      required
                    />
                    <span className="absolute right-4 top-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <g opacity="0.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Sign In"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
