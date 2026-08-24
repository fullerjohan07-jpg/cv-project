import { Mail, Phone, MapPin, Globe } from 'lucide-react'
import type { CVData } from '@/lib/cv-types'
import { dateRange } from '@/lib/cv-format'

export function ModernTemplate({ data }: { data: CVData }) {
  const { personal, accent } = data

  return (
    <div className="cv-page mx-auto bg-white font-sans text-[13px] leading-relaxed text-slate-700">
      {/* Header */}
      <header
        className="flex items-center gap-6 px-12 py-10"
        style={{ borderTop: `6px solid ${accent}` }}
      >
        {personal.photo ? (
          <img
            src={personal.photo || '/placeholder.svg'}
            alt={personal.fullName || 'Photo de profil'}
            className="h-24 w-24 shrink-0 rounded-full object-cover"
            crossOrigin="anonymous"
          />
        ) : null}
        <div className="min-w-0">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 text-balance">
            {personal.fullName || 'Votre nom'}
          </h1>
          {personal.title ? (
            <p className="mt-1 text-lg font-medium" style={{ color: accent }}>
              {personal.title}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
            {personal.email ? (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" style={{ color: accent }} />
                {personal.email}
              </span>
            ) : null}
            {personal.phone ? (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" style={{ color: accent }} />
                {personal.phone}
              </span>
            ) : null}
            {personal.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" style={{ color: accent }} />
                {personal.location}
              </span>
            ) : null}
            {personal.website ? (
              <span className="inline-flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" style={{ color: accent }} />
                {personal.website}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-[1fr_260px] gap-10 px-12 pb-12">
        {/* Main column */}
        <div className="flex flex-col gap-7">
          {data.summary ? (
            <Section title="Profil" accent={accent}>
              <p className="whitespace-pre-line">{data.summary}</p>
            </Section>
          ) : null}

          {data.experiences.length > 0 ? (
            <Section title="Expérience" accent={accent}>
              <div className="flex flex-col gap-5">
                {data.experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-semibold text-slate-900">
                        {exp.role || 'Poste'}
                      </h3>
                      <span className="shrink-0 text-xs text-slate-500">
                        {dateRange(exp)}
                      </span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: accent }}>
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
                  <div key={edu.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-semibold text-slate-900">
                        {edu.degree || 'Diplôme'}
                      </h3>
                      <span className="shrink-0 text-xs text-slate-500">
                        {dateRange(edu)}
                      </span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: accent }}>
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

        {/* Sidebar */}
        <div className="flex flex-col gap-7">
          {data.skills.length > 0 ? (
            <Section title="Compétences" accent={accent}>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md px-2.5 py-1 text-xs font-medium"
                    style={{ backgroundColor: `${accent}15`, color: accent }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Section>
          ) : null}

          {data.languages.length > 0 ? (
            <Section title="Langues" accent={accent}>
              <ul className="flex flex-col gap-2">
                {data.languages.map((lang) => (
                  <li key={lang.id} className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">{lang.name}</span>
                    <span className="text-xs text-slate-500">{lang.level}</span>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </div>
      </div>
    </div>
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
