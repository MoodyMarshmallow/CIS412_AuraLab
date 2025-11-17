import type { Metadata } from 'next';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider';
import './globals.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

export const metadata: Metadata = {
  title: 'AuraLab Campaign Manager',
  description: 'Concept UI for AuraLab campaign orchestration'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="light" theme={{
          fontFamily: 'Inter, var(--font-default)',
          defaultRadius: 'lg',
          colors: {
            brand: ['#fff3eb', '#ffe0cc', '#ffc3a0', '#ff9c66', '#ff7e3b', '#f0621b', '#c74c12', '#9e3b10', '#7d300f', '#64280d']
          },
          primaryColor: 'brand'
        }}>
          <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
