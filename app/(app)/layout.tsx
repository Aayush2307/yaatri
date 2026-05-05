import { ChatWidget } from '@/components/chatbot';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#F5F0E8] relative flex justify-center">
      <div className="w-full max-w-md md:max-w-5xl lg:max-w-6xl xl:max-w-7xl min-h-[100dvh] bg-[#FAF5EB] relative pb-20 md:pb-24 shadow-sm border-x border-[#E7D5BF]/40 flex flex-col">
        {children}
        <ChatWidget />
      </div>
    </div>
  );
}
