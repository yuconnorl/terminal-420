import "./global.css";

import clsx from "clsx";
import type { Metadata } from "next";
import localFont from "next/font/local";

// import AnalyticsWrapper from "../components/analytics";
import Sidebar from "@/components/Sidebar";

const roboto = localFont({
  src: "../public/fonts/roboto-serif-light.ttf",
  weight: "300",
  variable: "--font-roboto",
  display: "swap",
});

// built-in SEO helper
export const metadata: Metadata = {
  title: {
    default: "test title",
    template: "%s | Testing title",
  },
  description: "description",
  openGraph: {
    title: "Lee Robinson",
    description: "Developer, writer, and creator.",
    url: "https://leerob.io",
    siteName: "Lee Robinson",
    images: [
      {
        url: "https://leerob.io/og.jpg",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    shortcut: "/favicon.ico",
  },
  verification: {
    google: "eZSdmzAXlLkKhNJzfgwDqWORghxnJ8qR9_CHdAh5-xw",
    yandex: "14d2e73487fa6c71",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
      className={clsx(
        "bg-white text-black dark:bg-[#111010] dark:text-white",
        roboto.variable
      )}
    >
      <body className="mx-4 mb-40 mt-8 flex max-w-4xl flex-col antialiased md:mt-20 md:flex-row lg:mx-auto lg:mt-32">
        <Sidebar />
        <main className="mt-6 flex min-w-0 flex-auto flex-col px-2 md:mt-0 md:px-0">
          {children}
          {/* <AnalyticsWrapper /> */}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
