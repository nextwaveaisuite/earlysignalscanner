// components/BeginnerPanel.tsx
'use client';
import React, { useState } from 'react';

export type BeginnerPrefs = {
  simpleMode: boolean;
  safetyOnly: boolean;
  minConfidence: 'LOW' | 'MED' | 'HIGH';
  autoExplain: boolean;
};

export default function BeginnerPanel({
  onChange,
}: {
  onChange?: (p: BeginnerPrefs) => void;
}): JSX.Element {
  const [prefs, setPrefs] = useState<BeginnerPrefs>({
    simpleMode: true,
    safetyOnly: true,
    minConfidence: 'MED',
    autoExplain: true,
  });

  function upd<K extends keyof BeginnerPrefs>(k: K, v: BeginnerPrefs[K]) {
    const np = { ...prefs, [k]: v };
    setPrefs(np);
    onChange?.(np); // only call if the parent provided a handler
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="h1">Easy Mode</div>
      <p className="sub">One-click settings for anyone. Keep it on and the software filters for you.</p>

      <div className="list">
        <label className="row" style={{ cursor: 'pointer' }}>
          <div className="left">
            <b>Simple Mode</b>
            <span className="small"> · Hide jargon, show plain-English</span>
          </div>
          <input
            type="checkbox"
            checked={prefs.simpleMode}
            onChange={(e) => upd('simpleMode', e.target.checked)}
          />
        </label>

        <label className="row" style={{ cursor: 'pointer' }}>
          <div className="left">
            <b>Safety-Only</b>
            <span className="small"> · Show GREEN-risk picks only</span>
          </div>
          <input
            type="checkbox"
            checked={prefs.safetyOnly}
            onChange={(e) => upd('safetyOnly', e.target.checked)}
          />
        </label>

        <label className="row" style={{ cursor: 'pointer' }}>
          <div className="left">
            <b>Minimum Confidence</b>
            <span className="small"> · Filter LOW/MED/HIGH</span>
          </div>
          <select
            value={prefs.minConfidence}
            onChange={(e) => upd('minConfidence', e.target.value as BeginnerPrefs['minConfidence'])}
          >
            <option value="LOW">Low</option>
            <option value="MED">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </label>

        <label className="row" style={{ cursor: 'pointer' }}>
          <div className="left">
            <b>Auto-Explain</b>
            <span className="small"> · Always show reasons in plain English</span>
          </div>
          <input
            type="checkbox"
            checked={prefs.autoExplain}
            onChange={(e) => upd('autoExplain', e.target.checked)}
          />
        </label>
      </div>
    </div>
  );
}
