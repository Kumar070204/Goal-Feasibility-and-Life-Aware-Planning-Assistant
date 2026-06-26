import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ToastProvider } from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EON • Life-Aware Planning Engine",
  description: "Create personalized weekly goal schedules that adapt to your Google Calendar commitments automatically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex text-zinc-100 bg-[#08090a] overflow-hidden">
        <ToastProvider>
          <Sidebar />
          <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
            {/* Ambient background glow nodes */}
            <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-sky-500/5 blur-[120px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none -z-10"></div>
            
            <div className="flex-1 px-8 py-8 max-w-7xl w-full mx-auto">
              {children}
            </div>
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
