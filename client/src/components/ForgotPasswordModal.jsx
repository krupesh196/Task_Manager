import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from './Button';
import Textbox from './Textbox';
import { toast } from 'sonner';
import Loading from './Loader';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const password = watch('password', '');

  if (!isOpen) return null;

  const submitHandler = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords and Re-enter password don't match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Password reset failed');
      }

      toast.success('Password reset successfully.');
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
          <Textbox
            placeholder="email@example.com"
            type="email"
            name="email"
            label="Email Address"
            className="w-full rounded-full"
            register={register('email', {
              required: 'Email is required!',
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: 'Invalid email address',
            },
            })}
            error={errors.email ? errors.email.message : ''}
          />
          <Textbox
            placeholder="New password"
            type="password"
            name="password"
            label="New Password"
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
            placeholder="Re-enter new password"
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
          <div className="flex justify-end items-center gap-2">

            {isLoading ? (
              <div className="flex justify-center w-full h-10 items-center">
                <Loading />
              </div>
            ) : (
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button
                  type="button"
                  label="Cancel"
                  className="sm:mr-3 px-6 py-2 bg-white text-gray-900 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200 sm:w-auto"
                  onClick={onClose}
                />
                <Button
                  type="submit"
                  label="Reset"
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition duration-200 sm:w-auto"
                />
              </div>
            )}

          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
