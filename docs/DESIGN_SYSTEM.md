# CareGrid.io Design System

This document outlines the professional UI/UX foundation for CareGrid.io, establishing a responsive, trustworthy, and efficient interface for healthcare professionals. This foundation ensures that all future Phase modules are built on a consistent, tested, and accessible UI.

## 1. Core Principles

- **Professional & Trustworthy:** The UI avoids generic admin templates, oversized cards, and excessive glassmorphism. It uses a clean, compact, and scannable layout.
- **Data-Dense Yet Readable:** Designed for daily operational software where users (doctors, nurses) need to scan information quickly.
- **Consistent Restraint:** Avoids unnecessary animations. Relies on a strict scale of spacing, typography, and color semantics.

## 2. Typography

We use modern sans-serif typography, tailored for legibility:
- **Hierarchy:** Clear distinction between `PageHeader`, `SectionHeader`, and body text.
- **Restraint:** Headings are compact. We avoid giant typography that wastes vertical space.
- **Weights:** Use medium/semibold for labels and table headers, and regular for data.

## 3. Color & Semantics

The palette is restrained, using white, slate, and a professional healthcare blue family, with specific colors reserved strictly for semantic states.

**Status Semantics (`StatusTone`):**
- **`success` (Green):** Available, Approved, Safe, Active, Dispensed.
- **`info` (Blue):** Occupied, general information.
- **`warning` (Amber/Orange):** Cleaning, Pending, Warning (low stock, needs attention).
- **`critical` (Red):** Critical, Expired, Rejected. Red is **strictly reserved** for dangerous or emergency states.
- **`neutral` (Slate):** Reserved, Inactive, Cancelled.

## 4. Spacing, Radius, and Layout

- **Spacing Rhythm:** Adheres to an 8px Tailwind scale (`gap-4`, `p-6`, `mt-8`).
- **Radius:** A standard, restrained 8px (`rounded-md` or `rounded-lg`) border radius across cards and controls.
- **Containers:** Content is constrained to readable widths on large screens, utilizing a standard `PageContainer`.

## 5. Global App Shell

The application operates within a consistent responsive shell:
- **Sidebar:** Collapsible on desktop, becomes an accessible off-canvas drawer on mobile. Groups navigation by `workspace`, `operations`, and `account` driven by Role-Based Access Control (RBAC).
- **Topbar:** Contains context and quick actions, staying compact.
- **Breadcrumbs:** Route-aware breadcrumbs for deep-linking context.

## 6. Components Implemented

The Phase 1 Design System provides the following canonical, reusable components located in `src/components/`:

### Layout
- `AppShell`, `Sidebar`, `Topbar`, `Breadcrumbs`, `PageContainer`

### Data Display
- `StatusBadge`: Semantic, accessible badges with auto-resolved icons (`CareGridStatus`).
- `StatCard`: Standardized metric cards supporting titles, values, icons, and descriptions.
- `DataTableShell`: A reusable wrapper providing loading, empty, and error states for tabular data.

### Feedback
- `Alert`, `EmptyState`, `ErrorState`, `LoadingState`: Generic foundation components to communicate system states without being tied to specific business logic.

### Forms
- `FormField`, `Input`, `Textarea`, `Select`, `Checkbox`, `SearchInput`.
- All controls feature consistent accessible focus states (`focus-visible:ring-ring`) and spacing.

### UI Primitives
- `Button`, `Card`, `Dialog`, `Badge`, `Table`.

## 7. Accessibility

- **Keyboard Navigation:** All interactive elements have visible focus outlines.
- **ARIA Attributes:** `aria-current="page"` for active navigation, `aria-hidden` for decorative icons, and `aria-label` for icon buttons.
- **Status Contrast:** Status indicators do not rely on color alone; they incorporate specific icons and clear text labels.

## 8. Responsive Rules

- **Mobile:** 375px target. Sidebar hides behind a hamburger menu. Tables handle horizontal scroll safely. Cards stack vertically.
- **Tablet:** 768px target. Responsive adjustments to multi-column layouts.
- **Desktop:** 1024px+ target. Sidebar is fixed. Content uses safe horizontal padding.
