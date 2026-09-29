interface Props {
  count: number // 0..3
  size?: number
  animate?: boolean
  color?: string
}

export function StarRating({ count, size = 26, animate = false, color }: Props) {
  const fill = color ?? 'rgb(var(--lime))'
  const empty = 'rgb(var(--brut-shade))'
  return (
    <span role="img" aria-label={`${count} of 3 stars`} className="inline-flex gap-1.5">
      {[0, 1, 2].map((i) => {
        const filled = i < count
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" className={animate && filled ? 'anim-star' : undefined} style={animate ? { animationDelay: `${i * 0.3}s` } : undefined} aria-hidden="true">
            <path
              d="M12 2.5l2.8 6 6.6.8-4.9 4.5 1.3 6.5L12 17.2 6.2 20.3l1.3-6.5L2.6 9.3l6.6-.8z"
              fill={filled ? fill : empty}
              stroke={filled ? '#0A0A0A' : 'rgb(var(--border-c))'}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        )
      })}
    </span>
  )
}
