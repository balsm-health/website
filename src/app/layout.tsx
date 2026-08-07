import type { Metadata } from 'next';
import { SITE_URL as siteUrl, alternates, openGraph, twitter } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Balsm - Open Source Healthcare Platform',
    template: '%s | Balsm',
  },
  description: 'Join Balsm - the open source healthcare platform built for providers, patients, and developers. Transparent, community-driven, and accessible to all.',
  keywords: [
    // Platform & Technology
    'open source healthcare',
    'healthcare platform',
    'EHR',
    'EMR',
    'electronic health records',
    'electronic medical records',
    'healthcare technology',
    'medical software',
    'healthcare API',
    'HIPAA compliant',
    'healthcare integration',
    'digital health',
    'healthtech',
    'telemedicine',
    'telehealth',
    'medical practice management',
    'clinic management software',
    'hospital information system',
    'health information system',

    // Geographic - Egypt & Regions
    'Egypt healthcare',
    'Egyptian healthcare platform',
    'healthcare Egypt',
    'medical software Egypt',
    'EHR Egypt',
    'EMR Egypt',
    'telemedicine Egypt',
    'Cairo healthcare',
    'Egyptian doctors',
    'Egyptian hospitals',
    'Egyptian clinics',
    'Egypt medical technology',
    'healthcare Cairo',
    'مصر الرعاية الصحية',

    // Geographic - MENA Region
    'MENA healthcare',
    'Middle East healthcare',
    'North Africa healthcare',
    'Arab world healthcare',
    'Middle East EHR',
    'MENA telemedicine',
    'Arabic healthcare platform',
    'Arabic EHR',
    'Arabic EMR',
    'Gulf healthcare',
    'GCC healthcare',
    'Levant healthcare',

    // Geographic - Neighboring Countries
    'Saudi Arabia healthcare',
    'UAE healthcare',
    'Jordan healthcare',
    'Lebanon healthcare',
    'Kuwait healthcare',
    'Qatar healthcare',
    'Bahrain healthcare',
    'Oman healthcare',
    'Palestine healthcare',
    'Libya healthcare',
    'Sudan healthcare',
    'Tunisia healthcare',
    'Algeria healthcare',
    'Morocco healthcare',

    // Geographic - Global Markets
    'international healthcare platform',
    'global healthcare solution',
    'multilingual healthcare',
    'Arabic English healthcare',
    'bilingual healthcare platform',
    'emerging markets healthcare',
    'developing countries healthcare',

    // General Healthcare Professionals
    'doctors',
    'physicians',
    'medical doctors',
    'healthcare providers',
    'clinicians',
    'medical practitioners',
    'healthcare professionals',
    'medical staff',
    'clinical staff',
    'healthcare workers',

    // Nursing & Allied Health
    'nurses',
    'registered nurses',
    'nurse practitioners',
    'clinical nurses',
    'nursing staff',
    'physician assistants',
    'medical assistants',
    'healthcare assistants',
    'nursing home care',

    // Medical Specialties
    'primary care',
    'family medicine',
    'internal medicine',
    'general practice',
    'pediatrics',
    'pediatricians',
    'obstetrics',
    'gynecology',
    'obstetricians',
    'gynecologists',
    'cardiology',
    'cardiologists',
    'dermatology',
    'dermatologists',
    'endocrinology',
    'endocrinologists',
    'gastroenterology',
    'gastroenterologists',
    'hematology',
    'hematologists',
    'infectious disease',
    'nephrology',
    'nephrologists',
    'neurology',
    'neurologists',
    'oncology',
    'oncologists',
    'ophthalmology',
    'ophthalmologists',
    'orthopedics',
    'orthopedic surgeons',
    'otolaryngology',
    'ENT specialists',
    'psychiatry',
    'psychiatrists',
    'pulmonology',
    'pulmonologists',
    'rheumatology',
    'rheumatologists',
    'urology',
    'urologists',

    // Surgical Specialties
    'surgeons',
    'general surgery',
    'cardiothoracic surgery',
    'neurosurgery',
    'plastic surgery',
    'vascular surgery',
    'trauma surgery',
    'surgical care',

    // Emergency & Critical Care
    'emergency medicine',
    'emergency physicians',
    'critical care',
    'intensive care',
    'ICU doctors',
    'trauma care',
    'urgent care',

    // Diagnostic Specialties
    'radiology',
    'radiologists',
    'pathology',
    'pathologists',
    'medical imaging',
    'diagnostic imaging',
    'laboratory medicine',
    'clinical laboratory',

    // Therapeutic Specialties
    'physical therapy',
    'physical therapists',
    'occupational therapy',
    'occupational therapists',
    'speech therapy',
    'speech pathologists',
    'rehabilitation',
    'physiotherapy',

    // Mental Health
    'psychologists',
    'therapists',
    'mental health professionals',
    'behavioral health',
    'counselors',
    'psychiatric care',

    // Dental
    'dentists',
    'dental care',
    'oral health',
    'dental clinics',
    'orthodontists',

    // Pharmacy
    'pharmacists',
    'pharmacy management',
    'medication management',
    'pharmaceutical care',

    // Healthcare Settings
    'hospitals',
    'clinics',
    'medical centers',
    'healthcare facilities',
    'outpatient care',
    'ambulatory care',
    'private practice',
    'group practice',
    'medical offices',
    'health centers',
    'urgent care centers',
    'walk-in clinics',
    'specialty clinics',
    'surgical centers',
    'diagnostic centers',
    'imaging centers',

    // Clinical Services
    'patient management',
    'patient care',
    'clinical workflows',
    'medical records',
    'health records',
    'clinical documentation',
    'medical charting',
    'appointment scheduling',
    'patient scheduling',
    'prescription management',
    'medication orders',
    'lab orders',
    'test results',
    'medical billing',
    'insurance claims',
    'patient portal',
    'clinical decision support',
    'order entry',
    'e-prescribing',

    // Healthcare Administration
    'practice management',
    'clinic administration',
    'healthcare administration',
    'medical office management',
    'healthcare operations',
    'clinical operations',

    // Population Health
    'population health',
    'public health',
    'community health',
    'preventive care',
    'wellness programs',
    'chronic care management',
    'care coordination',
    'case management',

    // Compliance & Standards
    'healthcare compliance',
    'medical compliance',
    'GDPR compliant',
    'HL7',
    'FHIR',
    'health data security',
    'patient privacy',
    'medical data protection',

    // Technology Integration
    'healthcare interoperability',
    'medical device integration',
    'healthcare data exchange',
    'health information exchange',
    'medical APIs',
    'healthcare developers',
    'healthcare IT',
    'medical informatics',
    'clinical informatics',

    // Community & Education
    'healthcare community',
    'medical education',
    'clinical training',
    'medical students',
    'residency programs',
    'continuing medical education',
  ],
  authors: [{ name: 'Balsm', url: siteUrl }],
  creator: 'Balsm',
  publisher: 'Balsm',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // All committed rasters under public/, generated by
  // scripts/generate-brand-assets.mjs. Paths carry a file extension on
  // purpose: the next-intl middleware matcher skips anything with a dot, so an
  // extensionless metadata route (/icon, /opengraph-image) never reaches its
  // handler and crawlers get a 404 instead of an image.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
      { url: '/balsm-logo.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
  openGraph: openGraph({
    locale: 'en',
    title: 'Balsm - Open Source Healthcare Platform',
    description: 'Join Balsm - the open source healthcare platform built for providers, patients, and developers. Transparent, community-driven, and accessible to all.',
  }),
  twitter: twitter({
    title: 'Balsm - Open Source Healthcare Platform',
    description: 'Join Balsm - the open source healthcare platform built for providers, patients, and developers.',
  }),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: alternates('en'),
  category: 'Healthcare Technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
