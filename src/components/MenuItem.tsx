import { NavLink } from "react-router-dom";
import { icons } from '../common/icon';

type MenuItemProps = {
    path: string;
    title: string;
    pathName: string;
}
export default function MenuItem({path, title, pathName} : MenuItemProps) {
    return (
        <NavLink
            to={path}
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathName === path &&
                'bg-graydark dark:bg-meta-4'
                }`}
        >
            {icons.find(icon => icon.key.toString() === path)?.value}
            {title}
        </NavLink>
    )
}
