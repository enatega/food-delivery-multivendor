'use client';
import CustomButton from '@/lib/ui/useable-components/button';
import { useRouter } from 'next/navigation';
import React from 'react';

const Forbidden = () => {
  const router = useRouter();
  return (
    <main className="h-screen w-full flex flex-col gap-2 justify-center items-center bg-white">
      <h1 className="text-9xl font-extrabold text-black tracking-widest">
        403
      </h1>
      <div className="bg-[#5ac12f] text-white px-2 text-sm rounded rotate-12 absolute">
        Forbidden
      </div>
      <CustomButton
        onClick={() => router.back()}
        label="Go Back"
        className="bg-black text-white px-5 py-2"
      />
    </main>
  );
};

export default Forbidden;
