'use client';
import { useState } from 'react';
import { useMeera, type Intention, type SceneKey } from './MeeraContext';

const INTENTIONS: Array<{
  key: NonNullable<Intention>;
  scene: SceneKey;
  icon: string;
  title: string;
  desc: string;
}> = [
  { key: 'healing',   scene: 'dawn', icon: '🌅', title: 'Healing',   desc: 'To release grief, illness, or burden carried too long' },
  { key: 'gratitude', scene: 'gold', icon: '🙏', title: 'Gratitude', desc: "To honour a blessing, a vow, or a life's grace" },
  { key: 'seeking',   scene: 'deep', icon: '🪔', title: 'Seeking',   desc: "To find clarity, direction, or a question's answer" },
  { key: 'devotion',  scene: 'fire', icon: '🕉',  title: 'Devotion',  desc: 'Pure love for the divine — no reason needed beyond this' },
];

const OPENING_MESSAGES: Record<NonNullable<Intention>, string> = {
  healing:   "Jai Shri Ram. I sense your heart carries something. Let Varanasi's sacred Ganga hold what you can no longer carry alone. Where are you travelling from?",
  gratitude: 'Jai Shri Ram. What a beautiful reason to begin a journey. Gratitude is itself a prayer. Tell me about the blessing you wish to honour.',
  seeking:   "Jai Shri Ram. The seeker is already on the path. The Himalayas have a way of answering questions you didn't know you were asking. What is it you seek?",
  devotion:  'Jai Shri Ram. The purest sankalp of all — simply love. Vrindavan was made for souls like yours. Shall we begin planning your sacred journey?',
};

interface SankalpGateProps {
  onComplete: (intention: Intention, openingMessage: string) => void;
}

export function SankalpGate({ onComplete }: SankalpGateProps) {
  const { setIntention, setScene } = useMeera();
  const [selected, setSelected] = useState<Intention>(null);
  const [exiting, setExiting] = useState(false);

  function select(item: typeof INTENTIONS[0]) {
    setSelected(item.key);
    setScene(item.scene);
    setIntention(item.key);
    setExiting(true);
    setTimeout(() => {
      onComplete(item.key, OPENING_MESSAGES[item.key]);
    }, 700);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: '0 24px',
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'translateY(-12px)' : 'translateY(0)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {/* Question */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 40,
          animation: 'meera-fade-up 0.7s ease 0.2s both',
        }}
      >
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--meera-font-label, Cinzel, serif)',
            fontSize: 10,
            letterSpacing: '0.4em',
            color: 'var(--meera-saffron, #E8843A)',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          ✦ Before we begin ✦
        </span>
        <h2
          style={{
            fontFamily: 'var(--meera-font-display, Cormorant Garamond, serif)',
            fontSize: 'clamp(22px, 4vw, 30px)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.4,
            color: 'var(--meera-text-primary, #F5E8C8)',
            marginBottom: 10,
            margin: '0 0 10px',
          }}
        >
          What calls you to seek<br />a sacred journey?
        </h2>
        <p
          style={{
            fontSize: 15,
            color: 'var(--meera-text-secondary)',
            fontWeight: 300,
            fontFamily: 'var(--meera-font-body, Crimson Pro, serif)',
            fontStyle: 'italic',
            margin: 0,
          }}
        >
          Your intention shapes everything Meera will offer you.
        </p>
      </div>

      {/* Intention Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          width: '100%',
          maxWidth: 420,
          animation: 'meera-fade-up 0.7s ease 0.45s both',
        }}
      >
        {INTENTIONS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => select(item)}
            style={{
              padding: '18px 16px',
              border: `1px solid ${selected === item.key ? 'var(--meera-saffron)' : 'var(--meera-border)'}`,
              borderRadius: 4,
              background: selected === item.key
                ? 'rgba(232, 132, 58, 0.12)'
                : 'rgba(26, 20, 16, 0.65)',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              minHeight: 44,
            }}
            onMouseEnter={(e) => {
              if (selected !== item.key) {
                (e.currentTarget).style.borderColor = 'rgba(212, 168, 83, 0.45)';
                (e.currentTarget).style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== item.key) {
                (e.currentTarget).style.borderColor = 'var(--meera-border)';
                (e.currentTarget).style.transform = 'translateY(0)';
              }
            }}
          >
            <span style={{ fontSize: 22, display: 'block', marginBottom: 8 }}>{item.icon}</span>
            <div
              style={{
                fontFamily: 'var(--meera-font-label)',
                fontSize: 11,
                letterSpacing: '0.15em',
                color: 'var(--meera-gold)',
                marginBottom: 5,
                textTransform: 'uppercase',
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'var(--meera-text-secondary)',
                lineHeight: 1.5,
                fontWeight: 300,
                fontFamily: 'var(--meera-font-body)',
              }}
            >
              {item.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
