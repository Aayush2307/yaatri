'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import { ToggleOpt } from '@/components/ui/ToggleOpt';
import { useOnboardingStore } from '@/store/onboardingStore';

const phoneRegex = /^[6-9]\d{9}$/;

export default function ProfilePage() {
  const router = useRouter();
  const intention = useOnboardingStore((s) => s.intention);
  const setProfile = useOnboardingStore((s) => s.setProfile);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [groupSize, setGroupSize] = useState(2);
  const [hasSenior, setHasSenior] = useState<boolean | null>(null);
  const [mobilityNeeds, setMobilityNeeds] = useState<string[]>(['none']);
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(['no_preference']);

  const canContinue = useMemo(() => name.trim() && phoneRegex.test(phone) && hasSenior !== null, [name, phone, hasSenior]);

  const toggleMulti = (value: string, current: string[], exclusive: string) => {
    if (value === exclusive) {
      return [exclusive];
    }
    const withoutExclusive = current.filter((i) => i !== exclusive);
    return withoutExclusive.includes(value) ? withoutExclusive.filter((i) => i !== value) : [...withoutExclusive, value];
  };

  return (
    <main className="min-h-screen bg-indigo-deepest px-5 pb-8 pt-6 text-star-white">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <div className="rounded-[12px] bg-gold-note/10 px-3 py-2 text-[11px] text-gold-note">Planning for: {intention?.label ?? 'Darshan & devotion'}</div>
        <h1 className="font-serif text-[28px] font-light leading-[1.18]">Help us care for your party well.</h1>

        <Field label="Name" required>
          <input value={name} onChange={(e) => setName(e.target.value)} className="min-h-[44px] w-full rounded-[10px] border-[0.5px] border-divider bg-transparent px-3 text-[13px]" />
        </Field>

        <Field label="WhatsApp number" required error={phone && !phoneRegex.test(phone) ? 'Enter a valid Indian number' : ''}>
          <div className="flex gap-2">
            <div className="flex min-h-[44px] items-center rounded-[10px] border-[0.5px] border-divider px-3 text-[13px]">+91 🇮🇳</div>
            <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="min-h-[44px] flex-1 rounded-[10px] border-[0.5px] border-divider bg-transparent px-3 text-[13px]" />
          </div>
        </Field>

        <Field label="Group size">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setGroupSize((v) => Math.max(1, v - 1))} className="min-h-[44px] w-11 rounded-[10px] border-[0.5px] border-divider">-</button>
            <div className="min-h-[44px] flex-1 rounded-[10px] border-[0.5px] border-divider px-3 py-3 text-center text-[13px]">{groupSize} travellers</div>
            <button type="button" onClick={() => setGroupSize((v) => Math.min(8, v + 1))} className="min-h-[44px] w-11 rounded-[10px] border-[0.5px] border-divider">+</button>
          </div>
        </Field>

        <Field label="Senior traveller (60+)?" required>
          <div className="flex gap-2">
            <ToggleOpt label="Yes, in our group" active={hasSenior === true} onClick={() => setHasSenior(true)} activeClass="bg-[rgba(29,158,117,0.2)] border-[rgba(29,158,117,0.5)] text-star-white" />
            <ToggleOpt label="No seniors" active={hasSenior === false} onClick={() => setHasSenior(false)} activeClass="bg-[rgba(83,74,183,0.2)] border-[rgba(83,74,183,0.5)] text-star-white" />
          </div>
        </Field>

        <Field label="Mobility needs">
          <div className="flex flex-wrap gap-2">
            {['none', 'wheelchair', 'palki_doli', 'elevator_room'].map((item) => (
              <Chip
                key={item}
                label={item.replace('_', ' ')}
                active={mobilityNeeds.includes(item)}
                onClick={() => setMobilityNeeds(toggleMulti(item, mobilityNeeds, 'none'))}
                activeClass="bg-[rgba(83,74,183,0.2)] border-[rgba(83,74,183,0.5)] text-star-white"
              />
            ))}
          </div>
        </Field>

        <Field label="Dietary preference">
          <div className="flex flex-wrap gap-2">
            {['satvik', 'jain', 'no_onion_garlic', 'no_preference'].map((item) => (
              <Chip
                key={item}
                label={item.replace(/_/g, ' ')}
                active={dietaryPrefs.includes(item)}
                onClick={() => setDietaryPrefs(toggleMulti(item, dietaryPrefs, 'no_preference'))}
                activeClass="bg-[rgba(83,74,183,0.2)] border-[rgba(83,74,183,0.5)] text-star-white"
              />
            ))}
          </div>
        </Field>

        <button
          type="button"
          disabled={!canContinue}
          onClick={() => {
            setProfile({ name, phone: `+91${phone}`, groupSize, hasSenior: !!hasSenior, mobilityNeeds, dietaryPrefs });
            router.push('/onboarding/language');
          }}
          className="min-h-[44px] rounded-[11px] bg-indigo-mid text-[13px] font-medium disabled:opacity-40"
        >
          Continue →
        </button>
      </div>
    </main>
  );
}
