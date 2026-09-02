'use client';

// Core
import { useRouter } from 'next/navigation';

// Components
import CustomButton from '@/lib/ui/useable-components/button';

// Prime React
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';

export default function LoginMain() {
  const router = useRouter();

  return (
    <div className="flex h-full w-screen items-center justify-center gap-4">
      <div className="w-1/3">
        <Card>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col text-center">
              <span className="text-2xl">Welcome!</span>
              <span className="text-sm text-gray-400">
                Sign up or Login to continue
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <CustomButton
                className="border-gray-30 h-12 w-full border bg-transparent text-black dark:text-white hover:bg-gray-100"
                label="Login with Google"
                rounded={true}
                icon="pi pi-google"
              />

              <CustomButton
                className="border-gray-30 px-32: h-12 w-full bg-black text-white hover:bg-gray-100 hover:text-black"
                label="Login with Apple"
                rounded={true}
                icon="pi pi-apple"
              />
            </div>

            <Divider />

            <div className="flex flex-col items-center justify-center gap-2">
              <CustomButton
                className="border-gray-30 h-12 w-full border bg-primary-color text-white hover:bg-gray-100 hover:text-black"
                label="Login"
                rounded={true}
                onClick={() => router.push('/authentication/login')}
              />

              <CustomButton
                className="border-gray-30 h-12 w-full border bg-secondary-color text-white hover:bg-gray-100 hover:text-black"
                label="Sign up"
                rounded={true}
                onClick={() => router.push('/authentication/sign-up')}
              />
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-400">
                By signing up, you agree to our&nbsp;
                <span className="font-bold">Terms and Conditions&nbsp;</span>
                and<span className="font-bold">&nbsp;Privacy Policy.</span>
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
