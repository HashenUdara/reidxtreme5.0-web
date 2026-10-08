"use client";

import { useId, useState, type FormEvent } from "react";
import CustomSelect from "@/components/CustomSelect";
import { SectionHeader } from "@/components/SectionHeader";
import { cx } from "@/lib/cx";
import { motion } from "motion/react";

const YEARS = [
  { label: "Year 1", value: "1" },
  { label: "Year 2", value: "2" },
  { label: "Year 3", value: "3" },
  { label: "Year 4", value: "4" },
] as const;

type Member = {
  name: string;
  email: string;
  year: string;
  registrationNumber: string;
};

export type RegistrationSubmission = {
  teamName: string;
  teamLead: Member;
  members: Member[];
};

type RegistrationFormProps = {
  onSubmit?: (submission: RegistrationSubmission) => void | Promise<void>;
};

const blankMember = (): Member => ({ name: "", email: "", year: "", registrationNumber: "" });

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

type MemberFieldsProps = {
  fieldId: string;
  name: string;
  // Prefix for the screen-reader labels, e.g. "Team lead".
  who: string;
  member: Member;
  onChange: (field: keyof Member, value: string) => void;
};

function MemberFields({ fieldId, name, who, member, onChange }: MemberFieldsProps) {
  return (
    <>
      <div className={FIELD}>
        <label className="sr-only" htmlFor={`${fieldId}-name`}>
          {who} full name
        </label>
        <input
          autoComplete="name"
          className={CONTROL}
          id={`${fieldId}-name`}
          maxLength={100}
          name={`${name}[name]`}
          onChange={(event) => onChange("name", event.target.value)}
          placeholder="Full name"
          required
          value={member.name}
        />
      </div>
      <div className={FIELD}>
        <label className="sr-only" htmlFor={`${fieldId}-email`}>
          {who} email
        </label>
        <input
          autoComplete="email"
          className={CONTROL}
          id={`${fieldId}-email`}
          name={`${name}[email]`}
          onChange={(event) => onChange("email", event.target.value)}
          placeholder="Email address"
          required
          type="email"
          value={member.email}
        />
      </div>
      <div className="grid min-w-0 grid-cols-2 gap-[0.7rem] max-[420px]:grid-cols-1">
        <div className={FIELD}>
          <label className="sr-only" htmlFor={`${fieldId}-registration`}>
            {who} registration number
          </label>
          <input
            autoComplete="off"
            className={CONTROL}
            id={`${fieldId}-registration`}
            maxLength={40}
            name={`${name}[registrationNumber]`}
            onChange={(event) => onChange("registrationNumber", event.target.value)}
            placeholder="Registration number"
            required
            value={member.registrationNumber}
          />
        </div>
        <div className={FIELD}>
          <span className="sr-only" id={`${fieldId}-year-label`}>
            {who} year of study
          </span>
          <CustomSelect
            id={`${fieldId}-year`}
            labelId={`${fieldId}-year-label`}
            name={`${name}[year]`}
            onChange={(value) => onChange("year", value)}
            options={YEARS}
            placeholder="Year"
            required
            value={member.year}
          />
        </div>
      </div>
    </>
  );
}

export default function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const id = useId();
  const [teamLead, setTeamLead] = useState<Member>(blankMember);
  const [members, setMembers] = useState<Member[]>([]);
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

    if ([teamLead, ...members].some((member) => !member.year)) {
      setStatus("Choose a year of study for every member before continuing.");
      setIsError(true);
      return;
    }

    if (!onSubmit) {
      setStatus(
        "Your registration has not been sent. Connect an onSubmit handler to your registration endpoint.",
      );
      return;
    }

    const formData = new FormData(event.currentTarget);
    const submission: RegistrationSubmission = {
      teamName: String(formData.get("teamName") ?? ""),
      teamLead,
      members,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(submission);
      setStatus("Your team has been registered.");
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

  return (
    <motion.section
      id="registration"
      aria-labelledby={`${id}-heading`}
      className="w-full min-w-0"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <SectionHeader
        id={`${id}-heading`}
        title="Register Now!"
        className="mb-[clamp(1.5rem,4vw,2.5rem)]"
      />

      <div className="mx-auto w-full max-w-[520px] min-w-0 rounded-lg border border-line bg-panel p-[clamp(1rem,5vw,1.6rem)] shadow-[0_20px_55px_rgb(0_0_0/0.3),inset_0_1px_rgb(245_250_247/0.035)] backdrop-blur-md max-[420px]:p-[0.9rem]">
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

          <fieldset className={GROUP}>
            <legend className={LEGEND}>
              MEMBERS <span className={HINT}>(INPUT)</span>
            </legend>

            <div className={CARD}>
              <p className={CARD_HEADING}>TEAM LEAD</p>
              <MemberFields
                fieldId={`${id}-lead`}
                member={teamLead}
                name="teamLead"
                onChange={(field, value) =>
                  setTeamLead((current) => ({ ...current, [field]: value }))
                }
                who="Team lead"
              />
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
                  <MemberFields
                    fieldId={memberId}
                    member={member}
                    name={`members[${index}]`}
                    onChange={(field, value) => updateMember(index, field, value)}
                    who={`Team member ${index + 1}`}
                  />
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
          </fieldset>

          <button
            className="btn-primary h-auto min-h-13 w-full px-4 text-[clamp(0.68rem,3vw,0.8rem)] tracking-[0.06em] disabled:cursor-wait disabled:opacity-65"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "SUBMITTING..." : "CONNECT & REGISTER"}
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
        </form>
      </div>
    </motion.section>
  );
}
