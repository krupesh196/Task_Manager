import clsx from "clsx";
import moment from "moment";
import React, { useState } from "react";
import { FaBug, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Tabs from "../components/Tabs";
import { getInitials, PRIORITYSTYLES, TASK_TYPE } from "../utils";
import { Button } from "@headlessui/react";
import Loading from "../components/Loader";
import { useGetSingleTaskQuery, usePostTaskActivityMutation } from "../redux/slices/api/taskApiSlice";

// removed unused sample data

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  normal: 'text-green-600',
  low: "bg-blue-200",
};

const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Activities/Timeline", icon: <RxActivityLog /> },
];

const TASKTYPEICON = {
  commented: (
    <div className='w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white'>
      <MdOutlineMessage />,
    </div>
  ),
  started: (
    <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white'>
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className='w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white'>
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className='text-red-600'>
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className='w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white'>
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className='w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white'>
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

const TaskDetails = () => {

  const { id } = useParams()

  const { data, isLoading, refetch } = useGetSingleTaskQuery(id);

  const [selected, setSelected] = useState(0)
  const task = data?.task;

  if (isLoading)
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden">
      <h1 className="text-2xl text-gray-600 font-bold">{task?.title}</h1>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
          <>
            <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-md p-8 overflow-y-auto">

              <div className="w-full md:w-1/2 space-y-8">
                <div className="flex items-center gap-5">
                  <div
                    className={clsx(
                      "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                      PRIORITYSTYLES[task?.priority],
                      bgColor[task?.priority]
                    )}
                  >
                    <span className='text-lg'>{ICONS[task?.priority]}</span>
                    <span className='uppercase'>{task?.priority} Priority</span>
                  </div>

                  <div className={clsx("flex items-center gap-2")}>
                    <div className={clsx(
                      "w-4 h-4 rounded-full",
                      TASK_TYPE[task.stage]
                    )}
                    />
                    <span className="text-black uppercase">{task?.stage}</span>
                  </div>
                </div>

                <p className="text-gray-500">
                  Created At: {new Date(task?.date).toDateString()}
                </p>

                <div className='flex items-center gap-8 p-4 border-y border-gray-200'>

                  <div className='space-x-2'>
                    <span className='font-semibold'>Sub-Task :</span>
                    <span>{task?.subTasks?.length}</span>
                  </div>
                </div>

                <div className="space-y-4 py-6">
                  <p className="text-gray-600 font-semibold text-sm">
                    TASK TEAM
                  </p>
                  <div className="space-y-3">
                    {
                      task?.team?.map((m, index) => (
                        <div
                          key={index}
                          className="flex gap-4 items-center border-t border-gray-200"
                        >
                          <div
                            className={
                              "w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 mt-2 bg-blue-600"
                            }
                          >
                            <span className="text-center">
                              {getInitials(m?.name)}
                            </span>
                          </div>

                          <div className="mt-2">
                            <p className="text-lg font-semibold">{m?.name}</p>
                            <span className="text-gray-500">{m?.title}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="space-y-4 py-6">
                  <p className="text-gray-500 font-semibold text-sm">
                    SUB-TASKS
                  </p>
                  <div className="space-y-8">
                    {task?.subTasks?.map((el, index) => (
                      <div
                        key={index}
                        className="flex gap-3"
                      >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-200">
                          <MdTaskAlt className="text-violet-600" size={26} />
                        </div>

                        <div className="space-y-1">
                          <div className="flex gap-2 items-center">
                            <span className="text-sm text-gray-500">
                              {new Date(el?.date).toDateString()}
                            </span>

                            <span className="px-2 py-0.5 text-center text-sm rounded-full bg-violet-100 text-violet-700 font-semibold">
                              {el?.tag}
                            </span>
                          </div>

                          <p className="text-gray-700">
                            {el?.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </>
        ) : (
          <>
            <Activities activity={data?.task?.activities} id={id} refetch={refetch} />
          </>
        )}
      </Tabs>
    </div>
  )
}

const Activities = ({ activity, id, refetch }) => {

  const [selected, setSelected] = useState(act_types[0])
  const [text, setText] = useState("")

  const [postActivity, { isLoading }] = usePostTaskActivityMutation();

  const handleSubmit = async () => {
    try {
      const activityData = {
        type: selected?.toLowerCase(),
        activity: text,
      }
      const result = await postActivity({
        data: activityData,
        id
      }).unwrap();

      setText("");
      toast.success(result?.message);
      refetch();

    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error)
    }
  }

  const Card = ({ item, isLast, nextItem }) => {
    const isCompleted = item?.type === 'completed';
    const nextIsCompleted = nextItem?.type === 'completed';

    const showLine = !isLast && !isCompleted && !nextIsCompleted;

    return (
      <div className="flex space-x-4 relative">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-10 h-10 flex items-center justify-center z-10 relative bg-white">
            {TASKTYPEICON[item?.type]}
          </div>
          {showLine && (
            <div className="w-0.5 bg-gray-300 flex-1" />
          )}
        </div>

        <div className="flex flex-col gap-y-1 mb-8">
          <p className="font-semibold">{item?.by?.name}</p>
          <div className="text-gray-500 space-y-2">
            <span className="capitalize">{item?.type}</span>
            <span className="text-sm">&nbsp;{moment(item?.date).fromNow()}</span>
          </div>
          <div className="text-gray-700">{item?.activity}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex gap-10 2xl:gap-20 min-h-screen px-10 py-8 bg-white shadow rounded-md justify-between overflow-y-auto">
      <div className="w-full md:w-1/2">
        <h4 className="text-gray-600 font-semibold text-lg mb-5">Activities</h4>

        <div className="w-full">
          {activity?.map((el, index) => (
            <Card
              key={index}
              item={el}
              isConnected={index < activity?.length - 1}
            />
          ))}
        </div>
      </div>

      <div className='w-full md:w-1/3'>
        <h4 className='text-gray-600 font-semibold text-lg mb-5'>
          Add Activity
        </h4>
        <div className='w-full flex flex-wrap gap-5'>
          {act_types.map((item) => (
            <div key={item} className='flex gap-2 items-center'>
              <input
                type='checkbox'
                className='w-4 h-4'
                checked={selected === item ? true : false}
                onChange={() => setSelected(item)}
              />
              <p>{item}</p>
            </div>
          ))}
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Type ......'
            className='bg-white w-full mt-10 border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-blue-500'
          ></textarea>
          {isLoading ? (
            <Loading />
          ) : (
            <Button
              type='button'
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow-md transition duration-200"
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskDetails
