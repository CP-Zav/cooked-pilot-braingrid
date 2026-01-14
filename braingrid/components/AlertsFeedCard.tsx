import * as React from "react"
import { addPropertyControls, ControlType, motion } from "framer"

/**
 * AlertsFeedCard
 *
 * Follows BrainGrid contracts:
 * - renderer_contract.md (Alerts Feed Card section)
 * - ui_binding_spec.json (alerts_feed_card)
 * - severity_map.json
 * - icon_map.json
 * - motion_rules.json
 */

// -----------------------------------------------------------------------------
// Canonical severity map (from core/severity_map.json)
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Canonical icon map (from core/icon_map.json)
// -----------------------------------------------------------------------------
const ICON_MAP: Record<string, Record<string, string>> = {
    severity: {
        low: "info",
        medium: "alert_triangle",
        high: "warning_octagon",
        critical: "siren",
    },
    alert_type: {
        bad_batch: "flask_bad",
        contamination: "biohazard",
        overdose_spike: "heartbeat_alert",
        heat_risk: "thermometer_hot",
        unknown: "radar",
    },
    actions: {
        do_now: "checklist",
        get_help: "lifebuoy",
        call_emergency: "phone_sos",
        message_buddy: "share",
        find_medical: "map_pin",
        exit_route: "exit",
    },
}

// -----------------------------------------------------------------------------
// Canonical motion rules (from core/motion_rules.json)
// -----------------------------------------------------------------------------
const MOTION_RULES: Record<
    string,
    { card: { glow: string; pulse: string; border_emphasis: string } }
> = {
    low: { card: { glow: "none", pulse: "none", border_emphasis: "subtle" } },
    medium: { card: { glow: "none", pulse: "none", border_emphasis: "medium" } },
    high: { card: { glow: "subtle", pulse: "none", border_emphasis: "strong" } },
    critical: { card: { glow: "subtle", pulse: "slow", border_emphasis: "strong" } },
}

// -----------------------------------------------------------------------------
// Constants from ui_binding_spec.json
// -----------------------------------------------------------------------------
const PREVIEW_MAX_CHARS = 120

