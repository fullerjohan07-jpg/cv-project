import type { CVData } from '@/lib/cv-types'
import { ModernTemplate } from '@/components/cv/templates/modern-template'
import { ClassicTemplate } from '@/components/cv/templates/classic-template'
import { CreativeTemplate } from '@/components/cv/templates/creative-template'

export function CVPreview({ data }: { data: CVData }) {
  if (data.template === 'classic') return <ClassicTemplate data={data} />
  if (data.template === 'creative') return <CreativeTemplate data={data} />
  return <ModernTemplate data={data} />
}
