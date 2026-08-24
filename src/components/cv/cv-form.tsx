'use client'

import type React from 'react'
import { useRef } from 'react'
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  LayoutTemplate,
  Plus,
  Trash2,
  X,
  Upload,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, TextInput, TextArea, Select } from '@/components/ui/form-controls'
import {
  type CVData,
  type TemplateId,
  ACCENT_COLORS,
  LANGUAGE_LEVELS,
  uid,
} from '@/lib/cv-types'
import { cn } from '@/lib/utils'

type Updater = (fn: (prev: CVData) => CVData) => void

const STEPS = [
  { id: 'template', label: 'Modèle', icon: LayoutTemplate },
  { id: 'personal', label: 'Infos', icon: User },
  { id: 'summary', label: 'Profil', icon: FileText },
  { id: 'experience', label: 'Expérience', icon: Briefcase },
  { id: 'education', label: 'Formation', icon: GraduationCap },
  { id: 'skills', label: 'Compétences', icon: Sparkles },
] as const

export function CVForm({
  data,
  update,
  step,
  setStep,
}: {
  data: CVData
  update: Updater
  step: number
  setStep: (s: number) => void
}) {
  const total = STEPS.length
  const Current = STEPS[Math.min(Math.max(step, 0), STEPS.length - 1)]!

  return (
    <div className="flex h-full flex-col">
      {/* Stepper */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-5 py-3">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const active = i === step
          const done = i < step
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(i)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : done
                    ? 'text-primary hover:bg-accent'
                    : 'text-muted-foreground hover:bg-accent',
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-foreground">
            {stepTitle(Current.id)}
          </h2>
          <p className="text-sm text-muted-foreground">{stepHint(Current.id)}</p>
        </div>

        {Current.id === 'template' && <TemplateStep data={data} update={update} />}
        {Current.id === 'personal' && <PersonalStep data={data} update={update} />}
        {Current.id === 'summary' && <SummaryStep data={data} update={update} />}
        {Current.id === 'experience' && <ExperienceStep data={data} update={update} />}
        {Current.id === 'education' && <EducationStep data={data} update={update} />}
        {Current.id === 'skills' && <SkillsStep data={data} update={update} />}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between border-t border-border px-6 py-4">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </Button>
        <span className="text-xs text-muted-foreground">
          Étape {step + 1} / {total}
        </span>
        <Button
          onClick={() => setStep(Math.min(total - 1, step + 1))}
          disabled={step === total - 1}
        >
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function stepTitle(id: string) {
  return {
    template: 'Choisissez un modèle',
    personal: 'Informations personnelles',
    summary: 'Profil / accroche',
    experience: 'Expériences professionnelles',
    education: 'Formation',
    skills: 'Compétences & langues',
  }[id]
}

function stepHint(id: string) {
  return {
    template: 'Sélectionnez un style et une couleur. Vous pourrez changer à tout moment.',
    personal: 'Ces informations apparaissent en haut de votre CV.',
    summary: 'Un court paragraphe qui résume votre profil en 2-3 phrases.',
    experience: 'Ajoutez vos postes, du plus récent au plus ancien.',
    education: 'Vos diplômes et formations.',
    skills: 'Vos compétences clés et les langues que vous parlez.',
  }[id]
}

/* ---------------- Template step ---------------- */

const TEMPLATES: { id: TemplateId; name: string; desc: string }[] = [
  { id: 'modern', name: 'Moderne', desc: 'Épuré, deux colonnes' },
  { id: 'classic', name: 'Classique', desc: 'Élégant, sérif centré' },
  { id: 'creative', name: 'Créatif', desc: 'Barre latérale colorée' },
]

function TemplateStep({ data, update }: { data: CVData; update: Updater }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TEMPLATES.map((t) => {
          const active = data.template === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => update((p) => ({ ...p, template: t.id }))}
              className={cn(
                'group flex flex-col gap-2 rounded-xl border-2 p-3 text-left transition-colors',
                active
                  ? 'border-primary bg-accent'
                  : 'border-border hover:border-primary/40',
              )}
            >
              <TemplateThumb id={t.id} accent={data.accent} />
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
            </button>
          )
        })}
      </div>

      <Field label="Couleur d'accent">
        <div className="flex flex-wrap gap-2">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              title={c.label}
              onClick={() => update((p) => ({ ...p, accent: c.value }))}
              className={cn(
                'h-9 w-9 rounded-full ring-2 ring-offset-2 ring-offset-card transition-transform hover:scale-105',
                data.accent === c.value ? 'ring-foreground' : 'ring-transparent',
              )}
              style={{ backgroundColor: c.value }}
            >
              <span className="sr-only">{c.label}</span>
            </button>
          ))}
        </div>
      </Field>
    </div>
  )
}

