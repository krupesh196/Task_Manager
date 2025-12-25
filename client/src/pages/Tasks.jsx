import React, { useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import { Button } from "@headlessui/react";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import { useSelector } from "react-redux";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {

  const params = useParams()
  const { user } = useSelector((state) => state.auth);
  const searchTerm = useSelector((state) => state.search.searchTerm);

  const [selected, setSelected] = useState(0)
  const [open, setOpen] = useState(false)

  const status = params?.status || ""

  const queryParams = {
    strQuery: status || "",
    assignedTo: user?.isAdmin ? undefined : user?._id || "",
  };

  const { data, isLoading, refetch } = useGetAllTaskQuery({
    ...queryParams,
    isTrashed: "",
    search: searchTerm,
  });

  return (
    isLoading ? (
      <div className="py-10">
        <Loading />
      </div>
    ) : (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <Title title={status ? `${status} Tasks` : "Tasks"} />

          {user?.isAdmin && (
            <Button
              onClick={() => setOpen(true)}
              className="flex gap-1 items-center bg-blue-600 text-white rounded-md py-2 px-4 2xl:py-2.5"
            >
              <IoMdAdd className="text-lg" />
              Create Task
            </Button>
          )}
        </div>

        <div>
          <Tabs tabs={TABS} setSelected={setSelected}>
            {!status && (
              <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
                <TaskTitle label="To Do" className={TASK_TYPE.todo} />
                <TaskTitle label="In Progress" className={TASK_TYPE["in progress"]} />
                <TaskTitle label="Completed" className={TASK_TYPE.completed} />
              </div>
            )}

            {
              selected === 0
                ?
                <BoardView tasks={data?.tasks} refetch={refetch} />
                :
                <div className="w-full">
                  <Table tasks={data?.tasks} refetch={refetch} />
                </div>
            }
          </Tabs>

          <AddTask open={open} setOpen={setOpen} />
        </div>
      </div>
    )
  )
};

export default Tasks;
