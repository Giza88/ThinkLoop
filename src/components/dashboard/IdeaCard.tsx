import type { Idea, IdeaColor } from '../../data/content'
import { Icon } from '../Icon'

const colorStyles: Record<
  IdeaColor,
  { card: string; tag: string; tagText: string }
> = {
  blue: {
    card: 'bg-tl-purple-50/80 border-tl-purple-100',
    tag: 'border-tl-purple-200 bg-tl-purple-50',
    tagText: 'text-tl-purple-500',
  },
  green: {
    card: 'bg-tl-cyan-50/80 border-tl-cyan-100',
    tag: 'border-tl-cyan-200 bg-tl-cyan-50',
    tagText: 'text-tl-cyan-500',
  },
  yellow: {
    card: 'bg-tl-purple-50/80 border-tl-purple-100',
    tag: 'border-tl-cyan-200 bg-tl-purple-50',
    tagText: 'text-tl-cyan-600',
  },
  purple: {
    card: 'bg-tl-purple-50/80 border-tl-purple-100',
    tag: 'border-tl-purple-200 bg-tl-purple-50',
    tagText: 'text-tl-purple-500',
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
