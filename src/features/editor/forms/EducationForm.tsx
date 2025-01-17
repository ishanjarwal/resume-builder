"use client";
import React, { useEffect, useState } from "react";
import { EditorFormProps } from "../constants/types";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import {
  EducationDetailsSchema,
  EducationDetailsType,
  GenerateEducationDetailsSchema,
  GenerateEducationDetailsValues,
} from "@/validations/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "../components/CustomFormField";
import { IoMdAdd } from "react-icons/io";
import { MdDragIndicator } from "react-icons/md";
import { FiTrash } from "react-icons/fi";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaChevronDown, FaWandMagicSparkles } from "react-icons/fa6";
import clsx from "clsx";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { educationDetailsDefValues } from "@/validations/defaultValues";
import { generateEducationDetails } from "./action";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LuLoaderCircle } from "react-icons/lu";
import AIButton from "@/components/custom/AIButton";

const EducationForm = ({ resumeData, setResumeData }: EditorFormProps) => {
  const form = useForm<EducationDetailsType>({
    resolver: zodResolver(EducationDetailsSchema),
    defaultValues: {
      educationDetails: resumeData.educationDetails || [
        educationDetailsDefValues,
      ],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        educationDetails:
          values.educationDetails?.filter((edu) => edu !== undefined) || [],
      });
    });

    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  const { fields, append, remove, move } = useFieldArray({
    name: "educationDetails",
    control: form.control,
  });

  const sensors = useSensors(
    useSensor(TouchSensor),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      move(oldIndex, newIndex);
      return arrayMove(fields, oldIndex, newIndex);
    }
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-xl font-bold">Educational Details</h1>
      <p className="mt-2">Add your educational qualifications</p>
      <div className="mt-8">
        <Form {...form}>
          <div className="flex flex-col gap-y-8">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={fields}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((field, index) => (
                  <EducationItem
                    id={field.id}
                    index={index}
                    form={form}
                    remove={remove}
                    key={field.id}
                  />
                ))}
              </SortableContext>
            </DndContext>
            <Button
              className="py-6 text-foreground"
              onClick={() => append(educationDetailsDefValues)}
            >
              Add More
              <IoMdAdd />
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

interface EducationItemProps {
  id: string;
  form: UseFormReturn<EducationDetailsType>;
  index: number;
  remove: (index: number) => void;
}

