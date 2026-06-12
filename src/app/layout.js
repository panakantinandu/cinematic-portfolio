import './globals.css';

export const metadata = {
  title: 'Nandu Panakanti | Full-Stack AI Engineer',
  description: 'Full-Stack AI Engineer shipping production-ready LLM agents, RAG pipelines, and SaaS platforms.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
