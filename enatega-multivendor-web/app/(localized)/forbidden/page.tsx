"use client";

// import { useRouter } from "next/navigation";

const Forbidden = () => {
  // const router = useRouter();
  return (
    <main className="h-screen w-full flex flex-col gap-2 justify-center items-center bg-white">
      <h1 className="text-9xl font-extrabold text-black tracking-widest">
        403
      </h1>
      <div className="bg-[#5ac12f] text-white px-2 text-sm rounded rotate-12 absolute">
        Forbidden
      </div>
    </main>
  );
};

export default Forbidden;
