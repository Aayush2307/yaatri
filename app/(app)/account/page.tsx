'use client';

import { useEffect, useMemo, useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import BackButton from '@/components/BackButton';
import { getSupabaseClient } from '@/lib/supabaseClient';

type TravelStyle = 'Budget' | 'Comfortable' | 'Premium';
type StayPref = 'Dharamshala' | 'Standard hotel' | 'Premium hotel' | 'Ashram stay';
type FoodPref = 'Satvik' | 'Jain' | 'Regular vegetarian';
type Mobility = 'None' | 'Wheelchair support' | 'Minimal walking preferred' | 'Senior-friendly itinerary';
type Duration = '2–3 days' | '4–7 days' | '8–12 days' | 'Flexible';

type YatraProfile = {
  name: string;
  phone: string;
  homeCity: string;
  preferredLanguage: string;
  travellersCount: string;
  travellingWith: string[];
  mobilityNeeds: Mobility;
  travelStyle: TravelStyle;
  stayPreference: StayPref;
  foodPreference: FoodPref;
  interestedYatras: string[];
  preferredSeason: string;
  tripDuration: Duration;
  specialNotes: string;
};

const defaultProfile: YatraProfile = {
  name: '',
  phone: '',
  homeCity: '',
  preferredLanguage: '',
  travellersCount: '',
  travellingWith: [],
  mobilityNeeds: 'None',
  travelStyle: 'Comfortable',
  stayPreference: 'Standard hotel',
  foodPreference: 'Satvik',
  interestedYatras: [],
  preferredSeason: '',
  tripDuration: 'Flexible',
  specialNotes: '',
};

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition ${
        active ? 'border-[#C66A2B] bg-[#F2E0C8] text-[#7A4A24]' : 'border-[rgba(43,33,25,0.16)] bg-[#FFFCF7] text-[#7A6A5A]'
      }`}
    >
      {label}
    </button>
  );
}

export default function AccountPage() {
  const [profile, setProfile] = useState<YatraProfile>(defaultProfile);
  const [savedAt, setSavedAt] = useState<string>('');
  const [saveMessage, setSaveMessage] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('yaatra_profile');
    const user = localStorage.getItem('yaatri_user');
    const parsedUser = user ? JSON.parse(user) : {};

    if (stored) {
      const parsed = JSON.parse(stored);
      setProfile({ ...defaultProfile, ...parsed, name: parsed.name || parsedUser.name || '', phone: parsed.phone || parsedUser.phone || '' });
    } else {
      setProfile((prev) => ({ ...prev, name: parsedUser.name || '', phone: parsedUser.phone || '' }));
    }
  }, []);

  const initials = useMemo(() => (profile.name || 'Y').trim().slice(0, 1).toUpperCase(), [profile.name]);

  const toggleValue = (field: 'travellingWith' | 'interestedYatras', value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((v) => v !== value) : [...prev[field], value],
    }));
  };

  const saveProfile = async () => {
    localStorage.setItem('yaatra_profile', JSON.stringify(profile));
    setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setSaveMessage('Saved on this device.');

    const supabase = getSupabaseClient();
    if (!supabase) {
      setSaveMessage('Saved on this device. Online sync will retry later.');
      return;
    }

    try {
      const storedId = localStorage.getItem('yaatri_profile_id');
      const payload = { ...profile, updated_at: new Date().toISOString() };

      if (storedId) {
        const { error } = await supabase.from('yatra_profiles').update(payload).eq('id', storedId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('yatra_profiles').insert(payload).select('id').single();
        if (error) throw error;
        if (data?.id) localStorage.setItem('yaatri_profile_id', String(data.id));
      }

      setSaveMessage('Saved on this device and synced online.');
    } catch {
      setSaveMessage('Saved on this device. Online sync will retry later.');
    }
  };

  const shareWithMeera = () => {
    const number = process.env.NEXT_PUBLIC_MEERA_WHATSAPP_NUMBER?.replace(/\D/g, '') || process.env.NEXT_PUBLIC_CONCIERGE_WHATSAPP?.replace(/\D/g, '') || 'REPLACE_WITH_NUMBER';
    const summary = `Namaste Meera, sharing my Yatra Profile:\nName: ${profile.name || '-'}\nPhone: ${profile.phone || '-'}\nHome city: ${profile.homeCity || '-'}\nLanguage: ${profile.preferredLanguage || '-'}\nTravellers: ${profile.travellersCount || '-'}\nTravelling with: ${profile.travellingWith.join(', ') || '-'}\nMobility needs: ${profile.mobilityNeeds}\nTravel style: ${profile.travelStyle}\nStay preference: ${profile.stayPreference}\nFood preference: ${profile.foodPreference}\nInterested yatras: ${profile.interestedYatras.join(', ') || '-'}\nPreferred season/month: ${profile.preferredSeason || '-'}\nTrip duration: ${profile.tripDuration}\nSpecial notes: ${profile.specialNotes || '-'}`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(summary)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#F5F0E8] pb-28 text-[#2B2119]">
      <div className="mx-auto max-w-md space-y-4 px-4 pt-6">
        <BackButton />

        <section>
          <p className="text-sm tracking-[0.12em] text-[#8A7665]">Account</p>
          <h1 className="pt-2 font-serif text-4xl leading-tight">Your Yatra Profile</h1>
          <p className="pt-3 text-sm leading-relaxed text-[#8A7665]">
            Help Meera understand your family, travel needs, and preferences before planning your sacred journey.
          </p>
        </section>

        <section className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2E2CB] text-[#A65A22]">{initials}</div>
            <p className="text-sm text-[#7A6A5A]">Yaatra Travel Profile</p>
          </div>
          <div className="space-y-3">
            <input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className="w-full rounded-xl border border-[rgba(43,33,25,0.12)] bg-white px-3 py-2 text-sm" />
            <input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone number" className="w-full rounded-xl border border-[rgba(43,33,25,0.12)] bg-white px-3 py-2 text-sm" />
            <input value={profile.homeCity} onChange={(e) => setProfile((p) => ({ ...p, homeCity: e.target.value }))} placeholder="Home city" className="w-full rounded-xl border border-[rgba(43,33,25,0.12)] bg-white px-3 py-2 text-sm" />
            <input value={profile.preferredLanguage} onChange={(e) => setProfile((p) => ({ ...p, preferredLanguage: e.target.value }))} placeholder="Preferred language" className="w-full rounded-xl border border-[rgba(43,33,25,0.12)] bg-white px-3 py-2 text-sm" />
          </div>
        </section>

        <section className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <h2 className="font-serif text-xl">Family & Travellers</h2>
          <input value={profile.travellersCount} onChange={(e) => setProfile((p) => ({ ...p, travellersCount: e.target.value }))} placeholder="Number of travellers" className="mt-3 w-full rounded-xl border border-[rgba(43,33,25,0.12)] bg-white px-3 py-2 text-sm" />
          <div className="mt-3 flex flex-wrap gap-2">{['Parents', 'Children', 'Senior citizens', 'Couple', 'Solo'].map((v) => <Chip key={v} label={v} active={profile.travellingWith.includes(v)} onClick={() => toggleValue('travellingWith', v)} />)}</div>
          <p className="mt-4 text-xs text-[#8A7665]">Any mobility needs?</p>
          <div className="mt-2 flex flex-wrap gap-2">{(['None', 'Wheelchair support', 'Minimal walking preferred', 'Senior-friendly itinerary'] as Mobility[]).map((v) => <Chip key={v} label={v} active={profile.mobilityNeeds === v} onClick={() => setProfile((p) => ({ ...p, mobilityNeeds: v }))} />)}</div>
        </section>

        <section className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <h2 className="font-serif text-xl">Travel Comfort</h2>
          <p className="mt-3 text-xs text-[#8A7665]">Travel style</p>
          <div className="mt-2 flex flex-wrap gap-2">{(['Budget', 'Comfortable', 'Premium'] as TravelStyle[]).map((v) => <Chip key={v} label={v} active={profile.travelStyle === v} onClick={() => setProfile((p) => ({ ...p, travelStyle: v }))} />)}</div>
          <p className="mt-3 text-xs text-[#8A7665]">Stay preference</p>
          <div className="mt-2 flex flex-wrap gap-2">{(['Dharamshala', 'Standard hotel', 'Premium hotel', 'Ashram stay'] as StayPref[]).map((v) => <Chip key={v} label={v} active={profile.stayPreference === v} onClick={() => setProfile((p) => ({ ...p, stayPreference: v }))} />)}</div>
          <p className="mt-3 text-xs text-[#8A7665]">Food preference</p>
          <div className="mt-2 flex flex-wrap gap-2">{(['Satvik', 'Jain', 'Regular vegetarian'] as FoodPref[]).map((v) => <Chip key={v} label={v} active={profile.foodPreference === v} onClick={() => setProfile((p) => ({ ...p, foodPreference: v }))} />)}</div>
        </section>

        <section className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <h2 className="font-serif text-xl">Yatra Preferences</h2>
          <div className="mt-3 flex flex-wrap gap-2">{['Char Dham', 'Jyotirlinga', 'Shakti Peethas', 'Pitru Tarpan', 'Family temple visit'].map((v) => <Chip key={v} label={v} active={profile.interestedYatras.includes(v)} onClick={() => toggleValue('interestedYatras', v)} />)}</div>
          <input value={profile.preferredSeason} onChange={(e) => setProfile((p) => ({ ...p, preferredSeason: e.target.value }))} placeholder="Preferred season/month" className="mt-3 w-full rounded-xl border border-[rgba(43,33,25,0.12)] bg-white px-3 py-2 text-sm" />
          <p className="mt-3 text-xs text-[#8A7665]">Approx trip duration</p>
          <div className="mt-2 flex flex-wrap gap-2">{(['2–3 days', '4–7 days', '8–12 days', 'Flexible'] as Duration[]).map((v) => <Chip key={v} label={v} active={profile.tripDuration === v} onClick={() => setProfile((p) => ({ ...p, tripDuration: v }))} />)}</div>
        </section>

        <section className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <h2 className="font-serif text-xl">Special Notes</h2>
          <textarea
            value={profile.specialNotes}
            onChange={(e) => setProfile((p) => ({ ...p, specialNotes: e.target.value }))}
            placeholder="E.g. travelling with parents, need less walking, prefer peaceful darshan timings..."
            className="mt-3 min-h-[96px] w-full rounded-xl border border-[rgba(43,33,25,0.12)] bg-white px-3 py-2 text-sm"
          />
        </section>

        <button onClick={saveProfile} type="button" className="w-full rounded-xl bg-[#C66A2B] py-3 text-sm font-medium text-[#FFF8EE]">Save Yatra Profile</button>
        <button onClick={shareWithMeera} type="button" className="w-full rounded-xl border border-[rgba(43,33,25,0.2)] bg-[#FFF8EE] py-3 text-sm text-[#7B4B2A]">Share with Meera</button>
        {savedAt && <p className="text-center text-xs text-[#8A7665]">Saved at {savedAt}</p>}
        {saveMessage && <p className="text-center text-xs text-[#8A7665]">{saveMessage}</p>}
      </div>
      <div className="fixed bottom-0 left-0 right-0"><BottomNav active="account" /></div>
    </main>
  );
}
