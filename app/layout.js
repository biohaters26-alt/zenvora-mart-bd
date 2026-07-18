import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import { STORE_NAME } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap"
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${STORE_NAME} | Premium Gadgets & Electronics in Bangladesh`,
    template: `%s | ${STORE_NAME}`
  },
  description:
    "Zenvora Mart BD — your trusted online store for premium earbuds, smart watches, mobile accessories and home gadgets across Bangladesh. Cash on delivery, bKash & Nagad accepted.",
  keywords: [
    "Zenvora Mart BD",
    "online shop Bangladesh",
    "earbuds Bangladesh",
    "smart watch BD",
    "gadgets online BD"
  ],
  openGraph: {
    title: `${STORE_NAME} | Premium Gadgets & Electronics`,
    description: "Shop premium earbuds, smart watches & gadgets with fast delivery across Bangladesh.",
    siteName: STORE_NAME,
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <AnalyticsScripts />
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppWidget />
        </CartProvider>
      </body>
    </html>
  );
}
