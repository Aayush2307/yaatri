import { MeeraProvider } from '@/components/meera-ui/MeeraContext';

export default function ConciergeLayout({ children }: { children: React.ReactNode }) {
  return <MeeraProvider>{children}</MeeraProvider>;
}
