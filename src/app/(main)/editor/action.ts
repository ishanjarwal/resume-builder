"use server";

import prisma from "@/lib/prisma";
import { resumeSchema, resumeSchemaType } from "@/validations/validation";
import { Prisma } from "@prisma/client";
// import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import path from "path";

export const saveResume = async (values: resumeSchemaType) => {
  console.log("Called");
  const { id } = values;
  console.log("values received at backend : ", values);
  // test
  try {
    const { personalDetails, ...restResumeData } = resumeSchema.parse(values);
    // const { userId } = await auth();
    const userId = "abcd";
    if (!userId) {
      throw new Error("unauthorized access");
    }

    //   TODO : check resume count for non-premium users

    const existingResume = id
      ? await prisma.resume.findUnique({ where: { id, userId } })
      : null;

    if (id && !existingResume) {
      throw new Error("resume not found, invalid id");
    }

    //  photo undefined means no photo and null means delete existing photo
    const profilePicture = personalDetails.profilePicture;
    let newPhotoURL: string | undefined | null = undefined;
    if (profilePicture instanceof File) {
      // delete old photo if exists
      if (existingResume?.personalDetails.profilePicture) {
        await del(existingResume.personalDetails.profilePicture);
      }

      // upload new photo
      const blob = await put(
        `resume_profile_pictures/${path.extname(profilePicture.name)}`,
        profilePicture,
        {
          access: "public", // currently available
        },
      );

      newPhotoURL = blob.url;
    } else if (profilePicture === null) {
      if (existingResume?.personalDetails.profilePicture) {
        await del(existingResume.personalDetails.profilePicture);
      }
      newPhotoURL = null;
    }

    if (id) {
      // update
      return prisma.resume.update({
        where: { id },
        data: {
          userId,
          personalDetails: { ...personalDetails, profilePicture: newPhotoURL },
          ...restResumeData,
        },
      });
    } else {
      // insert new entry
      const addable = {
        userId,
        personalDetails: {
          ...personalDetails,
          profilePicture: newPhotoURL,
        },
        ...restResumeData,
      };
      console.log("Added to db : ", addable);
      return prisma.resume.create({
        data: addable,
      });
    }
  } catch (error) {
    throw new Error("Something went wrong");
  }
};
