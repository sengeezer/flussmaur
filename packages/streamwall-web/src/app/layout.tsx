import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ApolloClientProvider from "@/components/ApolloClientProvider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Streamwall - Multi-Stream Viewer",
  description: "View multiple live streams in a customizable grid layout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gray-50">
          <ApolloClientProvider>
            <Navigation />
            <main>
              {children}
            </main>
          </ApolloClientProvider>
        </div>
      </body>
    </html>
  );
}
