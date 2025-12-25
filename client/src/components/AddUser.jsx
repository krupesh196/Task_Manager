import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Loading from './Loader'
import Textbox from './Textbox'
import { Button, Dialog } from '@headlessui/react'
import ModalWrapper from './ModalWrapper'
import { useRegisterMutation } from '../redux/slices/api/authApiSlice'
import { toast } from 'sonner'
import { useUpdateUserMutation } from '../redux/slices/api/userApiSlice'
import { setCredential } from '../redux/slices/authSlice'

const AddUser = ({ open, setOpen, userData }) => {

    let defaultValues = userData ?? {}
    const { user } = useSelector((state) => state.auth)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ defaultValues })

    const dispatch = useDispatch();

    const [addNewUser, { isLoading }] = useRegisterMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()

    const handleOnSubmit = async (data) => {
        try {
            if (userData) {
                const result = await updateUser(data).unwrap()

                toast.success(result?.message)

                if (userData?._id === user._id) {
                    dispatch(setCredential({ ...result.user }))
                }
            } else {
                await addNewUser({
                    ...data,
                    password: data.email,
                }).unwrap();

                toast.success("New User added Successfully");
            }

            setTimeout(() => {
                setOpen(false);
            }, 1500);
        } catch {
                toast.error("Something went wrong");
            }
    }

    return (
        <>
            <ModalWrapper open={open} setOpen={setOpen}>
                <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
                    <Dialog.Title
                        as='h2'
                        className='text-base font-bold leading-6 text-gray-900 mb-4'
                    >
                        {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
                    </Dialog.Title>
                    <div className='mt-2 flex flex-col gap-6'>
                        <Textbox
                            placeholder='Full name'
                            type='text'
                            name='name'
                            label='Full Name'
                            className='w-full rounded'
                            register={register("name", {
                                required: "Full name is required!",
                            })}
                            error={errors.name ? errors.name.message : ""}
                        />
                        <Textbox
                            placeholder='Title'
                            type='text'
                            name='title'
                            label='Title'
                            className='w-full rounded'
                            register={register("title", {
                                required: "Title is required!",
                            })}
                            error={errors.title ? errors.title.message : ""}
                        />
                        <Textbox
                            placeholder='Email Address'
                            type='email'
                            name='email'
                            label='Email Address'
                            className='w-full rounded'
                            register={register("email", {
                                required: "Email Address is required!",
                            })}
                            error={errors.email ? errors.email.message : ""}
                        />

                        <Textbox
                            placeholder='Role'
                            type='text'
                            name='role'
                            label='Role'
                            className='w-full rounded'
                            register={register("role", {
                                required: "User role is required!",
                            })}
                            error={errors.role ? errors.role.message : ""}
                        />
                    </div>

                    {isLoading || isUpdating ? (
                        <div className='py-5'>
                            <Loading />
                        </div>
                    ) : (
                        <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
                            <Button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition duration-200 sm:w-auto"
                            >
                                Submit
                            </Button>

                            <Button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="mt-2 sm:mt-0 sm:mr-3 px-6 py-2 bg-white text-gray-900 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200 sm:w-auto"
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </form>
            </ModalWrapper>
        </>
    )
}

export default AddUser