import './globals.css';

export const metadata = {
  title: 'Nandu Panakanti | Software Engineer — Backend & Distributed Systems, AI/LLM Engineering',
  description: 'Software engineer building distributed backend systems, LLM agent pipelines, and cloud infrastructure — Spring Boot, FastAPI, LangGraph, AWS.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
