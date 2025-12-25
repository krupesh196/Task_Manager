import clsx from 'clsx'
import React from 'react'
import { FaTasks, FaTrashAlt, FaUser, FaUserLock, FaUsers } from 'react-icons/fa'
import { IoLogOutOutline } from 'react-icons/io5'
import {
    MdDashboard,
    MdOutlineAddTask,
    MdOutlinePendingActions,
    MdSettings,
    MdTaskAlt,
} from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useLogoutMutation } from '../redux/slices/api/authApiSlice'
import { logout, setOpenSidebar } from '../redux/slices/authSlice'
import AddUser from './AddUser'
import ChangePassword from './ChangePassword'

const linkData = [
    {
        label: 'Dashboard',
        link: 'dashboard',
        icon: <MdDashboard />,
    },
    {
        label: 'Tasks',
        link: 'tasks',
        icon: <FaTasks />,
    },
    {
        label: 'Completed',
        link: 'completed/completed',
        icon: <MdTaskAlt />,
    },
    {
        label: 'In Progress',
        link: 'in-progress/in progress',
        icon: <MdOutlinePendingActions />,
    },
    {
        label: 'To Do',
        link: 'todo/todo',
        icon: <MdOutlinePendingActions />,
    },
    {
        label: 'Team',
        link: 'team',
        icon: <FaUsers />,
    }, {
        label: 'Trash',
        link: 'trashed',
        icon: <FaTrashAlt />,
    },
]

const Sidebar = () => {

    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch()
    const location = useLocation()

    const path = location.pathname.split('/')[1]

    const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

    const closeSidebar = () => {
        dispatch(setOpenSidebar(false))
    }

    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);
    const [addUserOpen, setAddUserOpen] = React.useState(false);

    const toggleSettings = () => {
        setSettingsOpen((prev) => !prev);
    };

    const [logoutUser] = useLogoutMutation();

                        const handleLogout = async () => {
                try {
                        await logoutUser().unwrap();
                        dispatch(logout());
                        closeSidebar();
    } catch {
        toast.error("Something went wrong");
    }
        };

    const NavLink = ({ el }) => {
        return (
            <Link to={el.link}
                onClick={closeSidebar}
                className={clsx("w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]", path === el.link.split('/')[0] ? "bg-blue-700 text-neutral-100" : ""
                )}
            >
                {el.icon}
                <span className='hover:text-[#2564ed]'>
                    {el.label}
                </span>
            </Link>
        )
    }

    return (
        <div className='w-full h-full flex flex-col gap-6 p-5'>
            <h1 className='flex gap-1 items-center'>
                <p className='bg-blue-600 p-2 rounded-full'>
                    <MdOutlineAddTask className='text-white text-2xl font-black' />
                </p>
                <span className='text-2xl font-bold text-black'>
                    TaskMe
                </span>
            </h1>

            <div className='flex-1 flex flex-col gap-y-5 py-8'>
                {
                    sidebarLinks.map((link) => (
                        <NavLink el={link} key={link.label} />
                    ))
                }
            </div>

            <div className='relative'>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleSettings();
                    }}
                    className='w-full flex gap-2 p-2 items-center text-lg text-gray-800'
                >
                    <MdSettings />
                    <span>Settings</span>
                </button>
                {settingsOpen && (
                    <div className='absolute right-0 bottom-full mb-1 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none z-50'>
                        <div className='p-4 flex flex-col space-y-2'>
                            <button
                                onClick={() => {
                                    setSettingsOpen(false);
                                    closeSidebar();
                                    setAddUserOpen(true);
                                }}
                                className='text-gray-700 hover:text-blue-600 flex items-center gap-2 text-left px-3 py-2 rounded-md'
                            >
                                <FaUser className='mr-2' />
                                Profile
                            </button>
                            <button
                                onClick={() => {
                                    setChangePasswordOpen(true);
                                    setSettingsOpen(false);
                                }}
                                className='text-gray-700 hover:text-blue-600 flex items-center gap-2 text-left px-3 py-2 rounded-md'
                            >
                                <FaUserLock className='mr-2' />
                                Change Password
                            </button>
                            <button
                                onClick={handleLogout}
                                className='text-red-600 hover:text-red-800 flex items-center gap-2 text-left px-3 py-2 rounded-md'
                            >
                                <IoLogOutOutline className='mr-2' />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ChangePassword open={changePasswordOpen} setOpen={setChangePasswordOpen} />
            <AddUser open={addUserOpen} setOpen={setAddUserOpen} userData={user} />
        </div>
    )
}

export default Sidebar