// -----------------------------------------------------------------------------
// Icon components (mapped from icon_map.json severity icons)
// -----------------------------------------------------------------------------
function IconInfo({ color }: { color: string }) {
    return (
        <svg
            width="20"
            height="20"
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

function IconAlertTriangle({ color }: { color: string }) {
    return (
        <svg
            width="20"
            height="20"
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

function IconWarningOctagon({ color }: { color: string }) {
    return (
        <svg
            width="20"
            height="20"
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

function IconSiren({ color }: { color: string }) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7 18v-6a5 5 0 1 1 10 0v6" />
            <path d="M5 21h14" />
            <path d="M12 3v2" />
            <path d="M19.07 5.93l-1.41 1.41" />
            <path d="M21 12h-2" />
            <path d="M5 12H3" />
            <path d="M6.34 7.34L4.93 5.93" />
        </svg>
    )
}

// Icon resolver using icon_map.json
function SeverityIcon({ iconKey, color }: { iconKey: string; color: string }) {
    switch (iconKey) {
        case "info":
            return <IconInfo color={color} />
        case "alert_triangle":
            return <IconAlertTriangle color={color} />
        case "warning_octagon":
            return <IconWarningOctagon color={color} />
        case "siren":
            return <IconSiren color={color} />
        default:
            return <IconInfo color={color} />
    }
}

// -----------------------------------------------------------------------------
// Truncation helper (per renderer_contract.md: max 120 chars)
// -----------------------------------------------------------------------------
function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - 1).trimEnd() + "\u2026"
}

// -----------------------------------------------------------------------------
// Border width by emphasis (per motion_rules.json)
// -----------------------------------------------------------------------------
function getBorderWidth(emphasis: string): number {
    switch (emphasis) {
        case "subtle":
            return 3
        case "medium":
            return 4
        case "strong":
            return 5
        default:
            return 3
    }
}

// -----------------------------------------------------------------------------
// Alert UI type (from alert_payload.schema.json)
// -----------------------------------------------------------------------------
interface AlertUI {
    alert_title: string
    severity_label: string
    severity_color: string
    severity_icon: string
    risk_summary: string
}

// -----------------------------------------------------------------------------
// Component Props
// -----------------------------------------------------------------------------
interface AlertsFeedCardProps {
    alert_title: string
    severity_label: string
    severity_color: string
    severity_icon: string
    risk_summary: string
    severity: "low" | "medium" | "high" | "critical"
    onTap?: () => void
    style?: React.CSSProperties
}

// -----------------------------------------------------------------------------
// AlertsFeedCard Component
// -----------------------------------------------------------------------------
export function AlertsFeedCard(props: AlertsFeedCardProps) {
    const {
        alert_title,
        severity_label,
        severity_color,
        severity_icon,
        risk_summary,
        severity,
        onTap,
        style,
    } = props

    // Resolve motion rules for this severity
    const motionRule = MOTION_RULES[severity] || MOTION_RULES.low
    const borderWidth = getBorderWidth(motionRule.card.border_emphasis)

    // Respect reduce motion preference (per motion_rules.json global.reduce_motion_respect)
    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    // Truncate risk_summary per renderer_contract.md (max 120 chars)
    const previewText = truncateText(risk_summary, PREVIEW_MAX_CHARS)

    // Pulse animation only for critical, respecting reduce motion
    const shouldPulse =
        motionRule.card.pulse === "slow" && !prefersReducedMotion

    // Glow box-shadow for high/critical
    const glowShadow =
        motionRule.card.glow === "subtle"
            ? `0 0 8px ${severity_color}40`
            : "none"

    return (
        <motion.div
            onClick={onTap}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: 16,
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                borderLeft: `${borderWidth}px solid ${severity_color}`,
                boxShadow: glowShadow,
                cursor: onTap ? "pointer" : "default",
                fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                ...style,
            }}
            whileHover={
                !prefersReducedMotion
                    ? { scale: 1.01, transition: { duration: 0.15 } }
                    : undefined
            }
            whileTap={
                !prefersReducedMotion
                    ? { scale: 0.99, transition: { duration: 0.1 } }
                    : undefined
            }
            animate={
                shouldPulse
                    ? {
                          boxShadow: [
                              `0 0 8px ${severity_color}40`,
                              `0 0 16px ${severity_color}60`,
                              `0 0 8px ${severity_color}40`,
                          ],
                      }
                    : undefined
            }
            transition={
                shouldPulse
                    ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    : undefined
            }
        >
            {/* Header: Icon + Title + Severity Chip */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                {/* Severity Icon (from icon_map.json) */}
                <SeverityIcon iconKey={severity_icon} color={severity_color} />

                {/* Title (from ui_binding_spec.json: title -> alert_title) */}
                <div
                    style={{
                        flex: 1,
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#1A1A1A",
                        lineHeight: 1.3,
                    }}
                >
                    {alert_title}
                </div>

                {/* Severity Chip (from ui_binding_spec.json: severity_chip -> severity_label) */}
                <div
                    style={{
                        padding: "4px 10px",
                        backgroundColor: `${severity_color}20`,
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        color: severity_color,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                    }}
                >
                    {severity_label}
                </div>
            </div>

            {/* Preview Text (from ui_binding_spec.json: preview_text -> risk_summary) */}
            {/* Truncated to 120 chars per renderer_contract.md */}
            <div
                style={{
                    fontSize: 14,
                    color: "#4A4A4A",
                    lineHeight: 1.5,
                }}
            >
                {previewText}
            </div>
        </motion.div>
    )
}

// -----------------------------------------------------------------------------
// Default props
// -----------------------------------------------------------------------------
AlertsFeedCard.defaultProps = {
    alert_title: "ALERT: Heat risk advisory",
    severity_label: "MEDIUM",
    severity_color: "#F1C40F",
    severity_icon: "alert_triangle",
    risk_summary:
        "Crowd density and heat can escalate fast into dangerous overheating, even without substances. Act early to cool down.",
    severity: "medium" as const,
}

// -----------------------------------------------------------------------------
// Framer Property Controls
// -----------------------------------------------------------------------------
addPropertyControls(AlertsFeedCard, {
    alert_title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: AlertsFeedCard.defaultProps.alert_title,
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
        defaultValue: AlertsFeedCard.defaultProps.severity_label,
    },
    severity_color: {
        type: ControlType.Color,
        title: "Severity Color",
        defaultValue: AlertsFeedCard.defaultProps.severity_color,
    },
    severity_icon: {
        type: ControlType.Enum,
        title: "Severity Icon",
        options: ["info", "alert_triangle", "warning_octagon", "siren"],
        optionTitles: ["Info", "Alert Triangle", "Warning Octagon", "Siren"],
        defaultValue: "alert_triangle",
    },
    risk_summary: {
        type: ControlType.String,
        title: "Risk Summary",
        defaultValue: AlertsFeedCard.defaultProps.risk_summary,
    },
    onTap: {
        type: ControlType.EventHandler,
    },
})

export default AlertsFeedCard
