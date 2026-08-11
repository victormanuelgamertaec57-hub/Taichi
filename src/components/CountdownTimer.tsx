import { useEffect, useState, useRef } from 'react'

interface Props {
  /** Duración inicial en segundos. Default 9 minutos. */
  initialSeconds?: number
  /** Callback cuando llega a 0 (opcional). */
  onExpire?: () => void
}

const RED = '#E53935'
const RED_BG = '#FDECEC'
const RED_DARK = '#B71C1C'

/**
 * Countdown de cuenta regresiva para el paywall.
 * Bloque único: el contador mm:ss grande sobre fondo rosado claro,
 * con el reloj como icono decorativo a la izquierda del número.
 * El tiempo "se congela" en 0 al expirar (no se reinicia solo).
 */
export default function CountdownTimer({ initialSeconds = 9 * 60, onExpire }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const expiredRef = useRef(false)

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true
        onExpire?.()
      }
      return
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secondsLeft, onExpire])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isUrgent = secondsLeft <= 60

  return (
    <div
      className="w-full rounded-xl px-4 py-5 border flex items-center justify-center gap-3"
      style={{
        backgroundColor: isUrgent ? RED_BG : RED_BG,
        borderColor: isUrgent ? RED_DARK : RED,
      }}
    >
      <i
        className="ti ti-clock text-2xl"
        aria-hidden="true"
        style={{ color: isUrgent ? RED_DARK : RED }}
      />
      <span
        className="text-4xl font-extrabold tabular-nums tracking-wider"
        style={{ color: isUrgent ? RED_DARK : RED }}
      >
        {formatted}
      </span>
    </div>
  )
}
