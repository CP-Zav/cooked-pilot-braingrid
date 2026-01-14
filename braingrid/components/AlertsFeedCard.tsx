import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * AlertsFeedCard – Framer-compatible code component
 * Follows BrainGrid contracts: renderer_contract.md, ui_binding_spec.json,
 * severity_map.json, icon_map.json, motion_rules.json
 */

// ─────────────────────────────────────────────────────────────────────────────
// Canonical severity_map.json
// ─────────────────────────────────────────────────────────────────────────────
const SEVERITY_MAP: Record<
    string,
    { label: string; color: string; icon: string; escalation_level: string }
> = {
    low: {
        label: "LOW",
        color: "#2ECC71",
        icon: "info",
        escalation_level: "monitor",
    },
    medium: {
        label: "MEDIUM",
        color: "#F1C40F",
        icon: "alert_triangle",
        escalation_level: "caution",
    },
    high: {
        label: "HIGH",
        color: "#E67E22",
        icon: "warning_octagon",
        escalation_level: "urgent",
    },
    critical: {
        label: "CRITICAL",
        color: "#E74C3C",
        icon: "siren",
        escalation_level: "emergency",
    },
}

// ─────────────────────────────────────────────────────────────────────────────
// Canonical icon_map.json (severity)
// ─────────────────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, string> = {
    info: "info",
    alert_triangle: "alert_triangle",
    warning_octagon: "warning_octagon",
    siren: "siren",
}

// ─────────────────────────────────────────────────────────────────────────────
// Canonical motion_rules.json
// ─────────────────────────────────────────────────────────────────────────────
const MOTION_RULES: Record<
    string,
    { card: { glow: string; pulse: string; border_emphasis: string } }
> = {
    low: {
        card: { glow: "none", pulse: "none", border_emphasis: "subtle" },
    },
    medium: {
        card: { glow: "none", pulse: "none", border_emphasis: "moderate" },
    },
    high: {
        card: { glow: "subtle", pulse: "none", border_emphasis: "pronounced" },
    },
    critical: {
        card: { glow: "subtle", pulse: "slow", border_emphasis: "strong" },
    },
}

// ─────────────────────────────────────────────────────────────────────────────
// ui_binding_spec.json rules
// ─────────────────────────────────────────────────────────────────────────────
const UI_RULES = {
    preview_max_chars: 120,
}

// ─────────────────────────────────────────────────────────────────────────────
// Types (from alert_payload.schema.json)
// ─────────────────────────────────────────────────────────────────────────────
interface AlertUI {
    alert_title: string
    alert_subtitle: string
    severity_label: string
    severity_color: string
    severity_icon: string
    risk_summary: string
    do_now_bullets: string[]
    triage_recommendation: string
    notification_title: string
    notification_body: string
}

interface AlertPayload {
    id: string
    created_at: string
    source?: string
    location_context?: string
    alert_type: "bad_batch" | "contamination" | "overdose_spike" | "heat_risk" | "unknown"
    substance?: string
    severity: "low" | "medium" | "high" | "critical"
    ui: AlertUI
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon Components (canonical icon_map.json icons)
// ─────────────────────────────────────────────────────────────────────────────
function IconInfo({ color, size }: { color: string; size: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    )
}

function IconAlertTriangle({ color, size }: { color: string; size: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    )
}

function IconWarningOctagon({ color, size }: { color: string; size: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    )
}

function IconSiren({ color, size }: { color: string; size: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7 18v-6a5 5 0 0 1 10 0v6" />
            <path d="M5 21h14" />
            <path d="M12 3v2" />
            <path d="M19 6l-1.5 1.5" />
            <path d="M5 6l1.5 1.5" />
            <rect x="6" y="18" width="12" height="3" rx="1" />
        </svg>
    )
}

function SeverityIcon({
    iconName,
    color,
    size = 20,
}: {
    iconName: string
    color: string
    size?: number
}) {
    switch (iconName) {
        case "info":
            return <IconInfo color={color} size={size} />
        case "alert_triangle":
            return <IconAlertTriangle color={color} size={size} />
        case "warning_octagon":
            return <IconWarningOctagon color={color} size={size} />
        case "siren":
            return <IconSiren color={color} size={size} />
        default:
            return <IconInfo color={color} size={size} />
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility: Truncate text per renderer_contract.md
// ─────────────────────────────────────────────────────────────────────────────
function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - 1).trimEnd() + "…"
}

// ─────────────────────────────────────────────────────────────────────────────
// Border width from motion_rules border_emphasis
// ─────────────────────────────────────────────────────────────────────────────
function getBorderWidth(emphasis: string): number {
    switch (emphasis) {
        case "subtle":
            return 3
        case "moderate":
            return 4
        case "pronounced":
            return 5
        case "strong":
            return 6
        default:
            return 3
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Check reduce-motion preference (motion_rules.global.reduce_motion_respect)
// ─────────────────────────────────────────────────────────────────────────────
function usePrefersReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

    React.useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
        setPrefersReducedMotion(mediaQuery.matches)

        const handler = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches)
        }
        mediaQuery.addEventListener("change", handler)
        return () => mediaQuery.removeEventListener("change", handler)
    }, [])

    return prefersReducedMotion
}

// ─────────────────────────────────────────────────────────────────────────────
// Component Props
// ─────────────────────────────────────────────────────────────────────────────
interface AlertsFeedCardProps {
    // ui_binding_spec.json fields
    alert_title: string
    severity_label: string
    severity_color: string
    severity_icon: string
    risk_summary: string
    // Schema fields
    severity: "low" | "medium" | "high" | "critical"
    // Interaction
    onTap?: () => void
    // Styling
    width?: number | string
    height?: number | string
}

