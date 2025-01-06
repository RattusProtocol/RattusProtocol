import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Rat Experiment Simulator",
  description: "Sci-fi rat experiment simulator with crypto-linked compound injections",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: '',
            style: {
              background: 'rgba(26, 0, 51, 0.9)',
              color: '#d8b4fe',
              border: '1px solid rgba(147, 51, 234, 0.2)',
              fontFamily: 'monospace',
              backdropFilter: 'blur(8px)',
            },
            success: {
              iconTheme: {
                primary: '#d8b4fe',
                secondary: 'rgba(26, 0, 51, 0.9)',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
