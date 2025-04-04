import AnimateUpOnAppear from "@/components/custom/animators/AnimateUpOnAppear";
import CreateNewButton from "@/features/dashboard/components/CreateNewButton";
import Navbar from "@/features/dashboard/components/Navbar";
import ResumeList from "@/features/dashboard/components/ResumeList";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const [resumes, count] = await Promise.all([
    prisma.resume.findMany({
      where: { userId },
      orderBy: [{ updatedAt: "desc" }],
    }),
    prisma.resume.count({ where: { userId } }),
  ]);

  return (
    <main className="bg-background">
      <Navbar />
      <div className="min-h-[calc(100vh - 64px)] mx-auto max-w-screen-2xl px-4 py-4 md:px-8 md:py-8 lg:px-16">
        <div className="flex flex-col gap-y-2">
          <AnimateUpOnAppear>
            <h1 className="text-3xl font-semibold">
              My Resumes&nbsp;&#40;{count}&#41;
            </h1>
          </AnimateUpOnAppear>
          <AnimateUpOnAppear delay={0.1}>
            <p className="text-muted-foreground">
              Edit, customize or download your resumes here.
            </p>
          </AnimateUpOnAppear>
          {count > 0 && (
            <AnimateUpOnAppear delay={0.2}>
              <CreateNewButton count={count} />
            </AnimateUpOnAppear>
          )}
        </div>
        <div className="mt-8">
          <ResumeList resumes={resumes} />
        </div>
      </div>
    </main>
  );
};

export default page;
