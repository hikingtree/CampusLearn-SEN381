import './globals.css'

export const metadata = {
  title: 'CampusLearn',
  description: 'Campus learning management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
