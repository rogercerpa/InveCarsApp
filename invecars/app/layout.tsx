import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Karla } from "next/font/google";

const karla = Karla({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InveCars",
  description: "Fast Track your Inventory",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${karla.className} min-h-screen bg-slate-100 md:overflow-hidden`}
        >
          <div className="flex flex-col items-center justify-center gap-12 min-h-screen m-4">
            <div className="flex flex-col gap-8 w-full max-w-3xl">
              <div className="flex flex-col">
                <h2 className="text-4xl font-bold">InveCars</h2>
                <p className="text-xl italic font-light">
                  The best app for fast tracking your inventory.
                </p>
              </div>
              <div className="max-w-3xl">{children}</div>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}