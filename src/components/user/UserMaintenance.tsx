import { useEffect, useState } from 'react';
//import axios from '../../http/axios';
import { AxiosError } from 'axios';
import { User } from '../../models/User';
import UserCard from './components/UserCard';
import { NavLink } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';

export default function UserMaintenance() {
  const [users, setUsers] = useState<User[]>([]);
  const axiosWithHeader = useAxios();

  async function getUsers() {
    const response = await axiosWithHeader.get('user');
    setUsers(response.data.users);
  }

  function setUserHandler(_id: String) {
    setUsers((prevUsers) => {
      return prevUsers.map((prevUser) => {
        if (prevUser._id.toString() === _id) {
          const user = { ...prevUser };
          user.status = 'D';
          return user;
        } else {
          return prevUser;
        }
      });
    });
  }

  useEffect(() => {
    try {
      getUsers();
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as { message: string };
      console.log("error ", message)
    }
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="text-title-md2 font-semibold text-black dark:text-white">
          User Maintenance
        </span>
        <NavLink
          to={{ pathname: '/editUser' }}
          state={{ isAddUser: true, user: undefined }}
        >
          <span className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            Add
          </span>
        </NavLink>
      </div>
      {users && (users.filter(user => user.status !== 'D').length > 0 )? (
        users.map((user: User, index) => {
          return (
            user.status !== 'D' && (
              <ul key={index}>
                <UserCard user={user} setUserHandler={setUserHandler} />
              </ul>
            )
          );
        })
      ) : (
        <p>No User was found</p>
      )}
    </>
  );
}
