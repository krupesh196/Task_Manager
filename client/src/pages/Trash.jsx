
import { Button } from "@headlessui/react";
import clsx from "clsx";
import React, { useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore
} from 'react-icons/md';
import Title from "../components/Title";
import { tasks } from "../assets/data";
import { PRIORITYSTYLES, TASK_TYPE } from "../utils";
import AddUser from "../components/AddUser";
import ConfirmatioDialog from "../components/Dialogs";
import { useDeleteRestoreTastMutation, useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import Loading from "../components/Loader";
import { toast } from "sonner";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {

  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");

  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: "",
    isTrashed: "true",
    search: "",
  });

  const [deleteRestoreTask] = useDeleteRestoreTastMutation();

  const deleteRestoreHandler = async () => {
    try {
      let result;

      if (type === "deleteAll" || type === "restoreAll") {
        const trashedTasks = data?.tasks || [];
        for (const task of trashedTasks) {
          result = await deleteRestoreTask({
            id: task._id,
            actionType: type === "deleteAll" ? "delete" : "restore",
          }).unwrap();
        }
      } else {
        result = await deleteRestoreTask({
          id: selected,
          actionType: type,
        }).unwrap();
      }

      toast.success(result?.message);

      setTimeout(() => {
        setOpenDialog(false);
        refetch();
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  }

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permenantly delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setSelected(id);
    setType("restore");
    setMsg("Do you want to restore the selected item?");
    setOpenDialog(true);
  };

  if (isLoading)
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black  text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Stage</th>
        <th className='py-2 line-clamp-1'>Modified On</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[item.stage])}
          />
          <p className='w-full line-clamp-2 text-base text-black'>
            {item?.title}
          </p>
        </div>
      </td>

      <td className='py-2 capitalize'>
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIORITYSTYLES[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span className=''>{item?.priority}</span>
        </div>
      </td>

      <td className='py-2 capitalize text-center md:text-start'>
        {item?.stage}
      </td>
      <td className='py-2 text-sm'>{new Date(item?.date).toDateString()}</td>

      <td className='py-2 flex gap-1 justify-end'>
        <Button
          className="p-2 rounded-md hover:bg-gray-100 transition"
          onClick={() => restoreClick(item._id)}
        >
          <MdOutlineRestore className="text-xl text-gray-500" />
        </Button>

        <Button
          className="p-2 rounded-md hover:bg-gray-100 transition"
          onClick={() => deleteClick(item._id)}
        >
          <MdDelete className="text-xl text-red-600" />
        </Button>

      </td>
    </tr>
  );

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Trashed Tasks' />

          <div className='flex gap-2 md:gap-4 items-center'>
            <Button
              className="flex items-center gap-2 text-black text-sm md:text-base rounded-md 2xl:py-2.5"
              onClick={() => restoreAllClick()}
            >
              <MdOutlineRestore className="text-lg hidden md:inline" />
              Restore All
            </Button>

            <Button
              className="flex items-center gap-2 text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5"
              onClick={() => deleteAllClick()}
            >
              <MdDelete className="text-lg hidden md:inline" />
              Delete All
            </Button>

          </div>
        </div>
        <div className='bg-white px-2 md:px-6 py-4 shadow-md rounded'>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {data?.tasks?.map((tk, id) => (
                  <TableRow key={id} item={tk} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* <AddUser open={open} setOpen={setOpen} /> */}

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={() => deleteRestoreHandler()}
      />
    </>
  );
};

export default Trash