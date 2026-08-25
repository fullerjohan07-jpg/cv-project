import { Mail, Phone, MapPin, Globe } from 'lucide-react'
import type { CVData } from '@/lib/cv-types'
import { dateRange } from '@/lib/cv-format'

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
}

export function ExecutiveTemplate({ data }: { data: CVData }) {
  const { personal, accent } = data

  return (
    <div className="cv-page mx-auto grid grid-cols-[260px_1fr] bg-white font-sans text-[13px] leading-relaxed text-slate-700">
      {/* Sidebar */}
      <aside className="flex flex-col gap-9 bg-neutral-900 px-7 py-11">
        {personal.photo ? (
          <img
            src={personal.photo || '/placeholder.svg'}
            alt={personal.fullName || 'Photo de profil'}
            className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-white/10"
            crossOrigin="anonymous"
          />
        ) : (
          <div
            className="mx-auto flex h-28 w-28 items-center justify-center rounded-full text-3xl font-semibold text-neutral-900 ring-4 ring-white/10"
            style={{ backgroundColor: accent }}
          >
            {initials(personal.fullName) || 'CV'}
          </div>
        )}

        <SideSection title="Contact" accent={accent}>
          <ul className="flex flex-col gap-2.5 text-xs text-neutral-300">
            {personal.email ? (
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
                <span className="break-all">{personal.email}</span>
              </li>
            ) : null}
            {personal.phone ? (
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
                <span>{personal.phone}</span>
              </li>
            ) : null}
            {personal.location ? (
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
                <span>{personal.location}</span>
              </li>
            ) : null}
            {personal.website ? (
              <li className="flex items-start gap-2.5">
                <Globe className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
                <span className="break-all">{personal.website}</span>
              </li>
            ) : null}
          </ul>
        </SideSection>

        {data.skills.length > 0 ? (
          <SideSection title="Compétences" accent={accent}>
            <ul className="flex flex-col gap-3">
              {data.skills.map((skill) => (
                <li key={skill}>
                  <div className="mb-1 flex items-center justify-between text-xs text-neutral-300">
                    <span>{skill}</span>
                  </div>
                  <div className="h-[3px] w-full rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{ width: '82%', backgroundColor: accent }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </SideSection>
        ) : null}

        {data.languages.length > 0 ? (
          <SideSection title="Langues" accent={accent}>
            <ul className="flex flex-col gap-1.5 text-xs text-neutral-300">
              {data.languages.map((lang) => (
                <li key={lang.id} className="flex justify-between">
                  <span className="font-medium text-white">{lang.name}</span>
                  <span>{lang.level}</span>
                </li>
              ))}
            </ul>
          </SideSection>
        ) : null}

        <div className="mt-auto flex items-center gap-2 border-t border-white/10 pt-4">
          <div
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: accent }}
          />
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            Curriculum Vitae
          </span>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col gap-8 px-11 py-11">
        <header className="border-b pb-5" style={{ borderColor: accent }}>
          <h1 className="text-[2.6rem] font-bold leading-tight tracking-tight text-neutral-900 text-balance">
            {personal.fullName || 'Votre nom'}
          </h1>
          {personal.title ? (
            <p className="mt-1.5 text-base font-medium uppercase tracking-[0.18em] text-neutral-500">
              {personal.title}
            </p>
          ) : null}
        </header>

        {data.summary ? (
          <Section title="Profil" accent={accent}>
            <p className="whitespace-pre-line text-neutral-600">{data.summary}</p>
          </Section>
        ) : null}

        {data.experiences.length > 0 ? (
          <Section title="Expérience" accent={accent}>
            <div className="relative flex flex-col gap-7 border-l border-neutral-200 pl-6">
              {data.experiences.map((exp) => (
                <div key={exp.id} className="relative">
                  <span
                    className="absolute -left-[29px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white"
                    style={{ backgroundColor: accent }}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <h3 className="font-semibold text-neutral-900">{exp.role || 'Poste'}</h3>
                    <span className="shrink-0 text-xs font-medium tracking-wide text-neutral-400">
                      {dateRange(exp)}
                    </span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: accent }}>
                    {[exp.company, exp.location].filter(Boolean).join(' · ')}
                  </p>
                  {exp.description ? (
                    <p className="mt-1.5 whitespace-pre-line text-neutral-600">
                      {exp.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {data.education.length > 0 ? (
          <Section title="Formation" accent={accent}>
            <div className="relative flex flex-col gap-7 border-l border-neutral-200 pl-6">
              {data.education.map((edu) => (
                <div key={edu.id} className="relative">
                  <span
                    className="absolute -left-[29px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white"
                    style={{ backgroundColor: accent }}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <h3 className="font-semibold text-neutral-900">{edu.degree || 'Diplôme'}</h3>
                    <span className="shrink-0 text-xs font-medium tracking-wide text-neutral-400">
                      {dateRange(edu)}
                    </span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: accent }}>
                    {[edu.school, edu.location].filter(Boolean).join(' · ')}
                  </p>
                  {edu.description ? (
                    <p className="mt-1.5 whitespace-pre-line text-neutral-600">
                      {edu.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </Section>
        ) : null}
      </div>
    </div>
  )
}

function SideSection({
  title,
  accent,
  children,
}: {
  title: string
  accent: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function Section({
  title,
  accent,
  children,
}: {
  title: string
  accent: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2
        className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
        style={{ color: accent }}
      >
        {title}
        <span className="h-px flex-1" style={{ backgroundColor: `${accent}30` }} />
      </h2>
      {children}
    </section>
  )
}