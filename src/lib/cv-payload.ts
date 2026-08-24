import type { CVData } from "./cv-types";
import type { CVPayload } from "./career-schemas";

/** Version allégée du CV envoyée à l'IA (sans photo ni ids). */
export function toCVPayload(data: CVData): CVPayload {
  return {
    personal: {
      fullName: data.personal.fullName,
      title: data.personal.title,
      email: data.personal.email,
      phone: data.personal.phone,
      location: data.personal.location,
      website: data.personal.website,
    },
    summary: data.summary,
    experiences: data.experiences.map((e) => ({
      role: e.role,
      company: e.company,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate,
      current: e.current,
      description: e.description,
    })),
    education: data.education.map((e) => ({
      degree: e.degree,
      school: e.school,
      startDate: e.startDate,
      endDate: e.endDate,
      description: e.description,
    })),
    skills: data.skills,
    languages: data.languages.map((l) => ({ name: l.name, level: l.level })),
  };
}

export function completeness(data: CVData): number {
  const checks = [
    Boolean(data.personal.fullName),
    Boolean(data.personal.title),
    Boolean(data.personal.email),
    Boolean(data.personal.phone),
    Boolean(data.summary),
    data.experiences.length > 0,
    data.education.length > 0,
    data.skills.length >= 3,
    data.languages.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
