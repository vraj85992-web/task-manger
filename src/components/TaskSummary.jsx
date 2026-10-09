import React from 'react';
import { Layers, CircleDashed, CheckCircle2 } from 'lucide-react';

export default function TaskSummary({ counts }) {
  const cards = [
    {
      id: 'total',
      label: 'Total Tasks',
      value: counts.total,
      icon: Layers,
      className: 'total',
    },
    {
      id: 'open',
      label: 'Open',
      value: counts.open,
      icon: CircleDashed,
      className: 'open',
    },
    {
      id: 'completed',
      label: 'Completed',
      value: counts.completed,
      icon: CheckCircle2,
      className: 'completed',
    },
  ];

  return (
    <section className="summary-bar" aria-label="Task Summary Overview">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.id} className="summary-card">
            <div className="summary-info">
              <span className="summary-label">{card.label}</span>
              <span className="summary-value" id={`summary-count-${card.id}`}>
                {card.value}
              </span>
            </div>
            <div className={`summary-icon-pill ${card.className}`}>
              <Icon size={18} strokeWidth={2.2} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
