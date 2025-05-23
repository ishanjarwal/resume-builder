import { z } from "zod";

const optionalString = z.string().trim().optional().or(z.literal(""));

export const projectTitleSchema = z.object({
  title: optionalString,
});

export const projectTitleDefValues = {
  title: "",
};

export type projectTitleType = z.infer<typeof projectTitleSchema>;

export const personalDetailsSchema = z.object({
  profilePicture: z
    .union([
      z.string().optional(),
      z
        .custom<File | null | undefined>()
        .refine(
          (file) =>
            !file || (file instanceof File && file.type.startsWith("image/")),
          "File must be an image",
        )
        .refine(
          (file) => !file || file.size <= 1024 * 1024 * 4,
          "File too large, up to 4MB acceptable",
        ),
    ])
    .optional(),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  gender: optionalString,
  phone: optionalString,
  email: optionalString,
  country: optionalString,
  city: optionalString,
  summary: optionalString,
});

export type personalDetailsType = z.infer<typeof personalDetailsSchema>;

export const SocialLinksSchema = z.object({
  linkedin: optionalString,
  instagram: optionalString,
  github: optionalString,
  website: optionalString,
  twitter: optionalString,
  threads: optionalString,
  custom: z
    .array(
      z.object({
        label: optionalString,
        link: optionalString,
      }),
    )
    .optional(),
});

export type SocialLinksValues = z.infer<typeof SocialLinksSchema>;

export const EducationDetailsSchema = z.object({
  educationDetails: z
    .array(
      z.object({
        institution: optionalString,
        degree: optionalString,
        score: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        current: z.boolean().optional(),
        description: optionalString,
      }),
    )
    .optional(),
});

export type EducationDetailsType = z.infer<typeof EducationDetailsSchema>;
export type SingleEducationDetailsValues = NonNullable<
  z.infer<typeof EducationDetailsSchema>["educationDetails"]
>[number];

export const WorkExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        position: optionalString,
        employer: optionalString,
        description: optionalString,
        jobType: z.enum(["on-site", "remote", "hybrid", ""]).optional(),
        location: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        current: z.boolean().optional(),
      }),
    )
    .optional(),
});

export type WorkExperienceType = z.infer<typeof WorkExperienceSchema>;
export type SingleWorkExperienceValues = NonNullable<
  z.infer<typeof WorkExperienceSchema>["workExperiences"]
>[number];

export const SkillSchema = z.object({
  hardSkills: z
    .array(
      z.object({
        name: optionalString,
        level: z.number().min(0).max(100).optional(),
        levelDisabled: z.boolean().optional(),
      }),
    )
    .optional(),
  softSkills: z
    .array(
      z.object({
        name: optionalString,
        level: z.number().min(0).max(100).optional(),
        levelDisabled: z.boolean().optional(),
      }),
    )
    .optional(),
});

export type SkillType = z.infer<typeof SkillSchema>;

export const CommonAchievementSchema = z
  .array(
    z.object({
      title: optionalString,
      organization: optionalString,
      link: optionalString,
      score: optionalString,
      description: z.string().max(300).optional(),
      startDate: optionalString,
      endDate: optionalString,
    }),
  )
  .optional();

export type CommonAchievementValues = z.infer<typeof CommonAchievementSchema>;

export const HobbySchema = z.object({
  hobbies: z
    .array(
      z.object({
        name: optionalString,
        description: optionalString,
      }),
    )
    .optional(),
});

export type HobbyValues = z.infer<typeof HobbySchema>;

export const ProjectSchema = z.object({
  projects: z
    .array(
      z.object({
        name: optionalString,
        link: optionalString,
        description: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      }),
    )
    .optional(),
});

export type ProjectValues = z.infer<typeof ProjectSchema>;

export const TemplateSchema = z.object({
  templateId: optionalString,
  textHex: optionalString,
  accentHex: optionalString,
  backdropHex: optionalString,
  borderStyle: z.enum(["circle", "square", "squircle"]).optional(),
  fontFace: optionalString,
  fontSize: z.enum(["small", "medium", "large"]).optional(),
  // more values for font, colors etc.
});

export type TemplateValues = z.infer<typeof TemplateSchema>;

export const resumeSchema = z.object({
  personalDetails: z.object({
    ...personalDetailsSchema.shape,
  }),
  ...EducationDetailsSchema.shape,
  ...WorkExperienceSchema.shape,
  ...SkillSchema.shape,
  courses: CommonAchievementSchema,
  certifications: CommonAchievementSchema,
  achievements: CommonAchievementSchema,
  awards: CommonAchievementSchema,
  ...HobbySchema.shape,
  ...ProjectSchema.shape,
  ...projectTitleSchema.shape,
  socialLinks: z.object({
    ...SocialLinksSchema.shape,
  }),
  template: z.object({
    ...TemplateSchema.shape,
  }),
});

export type resumeSchemaType = z.infer<typeof resumeSchema> & {
  id?: string;
};

// Schemas and Types for AI
export const GenerateSummarySchema = z.object({
  jobTitle: optionalString,
  ...EducationDetailsSchema.shape,
  ...WorkExperienceSchema.shape,
});

export type GenerateSummaryValues = z.infer<typeof GenerateSummarySchema>;

export const GenerateFromAISchema = z.object({
  description: z
    .string()
    .min(1, "Required")
    .min(20, "Minimum 20 characters")
    .max(300, "Max 300 characters allowed")
    .optional(),
});

export type GenerateFromAIValues = z.infer<typeof GenerateFromAISchema>;
