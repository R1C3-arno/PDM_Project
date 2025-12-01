export const olavsDesign = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    neutral: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
    },
    surface: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      alt: '#f1f5f9',
      default: '#ffffff',
    },
    status: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    text: {
      primary: '#18181b',
      secondary: '#71717a',
      muted: '#a1a1aa',
    },
  },
  spacing: {
    0: '0px',
    4: '4px',
    8: '8px',
    12: '12px',
    16: '16px',
    20: '20px',
    24: '24px',
    32: '32px',
    40: '40px',
    48: '48px',
    56: '56px',
    64: '64px',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    font: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    scale: {
      displayXL: { size: '3.5rem', lineHeight: '4rem', weight: 700 },
      displayL: { size: '3rem', lineHeight: '3.5rem', weight: 700 },
      displayM: { size: '2.5rem', lineHeight: '3rem', weight: 700 },
      headingXL: { size: '2.5rem', lineHeight: '3rem', weight: 700 },
      headingL: { size: '2rem', lineHeight: '2.5rem', weight: 600 },
      headingM: { size: '1.5rem', lineHeight: '2rem', weight: 600 },
      headingS: { size: '1.25rem', lineHeight: '1.75rem', weight: 600 },
      bodyL: { size: '1.125rem', lineHeight: '1.75rem', weight: 400 },
      bodyM: { size: '1rem', lineHeight: '1.5rem', weight: 400 },
      bodyS: { size: '0.875rem', lineHeight: '1.25rem', weight: 400 },
      caption: { size: '0.75rem', lineHeight: '1rem', weight: 400 },
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  layout: {
    contentWidth: '1280px',
    maxWidth: '1440px',
    containerPadding: '24px',
  },
  elevation: {
    level1: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    level2: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    level3: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    level4: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  components: {
    button: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
      },
      padding: {
        sm: '8px 16px',
        md: '12px 24px',
        lg: '16px 32px',
      },
      fontSize: {
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
      },
    },
    input: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
      },
      padding: {
        sm: '8px 12px',
        md: '12px 16px',
        lg: '16px 20px',
      },
      borderRadius: '8px',
      borderWidth: '1px',
    },
    card: {
      padding: '24px',
      borderRadius: '12px',
    },
  },
};

export default olavsDesign;

export function getStatusBadgeStyle(status: string): { bg: string; color: string; border: string } {
  const normalizedStatus = status.toLowerCase().replace(/[_\s]/g, '');

  const statusStyles: Record<string, { bg: string; color: string; border: string }> = {
    pending: { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
    submitted: { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
    underreview: { bg: '#e0e7ff', color: '#3730a3', border: '#a5b4fc' },
    approved: { bg: '#dcfce7', color: '#166534', border: '#86efac' },
    rejected: { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
    active: { bg: '#dcfce7', color: '#166534', border: '#86efac' },
    completed: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    cancelled: { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' },
    disbursed: { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
    overdue: { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
    paid: { bg: '#dcfce7', color: '#166534', border: '#86efac' },
    default: { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' },
  };

  return statusStyles[normalizedStatus] ?? statusStyles.default!;
}
