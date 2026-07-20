/**
 * Theme-aware color utilities for dashboards
 * Returns colors based on the current theme mode
 */

export function getThemeAwareColors(mode: 'light' | 'dark') {
  return {
    // Background colors
    pageBackground: mode === 'light' ? '#f9fafb' : '#0f172a',
    cardBackground: mode === 'light' ? '#ffffff' : '#1e293b',
    cardGradient: mode === 'light'
      ? 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)'
      : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',

    // KPI Card backgrounds
    kpiCardGradient: (gradientStart: string, gradientEnd: string) => mode === 'light'
      ? `linear-gradient(135deg, ${gradientStart}15 0%, ${gradientEnd}08 100%), linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)`
      : `linear-gradient(135deg, ${gradientStart}20 0%, ${gradientEnd}15 100%), linear-gradient(135deg, #1e293b 0%, #334155 100%)`,

    // Table row colors
    tableRowHover: mode === 'light' ? '#f0f9ff' : 'rgba(34, 197, 94, 0.05)',
    tableHeaderBackground: mode === 'light' ? '#f0f4ff' : '#334155',
    tableHeaderBorder: mode === 'light' ? '2px solid #e5e7eb' : '2px solid #475569',

    // Status colors
    approvedBackground: mode === 'light' ? '#D1FAE5' : 'rgba(34, 197, 94, 0.2)',
    pendingBackground: mode === 'light' ? '#FEF3C7' : 'rgba(245, 158, 11, 0.2)',
    rejectedBackground: mode === 'light' ? '#FEE2E2' : 'rgba(239, 68, 68, 0.2)',

    // Hover backgrounds
    hoverLightBlue: mode === 'light' ? '#f5f3ff' : 'rgba(59, 130, 246, 0.1)',
    hoverOrange: mode === 'light' ? '#fff7ed' : 'rgba(249, 115, 22, 0.1)',
    hoverPink: mode === 'light' ? '#fdf2f8' : 'rgba(236, 72, 153, 0.1)',

    // Chart colors (remain consistent in both modes for visibility)
    chartPrimary: '#3B82F6',
    chartSecondary: '#8B5CF6',
    chartTertiary: '#F97316',
    chartQuaternary: '#EC4899',

    // Text hint for cards
    textHint: mode === 'light' ? '#1f2937' : '#f1f5f9',

    // Border colors
    border: mode === 'light' ? '#e5e7eb' : '#475569',
  };
}
