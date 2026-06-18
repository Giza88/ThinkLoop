import type { Idea, IdeaColor } from '../../data/content'
import { Icon } from '../Icon'

const colorStyles: Record<
  IdeaColor,
  { card: string; tag: string; tagText: string }
> = {
  blue: {
    card: 'bg-blue-50/80 border-blue-100',
    tag: 'border-blue-200 bg-blue-50',
    tagText: 'text-blue-600',
  },
  green: {
    card: 'bg-green-50/80 border-green-100',
    tag: 'border-green-200 bg-green-50',
    tagText: 'text-green-600',
  },
  yellow: {
    card: 'bg-amber-50/80 border-amber-100',
    tag: 'border-amber-200 bg-amber-50',
    tagText: 'text-amber-700',
  },
  purple: {
    card: 'bg-purple-50/80 border-purple-100',
    tag: 'border-purple-200 bg-purple-50',
    tagText: 'text-purple-600',
  },
}

interface IdeaCardProps {
  idea: Idea
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const styles = colorStyles[idea.color]

  return (
    <article
      className={`rounded-xl border p-4 ${styles.card}`}
    >
      <h3 className="text-sm font-semibold text-tl-gray-900">{idea.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-tl-gray-600">
        {idea.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {idea.tags.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles.tag} ${styles.tagText}`}
          >
            <Icon name="tag" size={10} />
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}
