type ChatHeaderProps = {
  onClose: () => void;
  isOnline?: boolean;
};

export function ChatHeader({ onClose, isOnline = true }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-[#C66A2B] px-5 py-4 text-white">
      <div>
        <p className="text-base font-semibold">Yaatri AI Assistant</p>
        <div className="flex items-center gap-2 text-xs text-[#FFF8EE] opacity-90 mt-0.5">
          <span className="inline-flex h-2 w-2 rounded-full bg-[#1D9E75]" title={isOnline ? 'Online' : 'Away'} />
          <span>{isOnline ? 'Online' : 'Away'}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="rounded-full border border-white/20 bg-black/10 px-3 py-1.5 text-xs font-medium hover:bg-black/20 transition-colors"
        aria-label="Close chat"
      >
        Close
      </button>
    </div>
  );
}
