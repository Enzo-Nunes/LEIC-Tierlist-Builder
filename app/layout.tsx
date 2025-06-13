import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LEIC Program Tierlist',
  description: 'Rank your college undergraduate programs with friends',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
