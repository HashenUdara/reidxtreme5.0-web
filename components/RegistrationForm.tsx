"use client";

import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import CustomSelect from "@/components/CustomSelect";
import { SectionHeader } from "@/components/SectionHeader";
import { cx } from "@/lib/cx";

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

// Form building blocks, styled after DESIGN.md §25.
const FIELD = "grid min-w-0 gap-[0.45rem]";
const LABEL = "m-0 block p-0 font-display text-[1.05rem] font-bold tracking-[0.1em] text-white";
const HINT = "font-sans text-[0.67rem] font-normal tracking-[0.015em] text-muted";
const CONTROL =
  "block min-h-[2.9rem] w-full min-w-0 rounded-sm border border-line bg-bg/65 px-[0.85rem] py-[0.72rem] font-sans text-[0.85rem] leading-[1.4] text-body transition-[border-color,box-shadow] duration-180 placeholder:text-muted/80 focus:border-mint focus:shadow-[0_0_12px_rgb(140_245_189/0.25)]";
const GROUP = "m-0 grid min-w-0 gap-[0.8rem] border-0 p-0 after:clear-both after:block";
// Floated so the legend sits inside the fieldset's grid like a normal label.
const LEGEND = `${LABEL} float-left mb-[0.8rem] w-full`;
const CARD = "grid min-w-0 gap-[0.7rem] rounded-md border border-emerald/28 bg-bg/42 p-[0.85rem]";
const CARD_HEADING = "m-0 font-display text-[0.9rem] font-semibold tracking-[0.1em] text-mint";
const SMALL_BUTTON =
  "w-fit cursor-pointer rounded-sm border bg-transparent font-sans font-semibold tracking-[0.07em] transition-[opacity,transform] duration-180 hover:-translate-y-px hover:opacity-78";

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
    <section id="registration" aria-labelledby={`${id}-heading`} className="w-full min-w-0">
      <SectionHeader
        id={`${id}-heading`}
        title="Register Now!"
        className="mb-[clamp(1.5rem,4vw,2.5rem)]"
      />

      <div className="mx-auto w-full max-w-[520px] min-w-0 rounded-lg border border-line bg-panel p-[clamp(1rem,5vw,1.6rem)] shadow-[0_20px_55px_rgb(0_0_0/0.3),inset_0_1px_rgb(245_250_247/0.035)] backdrop-blur-md max-[420px]:p-[0.9rem]">
        <div className="mx-auto mb-6 w-fit max-w-full rounded-full border border-mint/50 bg-bg/70 px-4 py-[0.55rem] text-center font-display text-[0.95rem] font-semibold tracking-[0.14em] text-mint">
          PROJECT PROPOSAL HOLOGRAM
        </div>

        <form className="grid min-w-0 gap-[1.15rem]" onSubmit={handleSubmit}>
          <div className={FIELD}>
            <label className={LABEL} htmlFor={`${id}-team-name`}>
              TEAM NAME <span className={HINT}>(INPUT)</span>
            </label>
            <input
              autoComplete="organization"
              className={CONTROL}
              id={`${id}-team-name`}
              maxLength={80}
              name="teamName"
              placeholder="Enter your team name"
              required
            />
          </div>

          <div className={FIELD}>
            <label className={LABEL} id={`${id}-project-focus-label`}>
              PROJECT FOCUS <span className={HINT}>(DROPDOWN)</span>
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

          <fieldset className={GROUP}>
            <legend className={LEGEND}>
              MEMBERS <span className={HINT}>(INPUT / PROFILE UPLOAD)</span>
            </legend>

            <div className={CARD}>
              <p className={CARD_HEADING}>TEAM LEAD</p>
              <div className={FIELD}>
                <label className="sr-only" htmlFor={`${id}-lead-name`}>
                  Team lead full name
                </label>
                <input
                  autoComplete="name"
                  className={CONTROL}
                  id={`${id}-lead-name`}
                  maxLength={100}
                  name="teamLeadName"
                  placeholder="Team lead full name"
                  required
                />
              </div>
              <div className={FIELD}>
                <label className="sr-only" htmlFor={`${id}-lead-email`}>
                  Team lead email
                </label>
                <input
                  autoComplete="email"
                  className={CONTROL}
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
                <div className={CARD} key={memberId}>
                  <div className="flex items-center justify-between gap-2">
                    <p className={CARD_HEADING}>
                      TEAM MEMBER {String(index + 1).padStart(2, "0")}
                    </p>
                    <button
                      aria-label={`Remove team member ${index + 1}`}
                      className={cx(
                        SMALL_BUTTON,
                        "min-h-[1.8rem] border-muted/28 px-2 py-[0.3rem] text-[0.6rem] text-muted",
                      )}
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
                  <div className={FIELD}>
                    <label className="sr-only" htmlFor={`${memberId}-name`}>
                      Team member {index + 1} full name
                    </label>
                    <input
                      autoComplete="name"
                      className={CONTROL}
                      id={`${memberId}-name`}
                      maxLength={100}
                      name={`members[${index}][name]`}
                      onChange={(event) => updateMember(index, "name", event.target.value)}
                      placeholder="Full name"
                      required
                      value={member.name}
                    />
                  </div>
                  <div className={FIELD}>
                    <label className="sr-only" htmlFor={`${memberId}-email`}>
                      Team member {index + 1} email
                    </label>
                    <input
                      autoComplete="email"
                      className={CONTROL}
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
              className={cx(
                SMALL_BUTTON,
                "min-h-9 justify-self-start border-mint/40 px-[0.7rem] py-[0.45rem] text-[0.68rem] text-mint",
              )}
              onClick={() => setMembers((current) => [...current, blankMember()])}
              type="button"
            >
              <span aria-hidden="true" className="pr-1 text-base">
                +
              </span>{" "}
              ADD TEAM MEMBER
            </button>

            <div className="mt-[0.2rem] grid min-w-0 gap-2">
              <label className={LABEL} htmlFor={`${id}-profile`}>
                TEAM PROFILE IMAGE <span className={HINT}>(OPTIONAL, MAX 5 MB)</span>
              </label>
              <input
                accept="image/*"
                className="block w-full min-w-0 font-sans text-xs text-muted file:mr-[0.65rem] file:min-h-9 file:cursor-pointer file:rounded-sm file:border file:border-mint/40 file:bg-mint/7 file:px-[0.65rem] file:py-[0.4rem] file:[font:inherit] file:text-mint"
                id={`${id}-profile`}
                name="profileFile"
                onChange={handleProfileChange}
                type="file"
              />
              {profileFile && (
                <p className="m-0 text-xs [overflow-wrap:anywhere] text-mint" aria-live="polite">
                  Selected: {profileFile.name}
                </p>
              )}
            </div>
          </fieldset>

          <fieldset className={GROUP}>
            <legend className={LEGEND}>
              SKILLS MATRIX <span className={HINT}>(CHECKBOX SELECT)</span>
            </legend>
            <div
              className={cx(
                CARD,
                "grid-cols-2 gap-x-[0.65rem] gap-y-[0.1rem] p-3 max-[420px]:grid-cols-1",
              )}
            >
              {SKILLS.map((skill, index) => {
                const skillId = `${id}-skill-${index}`;

                return (
                  <label
                    className="relative flex min-h-[2.65rem] min-w-0 cursor-pointer items-center gap-[0.6rem] text-[0.78rem] leading-[1.35] text-body"
                    htmlFor={skillId}
                    key={skill}
                  >
                    <input
                      className="peer absolute inset-0 m-0 size-full cursor-pointer opacity-0"
                      id={skillId}
                      name="skills"
                      type="checkbox"
                      value={skill}
                    />
                    <span
                      className="grid size-[1.05rem] flex-none place-items-center rounded-sm border border-muted/58 text-bg peer-checked:border-mint peer-checked:bg-mint peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-mint peer-checked:[&>svg]:opacity-100"
                      aria-hidden="true"
                    >
                      <svg
                        className="size-[0.8rem] fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] opacity-0"
                        viewBox="0 0 16 16"
                        focusable="false"
                      >
                        <path d="m3.25 8.25 3 3 6.5-6.5" />
                      </svg>
                    </span>
                    <span className="[overflow-wrap:anywhere]">{skill}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <button
            className="btn-primary h-auto min-h-13 w-full px-4 text-[clamp(0.68rem,3vw,0.8rem)] tracking-[0.06em] disabled:cursor-wait disabled:opacity-65"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "SUBMITTING..." : "CONNECT & REGISTER YOUR PROJECT"}
          </button>

          <p
            aria-live="polite"
            className={cx(
              "-mt-[0.6rem] min-h-[1.2em] text-center text-[0.78rem] leading-normal",
              isError ? "text-[#ffb4a8]" : "text-mint",
            )}
            role={isError ? "alert" : "status"}
          >
            {status}
          </p>

          <p className="m-0 text-center font-display text-[clamp(1rem,4vw,1.2rem)] leading-tight font-bold tracking-[0.075em] text-mint">
            CHASM-CROSSING MANIFESTO: SUBMIT YOUR PROPOSAL.
          </p>
        </form>
      </div>
    </section>
  );
}
