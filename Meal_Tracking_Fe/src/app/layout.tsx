import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MealTrack - Theo dõi dinh dưỡng & bữa ăn thông minh',
  description: 'Quản lý calo và macros hàng ngày với Spring Boot 21 & Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Anti-Hydration Mismatch Script for Browser Extensions (Bitwarden, UrbanVPN, etc.) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const removeExtAttrs = (node) => {
                    if (node && node.nodeType === 1) {
                      if (node.hasAttribute('bis_skin_checked')) node.removeAttribute('bis_skin_checked');
                      if (node.hasAttribute('bis_register')) node.removeAttribute('bis_register');
                    }
                  };
                  const observer = new MutationObserver((mutations) => {
                    for (let i = 0; i < mutations.length; i++) {
                      const m = mutations[i];
                      if (m.type === 'attributes') {
                        removeExtAttrs(m.target);
                      } else if (m.type === 'childList') {
                        m.addedNodes.forEach(removeExtAttrs);
                      }
                    }
                  });
                  observer.observe(document.documentElement, {
                    attributes: true,
                    childList: true,
                    subtree: true,
                    attributeFilter: ['bis_skin_checked', 'bis_register']
                  });
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
      >
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
