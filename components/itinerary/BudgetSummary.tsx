'use client';

import { useState } from 'react';

interface BudgetItem {
  label: string;
  amountINR: number;
  note?: string;
}

interface Props {
  items: BudgetItem[];
  packageCostINR?: number;
  travelStyle?: 'Budget' | 'Comfort' | 'Premium';
}

export function BudgetSummary({ items, packageCostINR, travelStyle = 'Budget' }: Props) {
  const [expanded, setExpanded] = useState(false);
  const total = items.reduce((sum, item) => sum + item.amountINR, 0) + (packageCostINR ?? 0);

  return (
    <section
      style={{
        borderRadius: '14px',
        background: '#3A1E02',
        border: '0.5px solid rgba(196, 134, 42, 0.3)',
        padding: '14px',
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <p style={{ fontSize: '13px', fontWeight: 500, color: '#F5C842', margin: 0 }}>
          Estimated budget · {travelStyle}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <p style={{ fontSize: '16px', fontWeight: 500, color: '#F5A623', margin: 0 }}>
            ₹{total.toLocaleString('en-IN')}
          </p>
          <span style={{ fontSize: '11px', color: '#A07030' }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div style={{ marginTop: '12px' }}>
          {packageCostINR !== undefined && (
            <BudgetRow label="Package cost" amount={packageCostINR} />
          )}
          {items.map((item, i) => (
            <BudgetRow key={i} label={item.label} amount={item.amountINR} note={item.note} />
          ))}
          <div style={{ borderTop: '0.5px solid rgba(196,134,42,0.25)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '13px', color: '#F5A623', fontWeight: 500, margin: 0 }}>Total per person</p>
            <p style={{ fontSize: '16px', color: '#F5A623', fontWeight: 500, margin: 0 }}>₹{total.toLocaleString('en-IN')}</p>
          </div>
          <p style={{ fontSize: '10px', color: '#A07030', marginTop: 6, lineHeight: 1.4 }}>
            * Prices are estimates. Actual costs vary by travel date, group size, and availability.
          </p>
        </div>
      )}
    </section>
  );
}

function BudgetRow({ label, amount, note }: { label: string; amount: number; note?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '0.5px solid rgba(196,134,42,0.1)' }}>
      <div>
        <p style={{ fontSize: '12px', color: '#A07030', margin: 0 }}>{label}</p>
        {note && <p style={{ fontSize: '10px', color: '#6B4820', margin: '1px 0 0' }}>{note}</p>}
      </div>
      <p style={{ fontSize: '12px', color: '#F5C842', fontWeight: 500, margin: 0 }}>₹{amount.toLocaleString('en-IN')}</p>
    </div>
  );
}
