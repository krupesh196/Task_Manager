import { Dialog } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";
import { useChangePasswordMutation } from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";
import Loading from "./Loader";

const ChangePassword = ({ open, setOpen }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [changeUserPassword, { isLoading }] = useChangePasswordMutation();

    const handleOnSubmit = async (data) => {
        if (data.password !== data.cpass) {
            toast.warning("Passwords doesn't match");
            return;
        }
        try {
            await changeUserPassword(data).unwrap();
            toast.success("New User added successfully");

            setTimeout(() => {
                setOpen(false);
            }, 1500);
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
                        Change Password
                    </Dialog.Title>
                    <div className='mt-2 flex flex-col gap-6'>
                        <Textbox
                            placeholder='New Passowrd'
                            type='password'
                            name='password'
                            label='New Passowrd'
                            className='w-full rounded'
                            register={register("password", {
                                required: "New Passowrd is required!",
                            })}
                            error={errors.password ? errors.password.message : ""}
                        />
                        <Textbox
                            placeholder='Confirm New Passowrd'
                            type='password'
                            name='cpass'
                            label='Confirm New Passowrd'
                            className='w-full rounded'
                            register={register("cpass", {
                                required: "Confirm New Passowrd is required!",
                            })}
                            error={errors.cpass ? errors.cpass.message : ""}
                        />
                    </div>

                    {isLoading ? (
                        <div className='py-5'>
                            <Loading />
                        </div>
                    ) : (
                        <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
                            <Button
                                type='submit'
                                className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition duration-200 sm:w-auto"
                                label='Save'
                            />

                            <button
                                type='button'
                                className="mt-2 sm:mt-0 sm:mr-3 px-6 py-2 bg-white text-gray-900 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200 sm:w-auto"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </ModalWrapper>
        </>
    );
};

export default ChangePassword;