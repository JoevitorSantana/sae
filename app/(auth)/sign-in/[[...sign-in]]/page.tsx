"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.push(returnUrl);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, [returnUrl, router]);

  return <SignIn afterSignInUrl={returnUrl} />;
}