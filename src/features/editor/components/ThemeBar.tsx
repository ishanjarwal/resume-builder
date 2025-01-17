"use client";
import React, { useContext, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TwitterPicker } from "react-color";
import { Button } from "@/components/ui/button";
import { RxText } from "react-icons/rx";
import { FaRegCircle } from "react-icons/fa";
import { BiSquareRounded } from "react-icons/bi";
import { IoColorFillOutline } from "react-icons/io5";
import { ResumeDataContext } from "../providers/ResumeData";
import { FaRegSquareFull } from "react-icons/fa6";
import { AiOutlineFontColors } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { TemplateSchema, TemplateValues } from "@/validations/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem } from "@/components/ui/form";
import CustomTooltip from "@/components/custom/CustomTooltip";
import { MdOutlineGridView } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { templateDefValues } from "@/validations/defaultValues";

const ThemeBar = () => {
  const { resumeData, setResumeData } = useContext(ResumeDataContext);

  const form = useForm<TemplateValues>({
    mode: "onChange",
    resolver: zodResolver(TemplateSchema),
    defaultValues: resumeData.template || templateDefValues,
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({ ...resumeData, template: { ...values } });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  const borderStyles = ["circle", "square", "squircle"];
  const BorderIcon =
    resumeData.template.borderStyle === "square" ? (
      <FaRegSquareFull />
    ) : resumeData.template.borderStyle === "circle" ? (
      <FaRegCircle />
    ) : (
      <BiSquareRounded />
    );

  return (
    <div className="flex items-center justify-start space-x-2">
      <Form {...form}>
        <CustomTooltip
          text="Choose template"
          delayDuration={0}
          side={"bottom"}
          className="z-[1000]"
        >
          <Button
            className="text-xs active:scale-90"
            variant="outline"
            size={"icon"}
          >
            <MdOutlineGridView />
          </Button>
        </CustomTooltip>
        <Popover>
          <CustomTooltip
            className="z-[1000]"
            text="Change text color"
            delayDuration={0}
            side="bottom"
          >
            <PopoverTrigger>
              <Button
                className="active:scale-90"
                variant="outline"
                size="icon"
                asChild
              >
                <span>
                  <AiOutlineFontColors />
                </span>
              </Button>
            </PopoverTrigger>
          </CustomTooltip>
          <PopoverContent
            className="z-[10000] border-none bg-transparent shadow-none"
            align="start"
          >
            <FormField
              control={form.control}
              name={"textHex"}
              render={({ field }) => (
                <FormItem>
                  <TwitterPicker
                    color={field.value}
                    onChange={(color) => {
                      field.onChange(color.hex);
                    }}
                    triangle="top-left"
                    colors={[
                      "#000000",
                      "#FFFFFF",
                      "#333333",
                      "#F5F5F5",
                      "#FF5733",
                      "#28A745",
                      "#007BFF",
                      "#6F42C1",
                      "#FFC107",
                      "#DC3545",
                    ]}
                  />
                </FormItem>
              )}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <CustomTooltip
            className="z-[1000]"
            text="Change backdrop color"
            delayDuration={0}
            side="bottom"
          >
            <PopoverTrigger>
              <Button
                className="active:scale-90"
                variant="outline"
                size="icon"
                asChild
              >
                <span>
                  <IoColorFillOutline />
                </span>
              </Button>
            </PopoverTrigger>
          </CustomTooltip>
          <PopoverContent
            className="z-[10000] border-none bg-transparent shadow-none"
            align="start"
          >
            <FormField
              control={form.control}
              name={"backdropHex"}
              render={({ field }) => (
                <FormItem>
                  <TwitterPicker
                    onChange={(color) => {
                      field.onChange(color.hex);
                    }}
                    color={field.value}
                    triangle="top-left"
                    colors={[
                      "#FFFFFF",
                      "#F8F9FA",
                      "#E9ECEF",
                      "#FFF3CD",
                      "#E2F0CB",
                      "#D1ECF1",
                      "#FEE2E2",
                      "#EAF4FC",
                      "#F6E6E9",
                      "#FFF7E6",
                    ]}
                  />
                </FormItem>
              )}
            />
          </PopoverContent>
        </Popover>
        <FormField
          control={form.control}
          name="borderStyle"
          render={({ field }) => (
            <CustomTooltip
              className="z-[1000]"
              text="Change border styles"
              delayDuration={0}
              side="bottom"
            >
              <Button
                className="active:scale-90"
                variant="outline"
                size="icon"
                onClick={() => {
                  const currStyle =
                    borderStyles.findIndex(
                      (el) => el === resumeData.template.borderStyle,
                    ) || 0;
                  const nextStyle = borderStyles[(currStyle + 1) % 3];
                  field.onChange(nextStyle);
                }}
              >
                {BorderIcon}
              </Button>
            </CustomTooltip>
          )}
        />
        <Select>
          <CustomTooltip
            className="z-[1000]"
            text="Change font"
            delayDuration={0}
            side="bottom"
          >
            <SelectTrigger className="!h-auto !w-auto p-0 focus:ring-0 [&>svg]:hidden">
              <Button
                className="active:scale-90"
                variant="outline"
                size="icon"
                asChild
              >
                <span className="!flex items-center justify-center">
                  <RxText />
                </span>
              </Button>
            </SelectTrigger>
          </CustomTooltip>
          <SelectContent className="z-[1000]">
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </Form>
    </div>
  );
};

export default ThemeBar;
