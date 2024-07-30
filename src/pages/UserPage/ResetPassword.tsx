import React, { useRef, useState } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from '../../http/axios';
import Loader from '../../common/loader';
import { AxiosError } from 'axios';

export default function ResetPassword() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<String>('');
    const token = searchParams.get('token');
    const passwordInput = useRef<HTMLInputElement>(null);
    const confirmPasswordInput = useRef<HTMLInputElement>(null);

    async function setPassword(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        const password = passwordInput.current!.value;
        const confirmPassword = confirmPasswordInput.current!.value;
        if (password.length < 10) {
            setPasswordError(true);
            setErrorMessage("Passowrd length should be at least 10 character");
            return;
        } else {
            setPasswordError(false);
        }
        if (confirmPassword !== password) {
            setPasswordError(true);
            setErrorMessage("Passowrd does not match");
            return;
        } else {
            setPasswordError(false);
        }
        if (!passwordError){
            console.log("Passed")
            try {
                const response = await axios.post('user/resetPassword', JSON.stringify({token: token, password : password, confirmPassword: confirmPassword}) );
                console.log("response " ,response)
                navigate('/');
            } catch (err) {
                const error = err as AxiosError;
                const { message } = error.response?.data as { message: string };
                console.log('Error message ', message)
            }
        }
        
    }

    return (
        <>
            {false && <Loader />}
            <div className="flex items-center justify-between mb-3">
                <span className="text-title-md2 font-semibold text-black dark:text-white">Set Password</span>
            </div>
            <form onSubmit={setPassword}>
                <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                        <div className="mt-4">
                            <div className="flex flex-col gap-9">
                                {/* <!-- Contact Form --> */}
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                id="password"
                                                placeholder="Enter your password"
                                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                ref={passwordInput}
                                                required
                                            />
                                        </div>
                                        {passwordError && <p className="text-[#CD5D5D]">{errorMessage}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                placeholder="Enter your password again"
                                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                ref={confirmPasswordInput}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <input
                                            type="submit"
                                            value="Save"
                                            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};