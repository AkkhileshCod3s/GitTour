interface Props {
  count: number // 0..3
  size?: number
  animate?: boolean // animate stars one by one
  color?: string
}

/** SVG star; filled count shown; scale-in bounce when animate=true. */
export function StarRating({ count, size = 18, animate = false, color = '#fbbf24' }: Props) {
  return (
    <span role="img" aria-label={`${count} of 3 stars`} className="inline-flex gap-1">
      {[0, 1, 2].map((i) => {
        const filled = i < count
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className={animate && filled ? 'anim-star' : undefined}
            style={animate ? { animationDelay: `${i * 0.45}s` } : undefined}
            aria-hidden="true"
          >
            <path
              d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"
              fill={filled ? color : 'none'}
              stroke={filled ? color : '#475569'}
              strokeWidth="1.6"
            />
          </svg>
        )
      })}
    </span>
  )
}
