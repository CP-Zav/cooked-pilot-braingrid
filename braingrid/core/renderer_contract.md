# Cooked Pilot – Alert Renderer Contract (v1)

This document defines exactly how alert payloads must be rendered.
UI components MUST follow this contract verbatim.

---

## Canonical Pattern
Every alert uses the same 4 blocks, in order:

1. WHAT
2. RISK
3. DO NOW
4.

cat > braingrid/core/renderer_contract.md <<'EOF'
# Cooked Pilot – Alert Renderer Contract (v1)

This document defines exactly how alert payloads must be rendered.
UI components MUST follow this contract verbatim.

---

## Canonical Pattern
Every alert uses the same 4 blocks, in order:

1. WHAT
2. RISK
3. DO NOW
4. GET HELP

No additional blocks. No reordering.

---

## Component: Alerts Feed Card

### Required fields
- ui.alert_title
- ui.severity_label
- ui.severity_color
- ui.severity_icon
- ui.risk_summary

### Rules
- Truncate risk_summary to max 120 characters
- Do NOT show do_now_bullets here
- Severity color controls left border or accent only
- No animation beyond motion_rules[severity].card

---

## Component: Alert Detail View

### WHAT
- ui.alert_subtitle

### RISK
- ui.risk_summary

### DO NOW
- ui.do_now_bullets
- Show first 3 bullets only
- Preserve order

### GET HELP
- ui.triage_recommendation
- Always include emergency red-flag text:
  “If unconscious, seizing, chest pain, or not breathing — call emergency services now.”

---

## Component: Map Pin / Map Tooltip

### Required fields
- ui.severity_color
- ui.severity_icon
- ui.risk_summary

### Rules
- Tooltip text max 80 characters
- Tap/click opens Alert Detail View
- No auto-panning unless severity is critical

---

## Component: Push Notification

### Required fields
- ui.notification_title
- ui.notification_body

### Rules
- No emojis
- No ALL CAPS except the word ALERT if present
- Respect quiet hours unless escalation_level is emergency

---

## Prohibited Behaviors
- No surveillance language
- No countdown timers
- No flashing or shaking animations
- No dosage instructions

---

## Source of Truth
If UI behavior conflicts with:
- workflow outputs
- schemas
- severity_map
- motion_rules

Then the repository files win. Always.
