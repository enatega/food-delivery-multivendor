'use client'
import dynamic from "next/dynamic";
// import { useEffect,useRef } from "react";

const Home = dynamic(
  () => import('@/lib/ui/screens/unprotected/index'),
  { ssr: false }
);

export default function RootPage() {


  // if ('serviceWorker' in navigator) {
  //   window.addEventListener('load', () => {
  //     navigator.serviceWorker.register('/sw.js')
  //       .then(registration => {
  //         console.log('Service Worker registered with scope:', registration.scope);
  //       })
  //       .catch(error => {
  //         console.error('Service Worker registration failed:', error);
  //       });
  //   });
  // }

  // const hasRegistered = useRef(false); // ✅ Persist across renders

  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     window.addEventListener("load", () => {
  //       if (hasRegistered.current) return; // ✅ Prevent duplicate registration
  //       hasRegistered.current = true;

  //       navigator.serviceWorker
  //         .register("/sw.js")
  //         .then((registration) => {
  //           console.log("✅ Service Worker registered:", registration.scope);
  //         })
  //         .catch((error) => {
  //           console.error("❌ SW registration failed:", error);
  //         });
  //     });
  //   }
  // }, []);
  return  <Home/>
}
