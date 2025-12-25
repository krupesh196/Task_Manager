import React from 'react'
import clsx from "clsx"

const Textbox = React.forwardRef(({
    type, placeholder, label, className, register, error, name, autocomplete
}, ref) => {
    return (
        <div className='w-full flex flex-col gap-1'>
            {label && (
                <label htmlFor={name} className='text-slate-800 text-sm'>
                    {label}
                </label>
            )}

            <input
                type={type}
                name={name}
                placeholder={placeholder}
                ref={ref}
                {...register}
                aria-invalid={error ? "true" : "false"}
                autoComplete={autocomplete}
                className={clsx(
                    "bg-transparent px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 rounded-lg",
                    className
                )}
            />

            {error && (
                <span className='text-xs text-[#f64949fe] mt-0.5'>
                    {error}
                </span>
            )}
        </div>
    )
})

export default Textbox
