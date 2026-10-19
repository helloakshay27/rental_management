import * as React from "react"

import { cn } from "@/lib/utils"
import { humanizeLabel } from "@/lib/format"

export type PillTone = "success" | "warning" | "danger" | "info" | "neutral"

/**
 * Low-saturation tint with matching tone text. Never a saturated fill with
 * inverse text.
 */
const TONE_CLASSES: Record<PillTone, string> = {
  success: "bg-[rgba(18,161,80,0.12)] text-[#0E7F3F]",
  warning: "bg-[#FFF2D6] text-[#8A5A00]",
  danger: "bg-[rgba(229,72,77,0.12)] text-[#A32126]",
  info: "bg-[rgba(47,111,224,0.12)] text-[#1F55B8]",
  neutral: "bg-[rgba(26,26,24,0.06)] text-[rgba(26,26,24,0.72)]",
}

/**
 * One tone per state, used in every view. Keys are normalised (lower case,
 * spaces), so "partially_paid", "Partially Paid" and "PARTIALLY-PAID" match.
 */
const STATE_TONES: Record<string, PillTone> = {
  // success
  active: "success",
  paid: "success",
  approved: "success",
  completed: "success",
  complete: "success",
  success: "success",
  successful: "success",
  compliant: "success",
  resolved: "success",
  verified: "success",
  valid: "success",
  renewed: "success",
  occupied: "success",
  long: "success",
  // warning
  pending: "warning",
  "due soon": "warning",
  "partially paid": "warning",
  partial: "warning",
  "in review": "warning",
  "under review": "warning",
  "expiring soon": "warning",
  expiring: "warning",
  medium: "warning",
  short: "warning",
  "on hold": "warning",
  // danger
  overdue: "danger",
  expired: "danger",
  rejected: "danger",
  failed: "danger",
  cancelled: "danger",
  canceled: "danger",
  "non compliant": "danger",
  high: "danger",
  critical: "danger",
  urgent: "danger",
  terminated: "danger",
  // info
  submitted: "info",
  scheduled: "info",
  confirmed: "info",
  "in progress": "info",
  open: "info",
  new: "info",
  upcoming: "info",
  // neutral
  inactive: "neutral",
  unknown: "neutral",
  draft: "neutral",
  low: "neutral",
  closed: "neutral",
  vacant: "neutral",
  "not started": "neutral",
}

const normalise = (value: unknown) =>
  String(value ?? "").trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ")

/** Tone for a state label; unrecognised states fall back to neutral. */
export const getStateTone = (state: unknown): PillTone =>
  STATE_TONES[normalise(state)] ?? "neutral"

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The raw state; it is displayed through `humanizeLabel` unless `children` is given. */
  status?: unknown
  /** Override the tone derived from `status`. */
  tone?: PillTone
  icon?: React.ReactNode
}

/**
 * Shared state pill: radius 999px, padding 3px 10px, 11px/500, title-case label.
 */
export const StatusPill = ({ status, tone, icon, className, children, ...props }: StatusPillProps) => (
  <span
    className={cn(
      "inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-[10px] py-[3px] text-[11px] font-medium leading-[1.4]",
      TONE_CLASSES[tone ?? getStateTone(status)],
      className
    )}
    {...props}
  >
    {icon}
    {children ?? humanizeLabel(status)}
  </span>
)

/**
 * Neutral read-only chip for types and metadata (e.g. Recurring, Rent, Owned,
 * +91, INR, field types). Same geometry as the state pill, neutral surface.
 */
export const MetaChip = ({
  icon,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { icon?: React.ReactNode }) => (
  <span
    className={cn(
      "inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-[rgba(26,26,24,0.08)] bg-[#F5F4F0] px-[10px] py-[3px] text-[11px] font-medium leading-[1.4] text-[#1A1A18] [&_svg]:h-3 [&_svg]:w-3",
      className
    )}
    {...props}
  >
    {icon}
    {children}
  </span>
)

export default StatusPill
