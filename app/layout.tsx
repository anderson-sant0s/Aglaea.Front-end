import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { SearchProvider } from "@/lib/search-context"
import { Providers } from "@/lib/providers"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Aglaea - Rede Social para Freelancers",
  description:
    "Conecte-se, mostre seu trabalho e encontre oportunidades. A plataforma criativa para freelancers.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="aglaea-theme">
            <SearchProvider>
              {children}
              <Toaster
                position="top-center"
                toastOptions={{
                  style: {
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  },
                }}
              />
            </SearchProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}