const EducationItem = ({ id, form, index, remove }: EducationItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      className={clsx(
        "rounded-lg duration-75",
        isDragging && "relative z-50 cursor-grab shadow-xl",
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <Accordion
        type="single"
        className={clsx(
          "rounded-lg border border-border bg-background px-2 py-4 md:px-4",
          isDragging && "relative z-50 cursor-grab shadow-xl",
        )}
        collapsible
        defaultValue={"item-1"}
      >
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="truncate py-0 outline-none">
            <div className="flex w-full items-center justify-between gap-x-4">
              <div>
                <MdDragIndicator
                  {...attributes}
                  {...listeners}
                  className="rotate-90 cursor-grab !touch-none text-xl focus:outline-none"
                />
              </div>
              <div className="flex w-full items-center justify-between truncate">
                <p className="truncate text-lg font-semibold">
                  {form.watch("educationDetails")?.[index]?.degree ||
                    "Untitled"}
                </p>
                <span>
                  <FaChevronDown />
                </span>
              </div>
              <div>
                <Button
                  className="px-3 text-destructive hover:text-destructive"
                  variant={"ghost"}
                  onClick={() => remove(index)}
                >
                  <FiTrash className="text-2xl" />
                </Button>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="relative flex flex-col items-stretch md:flex-row">
              <div className="flex-1 px-2 py-4 md:px-4">
                <div className="mt-4 grid grid-cols-1 gap-y-4">
                  <div className="flex justify-end">
                    <AIEdicationDetailsGenerator form={form} index={index} />
                  </div>
                  <CustomFormField
                    props={{
                      name: `educationDetails.${index}.degree`,
                      fieldType: "text",
                      label: "Degree",
                      placeholder: "Degree name",
                    }}
                    control={form.control}
                  />
                  <CustomFormField
                    props={{
                      name: `educationDetails.${index}.institution`,
                      fieldType: "text",
                      label: "Institution",
                      placeholder: "Institution Name",
                    }}
                    control={form.control}
                  />
                  <CustomFormField
                    props={{
                      name: `educationDetails.${index}.description`,
                      fieldType: "textarea",
                      label: "Description",
                      placeholder: "Describe your experience/learnings",
                    }}
                    control={form.control}
                  />
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-4">
                      <CustomFormField
                        props={{
                          name: `educationDetails.${index}.score`,
                          fieldType: "text",
                          label: "Score/GPA",
                          placeholder: "Your Score",
                        }}
                        control={form.control}
                      />
                    </div>
                    <div className="col-span-6 md:col-span-4">
                      <CustomFormField
                        props={{
                          name: `educationDetails.${index}.startDate`,
                          fieldType: "date",
                          label: "Start Date",
                        }}
                        control={form.control}
                      />
                    </div>
                    <div className="col-span-6 md:col-span-4">
                      <CustomFormField
                        props={{
                          name: `educationDetails.${index}.endDate`,
                          fieldType: "date",
                          label: "End Date",
                          disabled: form.watch("educationDetails")?.[index]
                            .current
                            ? true
                            : false,
                        }}
                        control={form.control}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 px-2 py-2">
                    <CustomFormField
                      props={{
                        name: `educationDetails.${index}.current`,
                        fieldType: "checkbox",
                        label: "Currently studying here",
                      }}
                      control={form.control}
                    />
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default EducationForm;

const AIEdicationDetailsGenerator = ({
  form,
  index,
}: {
  form: UseFormReturn<EducationDetailsType>;
  index: number;
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  const descForm = useForm<GenerateEducationDetailsValues>({
    resolver: zodResolver(GenerateEducationDetailsSchema),
    defaultValues: { description: "" },
    mode: "onChange",
  });

  async function handleClick(desc: string) {
    try {
      setLoading(true);
      const result = await generateEducationDetails({
        description: desc,
      });
      if (result.error) {
        const tID = toast.error(
          <div className="flex items-center justify-between space-x-1 ps-1">
            <p className="text-sm">{result.error}</p>
            <Button
              className="text-xs"
              size={"sm"}
              variant={"secondary"}
              onClick={() => toast.dismiss(tID)}
            >
              Cancel
            </Button>
          </div>,
          { position: "bottom-center" },
        );
      } else if (result.success) {
        const {
          degree,
          institution,
          score,
          startDate,
          endDate,
          current,
          description,
        } = result.success.content;
        form.setValue(
          `educationDetails.${index}.degree`,
          degree ? degree : educationDetailsDefValues.degree,
        );
        form.setValue(
          `educationDetails.${index}.institution`,
          institution ? institution : educationDetailsDefValues.institution,
        );
        form.setValue(
          `educationDetails.${index}.startDate`,
          startDate ? startDate : educationDetailsDefValues.startDate,
        );
        form.setValue(
          `educationDetails.${index}.endDate`,
          endDate ? endDate : educationDetailsDefValues.endDate,
        );
        form.setValue(
          `educationDetails.${index}.description`,
          description ? description : educationDetailsDefValues.description,
        );
        form.setValue(
          `educationDetails.${index}.score`,
          score ? score : educationDetailsDefValues.score,
        );
        form.setValue(
          `educationDetails.${index}.current`,
          current ? current : educationDetailsDefValues.current,
        );
      }
    } catch (error) {
      toast.error("Something went wrong", { position: "bottom-center" });
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div>
          <AIButton />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <p className="flex items-center space-x-2">
              <FaWandMagicSparkles />
              <span>Take help from AI</span>
            </p>
          </DialogTitle>
          <DialogDescription>
            Describe a little about your degree, like your score, experience,
            work you did, starting and ending dates etc.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...descForm}>
            <CustomFormField
              control={descForm.control}
              props={{
                fieldType: "textarea",
                name: "description",
                label: "Description",
                placeholder:
                  "eg: I worked at google from nov 2023 to dec 2024 as a backend engineer",
              }}
            />
          </Form>
        </div>
        <DialogFooter>
          <Button
            disabled={loading}
            onClick={() => {
              const isValid = descForm.trigger();
              if (!isValid) return;
              const description = descForm.watch("description");
              if (description) handleClick(description);
            }}
            type="submit"
          >
            {loading && <LuLoaderCircle className="animate-spin" />}
            {!loading && <FaWandMagicSparkles />}
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
