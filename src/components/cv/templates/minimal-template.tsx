import { Mail, Phone, MapPin, Globe } from 'lucide-react'
import type { CVData } from '@/lib/cv-types'
import { dateRange } from '@/lib/cv-format'

export function MinimalTemplate({ data }: { data: CVData }) {
  const { personal, accent } = data
  const contact = [personal.email, personal.phone, personal.location, personal.website].filter(
    Boolean,
  )

  return (
    <div className="cv-page mx-auto bg-white px-[4.5rem] py-16 font-sans text-[13px] leading-relaxed text-neutral-700">
      <p
        className="mb-6 text-[11px] font-semibold uppercase tracking-[0.35em]"
        style={{ color: accent }}
      >
        Curriculum Vitae
      </p>

      <header className="flex items-start justify-between gap-8 border-b border-neutral-200 pb-7">
        <div>
          <h1 className="font-serif text-4xl font-medium leading-none tracking-tight text-neutral-900 text-balance">
            {personal.fullName || 'Votre nom'}
          </h1>
          {personal.title ? (
            <p className="mt-2.5 text-sm font-medium tracking-wide" style={{ color: accent }}>
              {personal.title}
            </p>
          ) : null}
        </div>
        {personal.photo ? (
          <img
            src={personal.photo || '/placeholder.svg'}
            alt={personal.fullName || 'Photo de profil'}
            className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-full object-cover"
            crossOrigin="anonymous"
          />
        ) : null}
      </header>

      {contact.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-neutral-500">
          {personal.email ? (
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3 w-3" /> {personal.email}
            </span>
          ) : null}
          {personal.phone ? (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3 w-3" /> {personal.phone}
            </span>
          ) : null}
          {personal.location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> {personal.location}
            </span>
          ) : null}
          {personal.website ? (
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3 w-3" /> {personal.website}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-10 flex flex-col gap-10">
        {data.summary ? (
          <Section num="01" title="Profil" accent={accent}>
            <p className="whitespace-pre-line text-neutral-600">{data.summary}</p>
          </Section>
        ) : null}

        {data.experiences.length > 0 ? (
          <Section num="02" title="Expérience" accent={accent}>
            <div className="flex flex-col gap-7">
              {data.experiences.map((exp) => (
                <div key={exp.id} className="grid grid-cols-[110px_1fr] gap-5">
                  <span className="pt-0.5 text-xs font-medium tracking-wide text-neutral-400">
                    {dateRange(exp)}
                  </span>
                  <div>
                    <h3 className="font-medium text-neutral-900">{exp.role || 'Poste'}</h3>
                    <p className="text-xs uppercase tracking-wide text-neutral-500">
                      {[exp.company, exp.location].filter(Boolean).join(' · ')}
                    </p>
                    {exp.description ? (
                      <p className="mt-2 whitespace-pre-line text-neutral-600">
                        {exp.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {data.education.length > 0 ? (
          <Section num="03" title="Formation" accent={accent}>
            <div className="flex flex-col gap-7">
              {data.education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-[110px_1fr] gap-5">
                  <span className="pt-0.5 text-xs font-medium tracking-wide text-neutral-400">
                    {dateRange(edu)}
                  </span>
                  <div>
                    <h3 className="font-medium text-neutral-900">{edu.degree || 'Diplôme'}</h3>
                    <p className="text-xs uppercase tracking-wide text-neutral-500">
                      {[edu.school, edu.location].filter(Boolean).join(' · ')}
                    </p>
                    {edu.description ? (
                      <p className="mt-2 whitespace-pre-line text-neutral-600">
                        {edu.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        <div className="grid grid-cols-2 gap-10">
          {data.skills.length > 0 ? (
            <Section num="04" title="Compétences" accent={accent}>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {data.skills.map((skill) => (
                  <span key={skill} className="text-neutral-600">
                    {skill}
                  </span>
                ))}
              </div>
            </Section>
          ) : null}

          {data.languages.length > 0 ? (
            <Section num="05" title="Langues" accent={accent}>
              <ul className="flex flex-col gap-1">
                {data.languages.map((lang) => (
                  <li key={lang.id} className="flex justify-between">
                    <span className="text-neutral-800">{lang.name}</span>
                    <span className="text-neutral-400">{lang.level}</span>
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
  num,
  title,
  accent,
  children,
}: {
  num: string
  title: string
  accent: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-4 flex items-baseline gap-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
        <span className="font-serif text-sm font-medium not-italic" style={{ color: accent }}>
          {num}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}