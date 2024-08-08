import { User } from '../../../models/User';
import ReactImageFallback from 'react-image-fallback';
import { fallbackProfileIcon } from '../../../common/icon';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import axios from '../../../http/axios';
import { AxiosError } from 'axios';


type UserCardProps = {
  user: User;
  setUserHandler: (_id: String) => void;
};

 const deleteUserHandler = async (_id: String, setUserHandler: (_id: String) => void) => {
    try {
        const response = await axios.delete('user', { data: { _id } });
        console.log("response ", response)
        setUserHandler(_id || '');
    } catch (err) {
        const error = err as AxiosError;
        const { message } = error.response?.data as { message: string };
        console.log('error ' , message)
    }
}

export default function UserCard({ user, setUserHandler }: UserCardProps) {
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div>
        <ReactImageFallback
          src={user.image}
          alt="Profile Picture"
          fallbackImage={fallbackProfileIcon}
          className="relative h-14 w-14 rounded-full"
        />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {user.firstName} {user.lastName}
          </h4>
          <p className="text-sm font-medium">
            Role : {user.roles?.map((role) => role.roleName).join(', ')}
          </p>
          <p className="text-sm font-medium">
            Status : {user.status == 'A' ? 'Active' : 'Inactive'}
          </p>
        </div>
        <div className="flex justify-end gap-4.5">
          <BsFillTrashFill className="delete-btn cursor-pointer" onClick={() => {deleteUserHandler(user._id.toString(), setUserHandler)}}/>
          {user.status == 'A' && (
            <NavLink
              to={{ pathname: '/editUser' }}
              state={{ isAddUser: false, user: user }}
            >
              <BsFillPencilFill className="edit-btn cursor-pointer" />
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}
