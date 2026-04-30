export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#F5F0E8]">
      <div className="mx-auto w-full max-w-[430px] min-h-[100dvh] bg-[#F5F0E8]">
        {children}
      </div>
    </div>
  );
}
