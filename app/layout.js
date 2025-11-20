import './globals.css'

export const metadata = {
  title: 'PokéMart - Cyber Edition',
  description: 'Access the global database of rare digital artifacts',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
