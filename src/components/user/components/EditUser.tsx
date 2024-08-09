import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
//import axios from '../../http/axios';
import { User } from '../../../models/User';
import Loader from '../../../common/loader';
import { Role } from '../../../models/Role';
import { AxiosError } from 'axios';
import useAxios from '../../../hooks/useAxios';
import ErrorAlert from '../../uiElements/ErrorAlert';

export default function EditUser() {

    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state;
    const user: User = state.user;
    const isAddUser: boolean = state.isAddUser;
    const userIdInput = useRef<HTMLInputElement>(null);
    const userFirstNameInput = useRef<HTMLInputElement>(null);
    const userMiddleNameInput = useRef<HTMLInputElement>(null);
    const userLastNameInput = useRef<HTMLInputElement>(null);
    const userEmailInput = useRef<HTMLInputElement>(null);
    const [userIdError, setUserIdError] = useState<boolean>(false);
    const [userEmailError, setUserEmailError] = useState<boolean>(false);
    const [userRoleError, setUserRoleError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMessage] = useState<string>('');
    const [roles, setRoles] = useState<Role[]>([]);
    const axiosWithHeader = useAxios();


    async function getRoles() {
        const response = await axiosWithHeader.get('role');
        setRoles(response.data.roles);
    }

    useEffect(() => {
        try {
            getRoles();
        } catch (err) {
            const error = err as AxiosError;
            const { message } = error.response?.data as { message: string };
            setErrorMessage(message);
        }
    }, []);

    async function saveUser(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage('');
        let isValidInput = true;

        const formData = new FormData(event.target);
        const data = formData.entries();
        const userId = userIdInput.current!.value;
        const roles = new Array<number>();
        const userFirstName = userFirstNameInput.current!.value;
        const userMiddleName = userMiddleNameInput.current!.value;
        const userLastName = userLastNameInput.current!.value;
        const userEmail = userEmailInput.current!.value;
        const userIdRegex = new RegExp("^30\\d{7}$");
        const emailRegex = new RegExp('^[A-Za-z0-9]+@my.centennialcollege.ca$')
        if (!userId || !userIdRegex.test(userId)) {
            console.log("INvalid user id");
            setUserIdError(true);
            isValidInput = false;
        } else {
            setUserIdError(false);
        }
        if (!userEmail || !emailRegex.test(userEmail)) {
            setUserEmailError(true);
            isValidInput = false;
        } else {
            setUserEmailError(false);
        }

        for (const entry of data) {
            if (entry[1]) {
                roles.push(+entry[1]);
            }
        };

        if (!roles || roles.length === 0) {
            isValidInput = false;
            setUserRoleError(true);
        } else {
            setUserRoleError(false);
        }

        if (isValidInput) {
            setIsLoading(true)
            try {
                let response;
                if (isAddUser) {
                    response = await axiosWithHeader.post('user', JSON.stringify({
                        userId, firstName: userFirstName, lastName: userLastName,
                        middleName: userMiddleName, email: userEmail, roleIds: roles
                    }));
                } else {
                    console.log(roles)
                    response = await axiosWithHeader.patch('user', JSON.stringify({
                        _id: user._id, userId, firstName: userFirstName, lastName: userLastName,
                        middleName: userMiddleName, email: userEmail, roleIds: roles
                    }));
                }
                console.log(response);
                setIsLoading(false);
                navigate("/user");
            } catch (err) {
                setIsLoading(false);
                const error = err as AxiosError;
                const { message } = error.response?.data as { message: string };
                setErrorMessage(message);
            }

        }
    }

    return (
        <>
            {isLoading && <Loader />}
            {errorMsg &&
                <ErrorAlert
                    title="Error"
                >
                    <p>{errorMsg}</p>
                </ErrorAlert>
            }
            <div className="flex items-center justify-between mb-3">
                <span className="text-title-md2 font-semibold text-black dark:text-white">User Maintenance</span>
            </div>
            <form onSubmit={saveUser}>
                <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                        <div className="mt-4">
                            <div className="flex flex-col gap-9">
                                {/* <!-- Contact Form --> */}
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

                                    <div className="p-6.5">

                                        <div className="mb-4.5">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                User ID
                                            </label>
                                            <input
                                                type="userid"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                disabled={!isAddUser}
                                                defaultValue={user?.userId}
                                                required
                                                placeholder='Enter user ID'
                                                ref={userIdInput}
                                            />
                                            {userIdError && <p className="text-[#CD5D5D]">User ID is invalid</p>}
                                        </div>

                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    First name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    defaultValue={user?.firstName}
                                                    required
                                                    placeholder='Enter user first name'
                                                    ref={userFirstNameInput}
                                                />
                                            </div>

                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Middle Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    defaultValue={user?.middleName}
                                                    placeholder='Enter user middle name'
                                                    ref={userMiddleNameInput}
                                                />
                                            </div>

                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Last name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                    defaultValue={user?.lastName}
                                                    required
                                                    placeholder='Enter user last name'
                                                    ref={userLastNameInput}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4.5">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                defaultValue={user?.email}
                                                required
                                                placeholder='Enter user email'
                                                ref={userEmailInput}
                                            />
                                            {userEmailError && <p className="text-[#CD5D5D]">User Email is not a valid centennial email</p>}
                                        </div>

                                        <div className="mb-4.5">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Roles
                                            </label>
                                            <div className="flex flex-wrap gap-x-12">
                                                {roles.map(role => {
                                                    return (
                                                        <div key={role.roleId}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                name="roles"
                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                value={role.roleId}
                                                                defaultChecked={(user?.roles?.filter(userRole => userRole.roleId === role.roleId))?.length || 0 > 0 ? true : false}
                                                            />
                                                            <label htmlFor={role.roleId.toString()}>
                                                                {role.roleName}
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {userRoleError && <p className="text-[#CD5D5D]">Please select at least one role</p>}
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
                </div>
            </form>
        </>
    );
};