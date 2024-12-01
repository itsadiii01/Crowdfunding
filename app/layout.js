import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Crowdfunding DApp',
  description: 'A decentralized crowdfunding platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="container mx-auto px-4">
          {children}
        </main>
      </body>
    </html>
  )
}