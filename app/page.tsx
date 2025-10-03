// app/page.tsx
'use client';

import Link from 'next/link';

export default function Page(): JSX.Element {
  return (
    <main style={{ maxWidth: 880, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Early Signal Scanner</h1>
        <p style={{ margin: '8px 0 0', opacity: 0.8 }}>
          Deployed on <b>signals.nextwaveaisuite.com</b>
        </p>
      </header>

      <section style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Status</h2>
        <ul style={{ lineHeight: 1.8, paddingLeft: 18 }}>
          <li>App is up if <code>/api/health</code> returns <code>{`{ ok: true }`}</code>.</li>
          <li>
            Health check:{' '}
            <a href="/api/health" target="_blank" rel="noreferrer">Open /api/health</a>
          </li>
          <li>
            Beginner dashboard:{' '}
            <Link href="/beginner">Go to /beginner</Link>
          </li>
        </ul>
      </section>

      <section style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>What next?</h2>
        <ol style={{ lineHeight: 1.8, paddingLeft: 18 }}>
          <li>If this page loads consistently, DNS + SSL + routing are good.</li>
          <li>Then open <Link href="/beginner">/beginner</Link> (the full UI).</li>
          <li>If /beginner flickers but this page doesn’t, we’ll fix a component on that route.</li>
        </ol>
      </section>

      <footer style={{ marginTop: 32, opacity: 0.7 }}>
        <small>Tip: if you just changed DNS, full propagation can take up to ~1–2 hours in some regions.</small>
      </footer>
    </main>
  );
      }
