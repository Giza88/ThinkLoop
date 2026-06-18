import logoSrc from '../assets/thinkloop-logo.png'

type LogoProps = {
  variant?: 'full' | 'icon'
  className?: string
}

export function Logo({ variant = 'full', className = '' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <img
        src={logoSrc}
        alt="ThinkLoop"
        className={`h-10 w-10 shrink-0 rounded-lg object-cover object-top ${className}`}
      />
    )
  }

  return (
    <img
      src={logoSrc}
      alt="ThinkLoop"
      className={`h-auto w-full max-w-[148px] shrink-0 rounded-lg ${className}`}
    />
  )
}
