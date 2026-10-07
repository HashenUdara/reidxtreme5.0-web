"use client";

import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import CustomSelect from "./CustomSelect";
import styles from "./RegistrationForm.module.css";

const PROJECT_TRACKS = [
  { label: "Progress Through Code", value: "Progress Through Code" },
  { label: "Resourcefulness", value: "Resourcefulness" },
  { label: "Isolation & Connection", value: "Isolation & Connection" },
  { label: "Tech-Enabled Solutions", value: "Tech-Enabled Solutions" },
] as const;

const SKILLS = [
  "Frontend",
  "Backend",
  "Data/AI",
  "Cloud Architecture",
  "UI/UX Design",
] as const;

type Member = {
  name: string;
  email: string;
};

export type RegistrationSubmission = {
  teamName: string;
  projectFocus: string;
  teamLead: Member;
  members: Member[];
  skills: string[];
  profileFile: File | null;
};

type RegistrationFormProps = {
  onSubmit?: (submission: RegistrationSubmission) => void | Promise<void>;
};

const blankMember = (): Member => ({ name: "", email: "" });

export default function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const id = useId();
  const [members, setMembers] = useState<Member[]>([]);
  const [projectFocus, setProjectFocus] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateMember(index: number, field: keyof Member, value: string) {
    setMembers((current) =>
      current.map((member, currentIndex) =>
        currentIndex === index ? { ...member, [field]: value } : member,
      ),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsError(false);

    if (!projectFocus) {
      setStatus("Choose a project focus before continuing.");
      setIsError(true);
      return;
    }

    if (!onSubmit) {
      setStatus(
        "Your proposal has not been sent. Connect an onSubmit handler to your registration endpoint.",
      );
      return;
    }

    const formData = new FormData(event.currentTarget);
    const submission: RegistrationSubmission = {
      teamName: String(formData.get("teamName") ?? ""),
      projectFocus: String(formData.get("projectFocus") ?? ""),
      teamLead: {
        name: String(formData.get("teamLeadName") ?? ""),
        email: String(formData.get("teamLeadEmail") ?? ""),
      },
      members,
      skills: formData.getAll("skills").map(String),
      profileFile,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(submission);
      setStatus("Your project proposal has been submitted.");
    } catch (error) {
      setIsError(true);
      setStatus(
        error instanceof Error
          ? `Submission failed: ${error.message}`
          : "Submission failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleProfileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setStatus("");
    setIsError(false);

    if (file && file.size > 5 * 1024 * 1024) {
      event.currentTarget.value = "";
      setProfileFile(null);
      setStatus("Profile image must be 5 MB or smaller.");
      setIsError(true);
      return;
    }

    setProfileFile(file ?? null);
  }

  return (
    <section id="registration" className={styles.section} aria-labelledby={`${id}-heading`}>
      <h2 className={styles.sectionTitle} id={`${id}-heading`}>
        REGISTRATION FORM:
      </h2>

      <div className={styles.panel}>
        <div className={styles.badge}>PROJECT PROPOSAL HOLOGRAM</div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${id}-team-name`}>
              TEAM NAME <span>(INPUT)</span>
            </label>
            <input
              autoComplete="organization"
              className={styles.control}
              id={`${id}-team-name`}
              maxLength={80}
              name="teamName"
              placeholder="Enter your team name"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} id={`${id}-project-focus-label`}>
              PROJECT FOCUS <span>(DROPDOWN)</span>
            </label>
            <CustomSelect
              id={`${id}-project-focus`}
              labelId={`${id}-project-focus-label`}
              name="projectFocus"
              onChange={setProjectFocus}
              options={PROJECT_TRACKS}
              placeholder="Choose a project track"
              required
              value={projectFocus}
            />
          </div>

          <fieldset className={styles.members}>
            <legend className={styles.label}>
              MEMBERS <span>(INPUT / PROFILE UPLOAD)</span>
            </legend>

            <div className={styles.memberCard}>
              <p className={styles.memberHeading}>TEAM LEAD</p>
              <div className={styles.field}>
                <label className={styles.visuallyHidden} htmlFor={`${id}-lead-name`}>
                  Team lead full name
                </label>
                <input
                  autoComplete="name"
                  className={styles.control}
                  id={`${id}-lead-name`}
                  maxLength={100}
                  name="teamLeadName"
                  placeholder="Team lead full name"
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.visuallyHidden} htmlFor={`${id}-lead-email`}>
                  Team lead email
                </label>
                <input
                  autoComplete="email"
                  className={styles.control}
                  id={`${id}-lead-email`}
                  name="teamLeadEmail"
                  placeholder="Team lead email address"
                  required
                  type="email"
                />
              </div>
            </div>

            {members.map((member, index) => {
              const memberId = `${id}-member-${index + 1}`;

              return (
                <div className={styles.memberCard} key={memberId}>
                  <div className={styles.memberCardHeading}>
                    <p className={styles.memberHeading}>
                      TEAM MEMBER {String(index + 1).padStart(2, "0")}
                    </p>
                    <button
                      aria-label={`Remove team member ${index + 1}`}
                      className={styles.removeButton}
                      onClick={() =>
                        setMembers((current) =>
                          current.filter((_, currentIndex) => currentIndex !== index),
                        )
                      }
                      type="button"
                    >
                      REMOVE
                    </button>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.visuallyHidden} htmlFor={`${memberId}-name`}>
                      Team member {index + 1} full name
                    </label>
                    <input
                      autoComplete="name"
                      className={styles.control}
                      id={`${memberId}-name`}
                      maxLength={100}
                      name={`members[${index}][name]`}
                      onChange={(event) => updateMember(index, "name", event.target.value)}
                      placeholder="Full name"
                      required
                      value={member.name}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.visuallyHidden} htmlFor={`${memberId}-email`}>
                      Team member {index + 1} email
                    </label>
                    <input
                      autoComplete="email"
                      className={styles.control}
                      id={`${memberId}-email`}
                      name={`members[${index}][email]`}
                      onChange={(event) => updateMember(index, "email", event.target.value)}
                      placeholder="Email address"
                      required
                      type="email"
                      value={member.email}
                    />
                  </div>
                </div>
              );
            })}

            <button
              className={styles.addButton}
              onClick={() => setMembers((current) => [...current, blankMember()])}
              type="button"
            >
              <span aria-hidden="true">+</span> ADD TEAM MEMBER
            </button>

            <div className={styles.profileField}>
              <label className={styles.label} htmlFor={`${id}-profile`}>
                TEAM PROFILE IMAGE <span>(OPTIONAL, MAX 5 MB)</span>
              </label>
              <input
                accept="image/*"
                className={styles.fileInput}
                id={`${id}-profile`}
                name="profileFile"
                onChange={handleProfileChange}
                type="file"
              />
              {profileFile && (
                <p className={styles.fileName} aria-live="polite">
                  Selected: {profileFile.name}
                </p>
              )}
            </div>
          </fieldset>

          <fieldset className={styles.members}>
            <legend className={styles.label}>
              SKILLS MATRIX <span>(CHECKBOX SELECT)</span>
            </legend>
            <div className={styles.skillsBox}>
              {SKILLS.map((skill, index) => {
                const skillId = `${id}-skill-${index}`;

                return (
                  <label className={styles.skill} htmlFor={skillId} key={skill}>
                    <input id={skillId} name="skills" type="checkbox" value={skill} />
                    <span className={styles.checkmark} aria-hidden="true">
                      <svg viewBox="0 0 16 16" focusable="false">
                        <path d="m3.25 8.25 3 3 6.5-6.5" />
                      </svg>
                    </span>
                    <span>{skill}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <button className={styles.submit} disabled={isSubmitting} type="submit">
            {isSubmitting ? "SUBMITTING..." : "CONNECT & REGISTER YOUR PROJECT"}
          </button>

          <p
            aria-live="polite"
            className={isError ? styles.errorMessage : styles.statusMessage}
            role={isError ? "alert" : "status"}
          >
            {status}
          </p>

          <p className={styles.callout}>
            CHASM-CROSSING MANIFESTO: SUBMIT YOUR PROPOSAL.
          </p>
        </form>
      </div>
    </section>
  );
}