export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Burhan Heyder PLC',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
} as const;
