import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Textbox from '../components/Textbox';
import { toast } from 'sonner';
import Loading from '../components/Loader';

const Register = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const password = watch('password', '');

    const submitHandler = async (data) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords and Re-enter password don't match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.fullName,
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed');
            }

            toast.success('Registration successfully.');
            navigate('/log-in');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
            <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
                {/* left side */}
                <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
                    <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
                        <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
                            <span>Cloud-Based</span>
                            <span>Task Manager</span>
                        </p>
                    </div>
                </div>

                {/* right side */}
                <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col items-center justify-center">
                    <form
                        onSubmit={handleSubmit(submitHandler)}
                        className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
                    >
                        <div>
                            <p className="text-blue-600 text-3xl font-bold text-center">
                                Register
                            </p>
                            <p className="text-center text-base text-gray-700">
                                Create your new account.
                            </p>
                        </div>

                        <div className="flex flex-col gap-y-5">
                            <Textbox
                                placeholder="Full Name"
                                type="text"
                                name="fullName"
                                label="Full Name"
                                className="w-full rounded-full"
                                register={register('fullName', {
                                    required: 'Full name is required!',
                                })}
                                error={errors.fullName ? errors.fullName.message : ''}
                            />
                            <Textbox
                                placeholder="email@example.com"
                                type="email"
                                name="email"
                                label="Email Address"
                                className="w-full rounded-full"
                                register={register('email', {
                                    required: 'Email is required!',
                                    pattern: {
                                        value:
                                            /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                        message: 'Invalid email address',
                                    },
                                })}
                                error={errors.email ? errors.email.message : ''}
                            />
                            <Textbox
                                placeholder="Your password"
                                type="password"
                                name="password"
                                label="Password"
                                className="w-full rounded-full"
                                register={register('password', {
                                    required: 'Password is required!',
                                    minLength: {
                                        value: 3,
                                        message: 'Password must be at least 3 characters',
                                    },
                                })}
                                error={errors.password ? errors.password.message : ''}
                            />
                            <Textbox
                                placeholder="Re-enter your password"
                                type="password"
                                name="confirmPassword"
                                label="Confirm Password"
                                className="w-full rounded-full"
                                register={register('confirmPassword', {
                                    required: 'Please confirm your password!',
                                    validate: (value) =>
                                        value === password || "Passwords and Re-enter password don't match",
                                })}
                                error={errors.confirmPassword ? errors.confirmPassword.message : ''}
                            />

                            {isLoading ? (
                                <Loading />
                            ) : (
                                <Button
                                    type="submit"
                                    label="Register"
                                    className="w-full h-10 bg-blue-700 text-white rounded-full"
                                />
                            )}
                        </div>
                    </form>
                    <p className="text-center mt-4 text-gray-600">
                        Already have an account?{' '}
                        <span
                            className="text-blue-600 cursor-pointer hover:underline"
                            onClick={() => navigate('/log-in')}
                        >
                            Login here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
