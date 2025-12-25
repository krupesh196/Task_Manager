import React, { useState } from 'react'
import ModalWrapper from '../ModalWrapper'
import { Button, Dialog } from '@headlessui/react'
import Textbox from '../Textbox'
import { useForm } from "react-hook-form";
import UserList from './UserList';
import SelectList from '../SelectList';
import { BiImages } from 'react-icons/bi';
import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../utils/firebase"
import { useCreateTaskMutation, useUpdateTaskMutation } from '../../redux/slices/api/taskApiSlice';
import { toast } from 'sonner';
import { dateFormatter } from '../../utils';
import { useSelector } from 'react-redux';

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"]
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"]

const uploadedFileURLs = [];

const AddTask = ({ open, setOpen, task }) => {

    const user = useSelector(state => state.auth.user);

    const defaultValues = {
        title: task?.title || "",
        date: dateFormatter(task?.date || new Date()),
        team: [],
        stage: "",
        priority: "",
        assets: [],
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues });

    const [team, setTeam] = useState(task?.team || [])
    const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0])
    const [priority, setPriority] = useState(
        task?.priority?.toUpperCase() || PRIORITY[2]
    )
    const [assets, _setAssets] = useState([])
    const [uploading, setUploading] = useState(false)

    const [createTask] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();
    const URLS = task?.assets ? [...task.assets] : [];

    const submitHandler = async (data) => {
        for (const file of assets) {
            setUploading(true);
            try {
                await uploadFile(file);
            } catch (error) {
                console.error("Error uploading file:", error.message);
                return;
            } finally {
                setUploading(false);
            }
        }

        try {
            let newData;
            if (user?.isAdmin) {
                newData = {
                    ...data,
                    assets: [...URLS, ...uploadedFileURLs],
                    team,
                    stage,
                    priority,
                };
            } else {
                newData = {
                    stage,
                    date: data.date,
                };
            }

            const res = task?._id
                ? await updateTask({ ...newData, _id: task._id }).unwrap()
                : await createTask(newData).unwrap();

            toast.success(res.message);

            setTimeout(() => {
                setOpen(false);
            }, 500);
        } catch (err) {
            console.log(err);
            toast.error(err?.data?.message || err.error);
        }
    };  

    const uploadFile = async (file) => {

        const storage = getStorage(app);

        const name = new Date().getTime() + file.name;
        const storageRef = ref(storage, name);

        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                () => {
                    console.log("Uploading");
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            uploadedFileURLs.push(downloadURL);
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
            );
        });
    };

    return (
        <>
            <ModalWrapper open={open} setOpen={setOpen}>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <Dialog.Title
                        as='h2'
                        className='text-base font-bold leading-6 text-gray-900 mb-4'
                    >
                        {task ? "UPDATE TASK" : "ADD TASK"}
                    </Dialog.Title>

                    <div className='mt-2 flex flex-col gap-6'>
                        <Textbox
                            placeholder='Task Title'
                            type="Text"
                            name="title"
                            label="Task Title"
                            className="w-full rounded"
                            register={register("title", { required: "Title is requirerd" })}
                            error={errors.title ? errors.title.message : " "}
                            disabled={!user?.isAdmin} // disable for non-admin
                        />

                        {user?.isAdmin && (
                            <UserList
                                setTeam={setTeam}
                                team={team}
                            />
                        )}

                        <div className='flex gap-4'>
                            <SelectList
                                label="Task Stage"
                                lists={LISTS}
                                selected={stage}
                                setSelected={setStage}
                            />

                            {user?.isAdmin && (
                                <div className='w-full'>
                                    <SelectList
                                        label='Priority Level'
                                        lists={PRIORITY}
                                        selected={priority}
                                        setSelected={setPriority}
                                    />
                                </div>
                            )}
                        </div>

                        <div className='flex gap-4'>
                            <Textbox
                                placeholder="Date"
                                type='date'
                                name='date'
                                label='Task Date'
                                className='w-full rounded'
                                register={register("date", {
                                    required: "Date is required!",
                                })}
                                error={errors.date ? errors.date.message : ""}
                            />

                            <div className='w-full flex items-center justify-center mt-4'>

                            </div>
                        </div>

                        <div className='py-6 sm:flex sm:flex-row-reverse gap-4'>
                            {uploading ? (
                                <span className='text-sm py-2 text-red-500'></span>
                            ) : (
                                <Button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition sm:w-auto"
                                >
                                    Submit
                                </Button>
                            )}
                            <Button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="mt-2 sm:mt-0 sm:ml-2 px-6 py-2 bg-white text-gray-800 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-200 transition sm:w-auto"
                            >
                                Cancel
                            </Button>

                        </div>

                    </div>
                </form>
            </ModalWrapper>
        </>
    )
}

export default AddTask
