import type { Metadata } from 'next';
import './globals.css';
import { ModeProvider } from '@/lib/context/ModeContext';
import { MobileDemoProvider } from '@/components/shell/MobileDemoWrapper';
import { I18nProvider } from '@/lib/i18n/I18nContext';

export const metadata: Metadata = {
  title: 'BRIDGE - Personalized Engineering Learning Platform',
  description: 'Build • Reason • Intervene • Diagnose • Grow • Express',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="bg-page text-textMain antialiased selection:bg-primary selection:text-white">
        <I18nProvider>
          <ModeProvider>
            <MobileDemoProvider>
              {children}
            </MobileDemoProvider>
          </ModeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
