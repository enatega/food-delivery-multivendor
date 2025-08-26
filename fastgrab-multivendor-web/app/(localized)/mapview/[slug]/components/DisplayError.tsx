import React from 'react';

interface DisplayErrorProps {
    message?: string;
}

const DisplayError: React.FC<DisplayErrorProps> = ({ message = 'Something went wrong.' }) => {
    return (
        <div className='w-full sm:h-[250px] h-[180px] rounded-md flex items-center flex-col gap-4 mt-4 justify-center sm:text-2xl text-lg sm:font-semibold font-medium border border-red-600 text-red-500'>
            <span>{message}</span>
        </div>
    );
};

export default DisplayError;