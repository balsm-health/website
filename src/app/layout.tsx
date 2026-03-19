import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Balsm - Healthcare Made Simple',
  description: 'Join the waitlist for Balsm - the all-in-one healthcare app for booking appointments, managing prescriptions, and connecting with doctors.',
  icons: {
    icon: '/balsm-logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
