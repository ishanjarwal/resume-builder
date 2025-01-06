import React from "react";
import { TemplateProps } from "../../types";
import Image from "next/image";
import usePhotoURL from "@/hooks/usePhotoURL";
import styles from "./styles.module.css";
import { cn } from "@/lib/utils";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";

const ATSTemplate1 = ({ resumeData }: TemplateProps) => {
  return (
    <div className="flex flex-col space-y-8 p-8">
      <Header resumeData={resumeData} />
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-3">
          <div className="flex flex-col space-y-4">
            <Summary resumeData={resumeData} />
            {resumeData.workExperiences &&
              resumeData.workExperiences.length > 0 && <hr />}
            <WorkExperience resumeData={resumeData} />
            {resumeData.educationDetails &&
              resumeData.educationDetails.length > 0 && <hr />}
            <Educations resumeData={resumeData} />
          </div>
        </div>
        <div className="col-span-1 h-full bg-background-muted p-4">
          <Skills resumeData={resumeData} />
          <SocialLinks resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
};

const Header = ({ resumeData }: TemplateProps) => {
  const {
    firstName,
    lastName,
    jobTitle,
    email,
    phone,
    city,
    country,
    gender,
    profilePicture,
  } = resumeData;
  const photoURL = usePhotoURL(profilePicture);

  return (
    <div>
      <div className="flex items-start justify-start space-x-8">
        {photoURL && (
          <div className="relative aspect-square w-24 overflow-hidden">
            <Image
              src={photoURL}
              alt="Profile Picture"
              className="h-full w-full object-cover object-center"
              fill
            />
          </div>
        )}
        <div className="flex flex-col">
          <p className={styles.title}>
            {firstName && <span>{firstName}</span>}
            {firstName && lastName && <span>&nbsp;</span>}
            {lastName && <span>{lastName}</span>}
          </p>
          <p className={styles.heading}>
            {jobTitle && <span>{jobTitle}</span>}
          </p>
          <p className={styles.para}>
            {email && <span>{email}</span>}
            {email && phone && " • "}
            {phone && <span>{phone}</span>}
          </p>
          <p className={styles.para}>
            {city && <span>{city}</span>}
            {city && country && ", "}
            {country && <span>{country}</span>}
          </p>
          {gender && (
            <p className={styles.para}>
              Gender : <span className="capitalize">{gender}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Summary = ({ resumeData }: TemplateProps) => {
  const { bio } = resumeData;
  return bio ? (
    <div className="flex flex-col space-y-1">
      <p className={styles.heading}>Professional Summary</p>
      <p className={styles.para}>{bio}</p>
    </div>
  ) : null;
};

const WorkExperience = ({ resumeData }: TemplateProps) => {
  const { workExperiences } = resumeData;
  return workExperiences && workExperiences?.length > 0 ? (
    <div className="flex flex-col space-y-2">
      <p className={styles.heading}>Work Experiences</p>
      <div className="flex flex-col space-y-4">
        {workExperiences.map((item, index) => (
          <div key={"workexp+" + index} className="flex flex-col">
            <p className={styles.subHeading}>
              {item.position && <span>{item.position}</span>}
              {item.employer && <span>{" at "}</span>}
              {item.employer && <span>{item.employer}</span>}
              {item.jobType && (
                <span className="capitalize">
                  {" • "}
                  {item.jobType}
                </span>
              )}
              {item.location && (
                <span>
                  {", "}
                  {item.location}
                </span>
              )}
            </p>
            <p className={styles.para}>
              {item.startDate && <span>{item.startDate}</span>}
              {(item.endDate || item.current) && <span>{" — "}</span>}
              {item.endDate && !item.current && <span>{item.endDate}</span>}
              {item.current && <span>Working</span>}
            </p>
            {item.description && (
              <p className={cn(styles.para, "mt-1")}>{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : null;
};

const Educations = ({ resumeData }: TemplateProps) => {
  const { educationDetails } = resumeData;
  return educationDetails && educationDetails?.length > 0 ? (
    <div className="flex flex-col space-y-2">
      <p className={styles.heading}>Qualifications</p>
      <div className="flex flex-col space-y-4">
        {educationDetails.map((item, index) => (
          <div key={"educations+" + index} className="flex flex-col">
            <p className={styles.subHeading}>
              {item.degree && <span>{item.degree}</span>}
            </p>
            <p className={styles.para}>
              {item.institution && <span>{item.institution}</span>}
              {item.startDate && (
                <span>
                  {" • "}
                  {item.startDate}
                </span>
              )}
              {item.endDate && !item.current && (
                <span>
                  {" - "}
                  {item.endDate}
                </span>
              )}
              {item.current && (
                <span>
                  {" - "}
                  {"Studying"}
                </span>
              )}
            </p>
            <p className={styles.para}>
              {item.score && (
                <span>
                  {"Score : "}
                  {item.score}
                </span>
              )}
            </p>
            {item.description && (
              <p className={cn(styles.para, "mt-1")}>{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : null;
};

const Skills = ({ resumeData }: TemplateProps) => {
  const { hardSkills, softSkills } = resumeData;
  return (
    <div className="flex flex-col space-y-4">
      {hardSkills && hardSkills.length > 0 && (
        <div>
          <p className={styles.heading}>Skills</p>
          <div className="flex flex-col space-y-1">
            {hardSkills?.map((item, index) => (
              <div key={"hardSkills-" + index}>
                <p className={styles.para}>{item.name}</p>
                {item.level != undefined && !item.levelDisabled && (
                  <div>
                    <span className="relative block h-1 w-full overflow-hidden rounded-full bg-background/75">
                      {" "}
                      <span
                        className="absolute left-0 top-0 h-full bg-primary"
                        style={{ width: (item.level + 1) * 20 + "%" }}
                      ></span>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {softSkills && softSkills.length > 0 && (
        <div>
          <p className={styles.heading}>Soft skills</p>
          <div className="flex flex-col space-y-1">
            {softSkills?.map((item, index) => (
              <div key={"hardSkills-" + index}>
                <p className={styles.para}>{item.name}</p>
                {item.level != undefined && !item.levelDisabled && (
                  <div>
                    <span className="relative block h-1 w-full overflow-hidden rounded-full bg-background/75">
                      <span
                        className="absolute left-0 top-0 h-full bg-primary"
                        style={{ width: (item.level + 1) * 20 + "%" }}
                      ></span>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SocialLinks = ({ resumeData }: TemplateProps) => {
  const { linkedin, github, instagram } = resumeData;
  return linkedin || github || instagram ? (
    <div className="mt-16 flex flex-col space-y-2">
      {linkedin && (
        <div>
          <div className="flex items-center justify-start space-x-1">
            <FaLinkedin />
            <span className={styles.subHeading}>LinkedIn</span>
          </div>
          <p className={styles.para}>{linkedin}</p>
        </div>
      )}
      {github && (
        <div>
          <div className="flex items-center justify-start space-x-1">
            <FaGithub />
            <span className={styles.subHeading}>Github</span>
          </div>
          <p className={styles.para}>{github}</p>
        </div>
      )}
      {instagram && (
        <div>
          <div className="flex items-center justify-start space-x-1">
            <FaInstagram />
            <span className={styles.subHeading}>Instagram</span>
          </div>
          <p className={styles.para}>{instagram}</p>
        </div>
      )}
    </div>
  ) : null;
};

export default ATSTemplate1;