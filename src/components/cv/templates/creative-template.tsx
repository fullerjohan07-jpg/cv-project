import { Mail, Phone, MapPin, Globe } from 'lucide-react'
import type { CVData } from '@/lib/cv-types'
import { dateRange } from '@/lib/cv-format'

export function CreativeTemplate({ data }: { data: CVData }) {
  const { personal, accent } = data

  return (
    <div className="cv-page mx-auto grid grid-cols-[270px_1fr] bg-white font-sans text-[13px] leading-relaxed text-slate-700">
      {/* Sidebar */}
      <aside
        className="flex flex-col gap-8 px-7 py-10 text-white"
        style={{ backgroundColor: accent }}
      >
        {personal.photo ? (
          <img
            src={personal.photo || '/placeholder.svg'}
            alt={personal.fullName || 'Photo de profil'}
            className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-white/30"
            crossOrigin="anonymous"
          />
        ) : null}

        <SideSection title="Contact">
          <ul className="flex flex-col gap-2 text-xs text-white/90">
            {personal.email ? (
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span className="break-all">{personal.email}</span>
              </li>
            ) : null}
            {personal.phone ? (
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{personal.phone}</span>
              </li>
            ) : null}
            {personal.location ? (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{personal.location}</span>
              </li>
            ) : null}
            {personal.website ? (
              <li className="flex items-start gap-2">
                <Globe className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span className="break-all">{personal.website}</span>
              </li>
            ) : null}
          </ul>
        </SideSection>

        {data.skills.length > 0 ? (
          <SideSection title="Compétences">
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </SideSection>
        ) : null}

        {data.languages.length > 0 ? (
          <SideSection title="Langues">
            <ul className="flex flex-col gap-1.5 text-xs">
              {data.languages.map((lang) => (
                <li key={lang.id} className="flex justify-between text-white/90">
                  <span className="font-medium text-white">{lang.name}</span>
                  <span>{lang.level}</span>
                </li>
              ))}
            </ul>
          </SideSection>
        ) : null}
      </aside>

      {/* Main */}
      <div className="flex flex-col gap-7 px-10 py-10">
        <header>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 text-balance">
            {personal.fullName || 'Votre nom'}
          </h1>
          {personal.title ? (
            <p className="mt-1 text-lg font-semibold" style={{ color: accent }}>
              {personal.title}
            </p>
          ) : null}
        </header>

        {data.summary ? (
          <Section title="Profil" accent={accent}>
            <p className="whitespace-pre-line">{data.summary}</p>
          </Section>
        ) : null}

        {data.experiences.length > 0 ? (
          <Section title="Expérience" accent={accent}>
            <div className="flex flex-col gap-5">
              {data.experiences.map((exp) => (
                <div key={exp.id} className="relative pl-4">
                  <span
                    className="absolute left-0 top-1.5 h-2 w-2 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold text-slate-900">
                      {exp.role || 'Poste'}
                    </h3>
                    <span className="shrink-0 text-xs text-slate-500">
                      {dateRange(exp)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    {[exp.company, exp.location].filter(Boolean).join(' · ')}
                  </p>
                  {exp.description ? (
                    <p className="mt-1.5 whitespace-pre-line text-slate-600">
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
            <div className="flex flex-col gap-5">
              {data.education.map((edu) => (
                <div key={edu.id} className="relative pl-4">
                  <span
                    className="absolute left-0 top-1.5 h-2 w-2 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold text-slate-900">
                      {edu.degree || 'Diplôme'}
                    </h3>
                    <span className="shrink-0 text-xs text-slate-500">
                      {dateRange(edu)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    {[edu.school, edu.location].filter(Boolean).join(' · ')}
                  </p>
                  {edu.description ? (
                    <p className="mt-1.5 whitespace-pre-line text-slate-600">
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
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-3 border-b border-white/25 pb-1.5 text-xs font-bold uppercase tracking-widest text-white">
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
        className="mb-3 text-xs font-bold uppercase tracking-widest"
        style={{ color: accent }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
