// steps for retaining the current form in url params

import React from "react";
import PersonalDetailsForm from "../forms/PersonalDetailsForm";
import EducationForm from "../forms/EducationForm";
import { EditorFormProps } from "./types";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  {
    title: "Personal Details",
    component: PersonalDetailsForm,
    key: "personal-details",
  },
  {
    title: "Educational Details",
    component: EducationForm,
    key: "education-details",
  },
];
