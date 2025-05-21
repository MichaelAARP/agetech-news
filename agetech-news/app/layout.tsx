import type { Metadata } from "next";
import { Lato } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import Header from '../components/Header';

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "AgeTech News",
  description: "News from the Agetech Collaborative",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={lato.variable}>
        <Header />
        {children}
      </body>
    </html>
  );
}
