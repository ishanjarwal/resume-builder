"use client";
import CustomUserButton from "@/components/custom/CustomUserButton";
import { Button } from "@/components/ui/button";
import { images } from "@/constants/images";
import ThemeToggleButton from "@/features/theme_toggle/components/ThemeToggleButton";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import TitleForm from "../forms/TitleForm";

const EditorHeader = () => {
  return (
    <header className="flex w-full items-center justify-between border-b p-2">
      <div className="flex basis-3/12 items-center justify-start space-x-2">
        <Button variant={"ghost"} className="px-1" asChild>
          <Link href={"/resumes"}>
            <IoIosArrowBack />
          </Link>
        </Button>
        <div className="relative aspect-square w-6 lg:w-8">
          <Image
            src={images.logo}
            alt="ResumeBuildr - Your AI Resume Builder"
            fill
          />
        </div>
        <div>
          {/* <h1 className="text-lg font-bold lg:text-xl">
            <span>Resume</span>
            <span className="text-primary">Buildr</span>
          </h1> */}
        </div>
      </div>
      <div className="step1 basis-3/4">
        {/* for title of the current resume (editable) */}
        <TitleForm />
      </div>
      <div className="flex basis-3/12 items-center justify-end space-x-4">
        <ThemeToggleButton />
        <CustomUserButton />{" "}
      </div>
    </header>
  );
};

export default EditorHeader;