// ─────────────────────────────────────────────────────────────────────────────
// AlertsFeedCard Component
// ─────────────────────────────────────────────────────────────────────────────
export function AlertsFeedCard({
    alert_title,
    severity_label,
    severity_color,
    severity_icon,
    risk_summary,
    severity,
    onTap,
    width = "100%",
    height = "auto",
}: AlertsFeedCardProps) {
    const prefersReducedMotion = usePrefersReducedMotion()

    // Resolve canonical values from severity_map.json
    const severityConfig = SEVERITY_MAP[severity] || SEVERITY_MAP.low
    const resolvedColor = severity_color || severityConfig.color
    const resolvedLabel = severity_label || severityConfig.label
    const resolvedIcon = severity_icon || severityConfig.icon

    // motion_rules.json for this severity
    const motionConfig = MOTION_RULES[severity]?.card || MOTION_RULES.low.card
    const borderWidth = getBorderWidth(motionConfig.border_emphasis)

    // Truncate preview text per ui_binding_spec.json rules.preview_max_chars
    const truncatedRiskSummary = truncateText(risk_summary, UI_RULES.preview_max_chars)

    // Animation styles based on motion_rules (no flashing/shaking per renderer_contract.md)
    const shouldAnimate = !prefersReducedMotion && motionConfig.pulse !== "none"

    // Styles
    const containerStyle: React.CSSProperties = {
        width,
        height,
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        cursor: onTap ? "pointer" : "default",
        transition: "box-shadow 0.2s ease",
    }

    // Severity color controls left border only (per renderer_contract.md)
    const accentBarStyle: React.CSSProperties = {
        width: borderWidth,
        minWidth: borderWidth,
        backgroundColor: resolvedColor,
        flexShrink: 0,
        animation:
            shouldAnimate && motionConfig.glow !== "none"
                ? "alertGlow 3s ease-in-out infinite"
                : "none",
    }

    const contentStyle: React.CSSProperties = {
        flex: 1,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 0,
    }

    const headerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    }

    const titleStyle: React.CSSProperties = {
        flex: 1,
        margin: 0,
        fontSize: 16,
        fontWeight: 600,
        color: "#1A1A1A",
        lineHeight: 1.3,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    }

    const chipStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 8px",
        borderRadius: 6,
        backgroundColor: `${resolvedColor}20`,
        color: resolvedColor,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        flexShrink: 0,
    }

    const previewStyle: React.CSSProperties = {
        margin: 0,
        fontSize: 14,
        color: "#4A4A4A",
        lineHeight: 1.5,
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    }

    return (
        <>
            <style>
                {`
                    @keyframes alertGlow {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.7; }
                    }
                `}
            </style>
            <div
                style={containerStyle}
                onClick={onTap}
                role={onTap ? "button" : undefined}
                tabIndex={onTap ? 0 : undefined}
                onKeyDown={
                    onTap
                        ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault()
                                  onTap()
                              }
                          }
                        : undefined
                }
            >
                {/* Accent bar - severity color controls left border only */}
                <div style={accentBarStyle} aria-hidden="true" />

                {/* Content */}
                <div style={contentStyle}>
                    {/* Header with title and severity chip */}
                    <div style={headerStyle}>
                        <h3 style={titleStyle}>{alert_title}</h3>
                        <div style={chipStyle}>
                            <SeverityIcon
                                iconName={resolvedIcon}
                                color={resolvedColor}
                                size={14}
                            />
                            <span>{resolvedLabel}</span>
                        </div>
                    </div>

                    {/* Preview text (risk_summary truncated to 120 chars) */}
                    {/* do_now_bullets NOT shown per renderer_contract.md */}
                    <p style={previewStyle}>{truncatedRiskSummary}</p>
                </div>
            </div>
        </>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Framer Property Controls
// ─────────────────────────────────────────────────────────────────────────────
addPropertyControls(AlertsFeedCard, {
    alert_title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "ALERT: Safety advisory",
    },
    severity: {
        type: ControlType.Enum,
        title: "Severity",
        options: ["low", "medium", "high", "critical"],
        optionTitles: ["Low", "Medium", "High", "Critical"],
        defaultValue: "medium",
    },
    severity_label: {
        type: ControlType.String,
        title: "Severity Label",
        defaultValue: "",
        description: "Leave empty to use canonical label from severity_map.json",
    },
    severity_color: {
        type: ControlType.Color,
        title: "Severity Color",
        defaultValue: "",
        description: "Leave empty to use canonical color from severity_map.json",
    },
    severity_icon: {
        type: ControlType.Enum,
        title: "Severity Icon",
        options: ["", "info", "alert_triangle", "warning_octagon", "siren"],
        optionTitles: ["Auto", "Info", "Alert Triangle", "Warning Octagon", "Siren"],
        defaultValue: "",
        description: "Leave as Auto to use canonical icon from icon_map.json",
    },
    risk_summary: {
        type: ControlType.String,
        title: "Risk Summary",
        defaultValue:
            "Risk advisory in effect. Please review guidance and take appropriate precautions.",
        displayTextArea: true,
    },
    onTap: {
        type: ControlType.EventHandler,
    },
})

// ─────────────────────────────────────────────────────────────────────────────
// Default export for Framer
// ─────────────────────────────────────────────────────────────────────────────
export default AlertsFeedCard
