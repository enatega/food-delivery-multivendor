import React, { FC } from 'react';

type LoaderProps = {
  message?: string;
  style?: object 
}

const Loader: FC<LoaderProps> = ({ message, style }) => {
  return (
    <div className="h-screen w-full flex justify-center items-center flex-col gap-4 ">
      <div style={style} className="sm:w-16 w-12 sm:h-16 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin "></div>
      {message ? <span className='text-black'>{message}</span> : ''}
    </div>
  );
};

export default Loader;