function TemplateThumb({ id, accent }: { id: TemplateId; accent: string }) {
  if (id === 'creative') {
    return (
      <div className="flex h-24 overflow-hidden rounded-md border border-border bg-white">
        <div className="w-1/3" style={{ backgroundColor: accent }} />
        <div className="flex-1 space-y-1 p-2">
          <div className="h-2 w-3/4 rounded bg-neutral-800" />
          <div className="h-1.5 w-1/2 rounded" style={{ backgroundColor: accent }} />
          <div className="mt-2 h-1 w-full rounded bg-neutral-200" />
          <div className="h-1 w-full rounded bg-neutral-200" />
          <div className="h-1 w-2/3 rounded bg-neutral-200" />
        </div>
      </div>
    )
  }
  if (id === 'classic') {
    return (
      <div className="flex h-24 flex-col items-center gap-1 rounded-md border border-border bg-white p-2">
        <div className="h-2 w-1/2 rounded bg-neutral-800" />
        <div className="h-1 w-1/3 rounded bg-neutral-300" />
        <div className="my-1 h-0.5 w-full" style={{ backgroundColor: accent }} />
        <div className="h-1 w-full rounded bg-neutral-200" />
        <div className="h-1 w-full rounded bg-neutral-200" />
        <div className="h-1 w-3/4 rounded bg-neutral-200" />
      </div>
    )
  }
  return (
    <div className="h-24 overflow-hidden rounded-md border border-border bg-white">
      <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
      <div className="space-y-1 p-2">
        <div className="h-2 w-3/5 rounded bg-neutral-800" />
        <div className="h-1.5 w-2/5 rounded" style={{ backgroundColor: accent }} />
        <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
          <div className="space-y-1">
            <div className="h-1 w-full rounded bg-neutral-200" />
            <div className="h-1 w-full rounded bg-neutral-200" />
          </div>
          <div className="w-8 space-y-1">
            <div className="h-1 w-full rounded bg-neutral-200" />
            <div className="h-1 w-full rounded bg-neutral-200" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Personal step ---------------- */

function PersonalStep({ data, update }: { data: CVData; update: Updater }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const p = data.personal

  const setField = (key: keyof CVData['personal'], value: string) =>
    update((prev) => ({ ...prev, personal: { ...prev.personal, [key]: value } }))

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setField('photo', String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
          {p.photo ? (
            <img
              src={p.photo || '/placeholder.svg'}
              alt="Aperçu photo"
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Photo de profil (optionnelle)</p>
          <div className="flex gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onPhoto}
              className="hidden"
            />
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Importer
            </Button>
            {p.photo ? (
              <Button variant="ghost" size="sm" onClick={() => setField('photo', '')}>
                <X className="h-4 w-4" />
                Retirer
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nom complet" htmlFor="fullName">
          <TextInput
            id="fullName"
            value={p.fullName}
            onChange={(e) => setField('fullName', e.target.value)}
            placeholder="Camille Laurent"
          />
        </Field>
        <Field label="Titre / poste visé" htmlFor="title">
          <TextInput
            id="title"
            value={p.title}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="Cheffe de projet digital"
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <TextInput
            id="email"
            type="email"
            value={p.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="camille@email.com"
          />
        </Field>
        <Field label="Téléphone" htmlFor="phone">
          <TextInput
            id="phone"
            value={p.phone}
            onChange={(e) => setField('phone', e.target.value)}
            placeholder="+33 6 12 34 56 78"
          />
        </Field>
        <Field label="Localisation" htmlFor="location">
          <TextInput
            id="location"
            value={p.location}
            onChange={(e) => setField('location', e.target.value)}
            placeholder="Lyon, France"
          />
        </Field>
        <Field label="Site web / LinkedIn" htmlFor="website">
          <TextInput
            id="website"
            value={p.website}
            onChange={(e) => setField('website', e.target.value)}
            placeholder="camille-laurent.fr"
          />
        </Field>
      </div>
    </div>
  )
}

/* ---------------- Summary step ---------------- */

function SummaryStep({ data, update }: { data: CVData; update: Updater }) {
  return (
    <Field label="Accroche" hint={`${data.summary.length} caractères`}>
      <TextArea
        value={data.summary}
        onChange={(e) => update((p) => ({ ...p, summary: e.target.value }))}
        placeholder="Décrivez en quelques phrases votre profil, votre expérience et ce que vous recherchez."
        className="min-h-40"
      />
    </Field>
  )
}

/* ---------------- Experience step ---------------- */

function ExperienceStep({ data, update }: { data: CVData; update: Updater }) {
  const add = () =>
    update((p) => ({
      ...p,
      experiences: [
        ...p.experiences,
        {
          id: uid(),
          role: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    }))

  const remove = (id: string) =>
    update((p) => ({ ...p, experiences: p.experiences.filter((x) => x.id !== id) }))

  const set = (id: string, key: string, value: string | boolean) =>
    update((p) => ({
      ...p,
      experiences: p.experiences.map((x) =>
        x.id === id ? { ...x, [key]: value } : x,
      ),
    }))

  return (
    <div className="flex flex-col gap-4">
      {data.experiences.length === 0 ? (
        <EmptyState text="Aucune expérience ajoutée pour l'instant." />
      ) : null}

      {data.experiences.map((exp, i) => (
        <RepeatCard key={exp.id} title={`Expérience ${i + 1}`} onRemove={() => remove(exp.id)}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Poste">
              <TextInput
                value={exp.role}
                onChange={(e) => set(exp.id, 'role', e.target.value)}
                placeholder="Cheffe de projet"
              />
            </Field>
            <Field label="Entreprise">
              <TextInput
                value={exp.company}
                onChange={(e) => set(exp.id, 'company', e.target.value)}
                placeholder="Studio Nova"
              />
            </Field>
            <Field label="Lieu">
              <TextInput
                value={exp.location}
                onChange={(e) => set(exp.id, 'location', e.target.value)}
                placeholder="Lyon"
              />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Début">
                <TextInput
                  value={exp.startDate}
                  onChange={(e) => set(exp.id, 'startDate', e.target.value)}
                  placeholder="2021"
                />
              </Field>
              <Field label="Fin">
                <TextInput
                  value={exp.endDate}
                  onChange={(e) => set(exp.id, 'endDate', e.target.value)}
                  placeholder="2024"
                  disabled={exp.current}
                />
              </Field>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={exp.current}
              onChange={(e) => set(exp.id, 'current', e.target.checked)}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
            Poste actuel
          </label>
          <Field label="Description">
            <TextArea
              value={exp.description}
              onChange={(e) => set(exp.id, 'description', e.target.value)}
              placeholder="Vos missions et réalisations principales."
            />
          </Field>
        </RepeatCard>
      ))}

      <Button variant="outline" onClick={add} className="w-full">
        <Plus className="h-4 w-4" />
        Ajouter une expérience
      </Button>
    </div>
  )
}

/* ---------------- Education step ---------------- */

function EducationStep({ data, update }: { data: CVData; update: Updater }) {
  const add = () =>
    update((p) => ({
      ...p,
      education: [
        ...p.education,
        {
          id: uid(),
          degree: '',
          school: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    }))

  const remove = (id: string) =>
    update((p) => ({ ...p, education: p.education.filter((x) => x.id !== id) }))

  const set = (id: string, key: string, value: string) =>
    update((p) => ({
      ...p,
      education: p.education.map((x) => (x.id === id ? { ...x, [key]: value } : x)),
    }))

  return (
    <div className="flex flex-col gap-4">
      {data.education.length === 0 ? (
        <EmptyState text="Aucune formation ajoutée pour l'instant." />
      ) : null}

      {data.education.map((edu, i) => (
        <RepeatCard key={edu.id} title={`Formation ${i + 1}`} onRemove={() => remove(edu.id)}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Diplôme">
              <TextInput
                value={edu.degree}
                onChange={(e) => set(edu.id, 'degree', e.target.value)}
                placeholder="Master Management"
              />
            </Field>
            <Field label="Établissement">
              <TextInput
                value={edu.school}
                onChange={(e) => set(edu.id, 'school', e.target.value)}
                placeholder="IAE Lyon"
              />
            </Field>
            <Field label="Lieu">
              <TextInput
                value={edu.location}
                onChange={(e) => set(edu.id, 'location', e.target.value)}
                placeholder="Lyon"
              />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Début">
                <TextInput
                  value={edu.startDate}
                  onChange={(e) => set(edu.id, 'startDate', e.target.value)}
                  placeholder="2015"
                />
              </Field>
              <Field label="Fin">
                <TextInput
                  value={edu.endDate}
                  onChange={(e) => set(edu.id, 'endDate', e.target.value)}
                  placeholder="2017"
                />
              </Field>
            </div>
          </div>
          <Field label="Description (optionnelle)">
            <TextArea
              value={edu.description}
              onChange={(e) => set(edu.id, 'description', e.target.value)}
              placeholder="Spécialisation, mention, projets marquants."
            />
          </Field>
        </RepeatCard>
      ))}

      <Button variant="outline" onClick={add} className="w-full">
        <Plus className="h-4 w-4" />
        Ajouter une formation
      </Button>
    </div>
  )
}

/* ---------------- Skills step ---------------- */

function SkillsStep({ data, update }: { data: CVData; update: Updater }) {
  const inputRef = useRef<HTMLInputElement>(null)

  const addSkill = () => {
    const el = inputRef.current
    if (!el) return
    const value = el.value.trim()
    if (!value) return
    update((p) =>
      p.skills.includes(value) ? p : { ...p, skills: [...p.skills, value] },
    )
    el.value = ''
  }

  const removeSkill = (s: string) =>
    update((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }))

  const addLang = () =>
    update((p) => ({
      ...p,
      languages: [...p.languages, { id: uid(), name: '', level: 'Courant' }],
    }))

  const removeLang = (id: string) =>
    update((p) => ({ ...p, languages: p.languages.filter((x) => x.id !== id) }))

  const setLang = (id: string, key: string, value: string) =>
    update((p) => ({
      ...p,
      languages: p.languages.map((x) => (x.id === id ? { ...x, [key]: value } : x)),
    }))

  return (
    <div className="flex flex-col gap-6">
      <Field label="Compétences" hint="Appuyez sur Entrée pour ajouter.">
        <div className="flex gap-2">
          <TextInput
            ref={inputRef}
            placeholder="Ex. Gestion de projet"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                e.preventDefault()
                addSkill()
              }
            }}
          />
          <Button variant="outline" onClick={addSkill}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {data.skills.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeSkill(s)}
                  className="text-accent-foreground/60 hover:text-accent-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        ) : null}
      </Field>

      <Field label="Langues">
        <div className="flex flex-col gap-2">
          {data.languages.map((lang) => (
            <div key={lang.id} className="flex items-center gap-2">
              <TextInput
                value={lang.name}
                onChange={(e) => setLang(lang.id, 'name', e.target.value)}
                placeholder="Anglais"
              />
              <Select
                value={lang.level}
                onChange={(e) => setLang(lang.id, 'level', e.target.value)}
                className="max-w-44"
              >
                {LANGUAGE_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
              <Button variant="ghost" size="icon" onClick={() => removeLang(lang.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addLang} className="w-full">
            <Plus className="h-4 w-4" />
            Ajouter une langue
          </Button>
        </div>
      </Field>
    </div>
  )
}

/* ---------------- Shared bits ---------------- */

function RepeatCard({
  title,
  onRemove,
  children,
}: {
  title: string
  onRemove: () => void
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  )
}
