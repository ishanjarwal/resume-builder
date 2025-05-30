"use client";
import { Button } from "@/components/ui/button";
import React from "react";

import { IoMdArrowBack, IoMdArrowForward, IoMdMore } from "react-icons/io";
import { steps } from "../constants/steps";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoRocketOutline } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import Link from "next/link";
import { useTour } from "@reactour/tour";
import { cn } from "@/lib/utils";
import StylingTrigger from "./StylingTrigger";
import { FaRegEye } from "react-icons/fa6";

interface FooterProps {
  currStep: string;
  setCurrStep: (key: string) => void;
  resumeId?: string;
}

const EditorFooter = ({ currStep, setCurrStep, resumeId }: FooterProps) => {
  const { setIsOpen } = useTour();

  const addPreviewParam = () => {
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set("preview", "true");
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  };

  const prevStep = steps.find((_, idx) => steps[idx + 1]?.key === currStep);

  const nextStep = steps.find((_, idx) => steps[idx - 1]?.key === currStep);

  return (
    <div className="fixed bottom-0 flex w-full items-center justify-between border-t bg-background px-1 py-4 sm:px-4 lg:relative lg:bottom-auto">
      <div
        className={cn(
          "step3",
          "flex items-center justify-start space-x-1 sm:space-x-2",
        )}
      >
        {prevStep && (
          <Button
            onClick={
              prevStep
                ? () => {
                    setCurrStep(prevStep.key);
                  }
                : undefined
            }
            className="px-2 py-1 text-xs shadow-md lg:px-4 lg:py-2 lg:text-sm"
            variant={"outline"}
          >
            <IoMdArrowBack />
            <span className="hidden lg:block">Back</span>
          </Button>
        )}
        {nextStep && (
          <Button
            variant={"secondary"}
            onClick={
              nextStep
                ? () => {
                    setCurrStep(nextStep.key);
                  }
                : undefined
            }
            className="border border-border bg-white px-2 py-1 text-xs text-black shadow-md lg:px-4 lg:py-2 lg:text-sm"
          >
            <span className="">Add {nextStep.title}</span>
            <IoMdArrowForward />
          </Button>
        )}
      </div>
      <div className="flex items-center justify-start space-x-1 sm:space-x-2">
        <div className="step4">
          <StylingTrigger />
        </div>
        <Button
          onClick={addPreviewParam}
          className={cn(
            "step5",
            "w-9 border border-border py-1 text-xs shadow-md sm:w-auto lg:px-4 lg:py-2 lg:text-sm",
          )}
          variant={"secondary"}
        >
          <FaRegEye />
          <span className="hidden sm:block">Preview</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="border border-border shadow-md"
              size={"icon"}
              variant={"secondary"}
            >
              <IoMdMore />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Button
                className="w-full justify-start bg-transparent text-foreground shadow-none hover:bg-transparent"
                asChild
              >
                <Link href={`/preview?id=${resumeId}`} target="_blank">
                  <MdOutlineFileDownload />
                  <span>Download PDF</span>
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button
                onClick={() => setIsOpen(true)}
                className="w-full justify-start bg-transparent text-foreground shadow-none hover:bg-transparent"
              >
                <IoRocketOutline />
                <span>Launch tour guide</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default EditorFooter;
