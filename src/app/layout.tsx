import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import Head from "next/head";
import GoogleAnalytics from "./ga";
const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  const headersList = headers();
  const domain = headersList.get("host") as string;
  const customTitle = `${domain} is for sale | domainbrandy`;

  return {
    title: customTitle,
    description: `Looking for prime digital real estate? ${domain} is now available. Perfect for your next tech startup, or website.`,
    openGraph: {
      title: customTitle,
      description: `Looking for prime digital real estate? ${domain} is now available. Perfect for your next tech startup, or website.`,
      images: [
        {
          url: "https://domainbrandy.com/logo.png",
          width: 1200,
          height: 630,
          alt: "domainbrandy.com",
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
