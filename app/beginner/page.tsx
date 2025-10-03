// app/beginner/page.tsx
'use client';

import Link from 'next/link';

export default function BeginnerPage(): JSX.Element {
  return (
    <main style={{ maxWidth: 880, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial' }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Beginner Dashboard</h1>
        <p style={{ margin: '8px 0 0', opacity: 0.8 }}>
          Plain-English, safety-first view.
        </p>
      </header>

      <section style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Status</h2>
        <ul style={{ lineHeight: 1.8, paddingLeft: 18 }}>
          <li>This page intentionally loads with zero custom components.</li>
          <li>If it’s stable, we’ll add features back gradually.</li>
          <li>Health check: <a href="/api/health" target="_blank" rel="noreferrer">/api/health</a></li>
          <li>Home: <Link href="/">/</Link></li>
        </ul>
      </section>

      <section style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Next steps</h2>
        <ol style={{ lineHeight: 1.8, paddingLeft: 18 }}>
          <li>Confirm this page loads consistently (no flicker).</li>
          <li>Then we’ll re-enable components in small steps.</li>
        </ol>
      </section>
    </main>
  );
                    }
