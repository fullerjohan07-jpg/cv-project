import type { CVData } from '@/lib/cv-types'
import { dateRange } from '@/lib/cv-format'

export function ClassicTemplate({ data }: { data: CVData }) {
  const { personal, accent } = data
  const contact = [
    personal.email,
    personal.phone,
    personal.location,
    personal.website,
  ].filter(Boolean)

  return (
    <div className="cv-page mx-auto bg-white px-14 py-12 font-serif text-[13px] leading-relaxed text-neutral-700">
      {/* Header */}
      <header className="flex flex-col items-center gap-3 text-center">
        {personal.photo ? (
          <img
            src={personal.photo || '/placeholder.svg'}
            alt={personal.fullName || 'Photo de profil'}
            className="h-28 w-28 rounded-full object-cover"
            crossOrigin="anonymous"
          />
        ) : null}
        <div>
          <h1 className="text-4xl font-bold tracking-wide text-neutral-900 text-balance">
            {personal.fullName || 'Votre nom'}
          </h1>
          {personal.title ? (
            <p className="mt-1 text-base uppercase tracking-[0.2em] text-neutral-500">
              {personal.title}
            </p>
          ) : null}
        </div>
        {contact.length > 0 ? (
          <p className="max-w-xl font-sans text-xs text-neutral-500">
            {contact.join('  ·  ')}
          </p>
        ) : null}
      </header>

      <div
        className="my-8 h-px w-full"
        style={{ backgroundColor: accent }}
        aria-hidden
      />

      <div className="flex flex-col gap-8">
        {data.summary ? (
          <Section title="Profil" accent={accent}>
            <p className="whitespace-pre-line text-justify">{data.summary}</p>
          </Section>
        ) : null}

        {data.experiences.length > 0 ? (
          <Section title="Expérience professionnelle" accent={accent}>
            <div className="flex flex-col gap-5">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-base font-bold text-neutral-900">
                      {exp.role || 'Poste'}
                    </h3>
                    <span className="shrink-0 font-sans text-xs italic text-neutral-500">
                      {dateRange(exp)}
                    </span>
                  </div>
                  <p className="italic text-neutral-600">
                    {[exp.company, exp.location].filter(Boolean).join(', ')}
                  </p>
                  {exp.description ? (
                    <p className="mt-1.5 whitespace-pre-line text-justify text-neutral-600">
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
                    <h3 className="text-base font-bold text-neutral-900">
                      {edu.degree || 'Diplôme'}
                    </h3>
                    <span className="shrink-0 font-sans text-xs italic text-neutral-500">
                      {dateRange(edu)}
                    </span>
                  </div>
                  <p className="italic text-neutral-600">
                    {[edu.school, edu.location].filter(Boolean).join(', ')}
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

        <div className="grid grid-cols-2 gap-8">
          {data.skills.length > 0 ? (
            <Section title="Compétences" accent={accent}>
              <ul className="columns-1 space-y-1">
                {data.skills.map((skill) => (
                  <li key={skill} className="flex items-baseline gap-2">
                    <span style={{ color: accent }}>▪</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {data.languages.length > 0 ? (
            <Section title="Langues" accent={accent}>
              <ul className="space-y-1">
                {data.languages.map((lang) => (
                  <li key={lang.id} className="flex justify-between">
                    <span>{lang.name}</span>
                    <span className="italic text-neutral-500">{lang.level}</span>
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
        className="mb-3 text-sm font-bold uppercase tracking-[0.15em]"
        style={{ color: accent }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
