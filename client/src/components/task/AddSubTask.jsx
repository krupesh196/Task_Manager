import React from "react";
import { Button, Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ModalWrapper from "../ModalWrapper";
import Textbox from "../Textbox";
import { useCreateSubTaskMutation } from "../../redux/slices/api/taskApiSlice";

const AddSubTask = ({ open, setOpen, id, onSuccess }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [addSbTask] = useCreateSubTaskMutation();

    const handleOnSubmit = async (data) => {
        try {
            const res = await addSbTask({ data, id }).unwrap();

            toast.success(res.message);

            setTimeout(() => {
                setOpen(false);
                if (onSuccess) onSuccess();
            }, 500);
        } catch (err) {
            console.log(err);
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <ModalWrapper open={open} setOpen={setOpen}>
                <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
                    <Dialog.Title
                        as='h2'
                        className='text-base font-bold leading-6 text-gray-900 mb-4'
                    >
                        ADD SUB-TASK
                    </Dialog.Title>
                    <div className='mt-2 flex flex-col gap-6'>
                        <Textbox
                            placeholder='Sub-Task title'
                            type='text'
                            name='title'
                            label='Title'
                            className='w-full rounded'
                            register={register("title", {
                                required: "Title is required!",
                            })}
                            error={errors.title ? errors.title.message : ""}
                        />

                        <div className='flex items-center gap-4'>
                            <Textbox
                                placeholder='Date'
                                type='date'
                                name='date'
                                label='Task Date'
                                className='w-full rounded'
                                register={register("date", {
                                    required: "Date is required!",
                                })}
                                error={errors.date ? errors.date.message : ""}
                            />
                            <Textbox
                                placeholder='Tag'
                                type='text'
                                name='tag'
                                label='Tag'
                                className='w-full rounded'
                                register={register("tag", {
                                    required: "Tag is required!",
                                })}
                                error={errors.tag ? errors.tag.message : ""}
                            />
                        </div>
                    </div>

                    <div className='py-3 mt-4 flex sm:flex-row-reverse gap-4'>
                        <Button
                            type='submit'
                            className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition sm:w-auto"
                        >
                            Add Task
                        </Button>

                        <Button
                            type='button'
                            className="px-6 py-2 bg-white border border-gray-300 text-gray-800 text-sm font-semibold rounded-md hover:bg-gray-100 transition sm:w-auto"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>

                </form>
            </ModalWrapper>
        </>
    );
};

export default AddSubTask;