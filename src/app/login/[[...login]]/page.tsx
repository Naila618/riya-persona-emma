import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 py-12 text-zinc-100 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-indigo-600/20 blur-[130px] pointer-events-none" />
      <div className="relative z-10">
        <SignIn />
      </div>
    </div>
  );
}
