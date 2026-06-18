type SectionPlaceholderProps = {
  title: string
  description: string
}

export function SectionPlaceholder({ title, description }: SectionPlaceholderProps) {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
        <p className="text-sm text-slate-400">Coming soon</p>
      </div>
    </div>
  )
}
