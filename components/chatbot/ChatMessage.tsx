import type { ChatAction, ChatMessage as ChatMessageType } from '@/hooks/useChatbot';

type ChatMessageProps = {
  message: ChatMessageType;
  onAction: (action: ChatAction) => void;
};

function FormattedText({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 text-[15px] max-w-full overflow-hidden break-words">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />; // Spacer

        if (trimmed.startsWith('### ')) {
          return <h3 key={idx} className="font-semibold text-base mt-3 mb-1 text-[#5c3716]">{trimmed.replace('### ', '')}</h3>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={idx} className="font-bold text-[17px] mt-4 mb-2 text-[#4A3322]">{trimmed.replace('## ', '')}</h2>;
        }
        if (trimmed.startsWith('# ')) {
          return <h1 key={idx} className="font-bold text-lg mt-4 mb-2 text-[#4A3322]">{trimmed.replace('# ', '')}</h1>;
        }
        
        let isList = false;
        let textContent = trimmed;
        if (trimmed.match(/^[-*]\s/)) {
          isList = true;
          textContent = trimmed.replace(/^[-*]\s/, '');
        } else if (trimmed.match(/^\d+\.\s/)) {
          isList = true;
          textContent = trimmed.replace(/^\d+\.\s/, '');
        }

        // Bold parsing
        const parts = textContent.split(/(\*\*.*?\*\*)/g);
        const renderedText = parts.map((p, i) => 
          p.startsWith('**') && p.endsWith('**') 
            ? <strong key={i} className="font-semibold text-[#3F2D1F]">{p.slice(2, -2)}</strong> 
            : p
        );

        if (isList) {
          return (
            <li key={idx} className="ml-5 list-outside list-disc pl-1 marker:text-[#C66A2B]">
              <span className="opacity-90">{renderedText}</span>
            </li>
          );
        }

        return (
          <p key={idx} className="leading-relaxed opacity-90">
            {renderedText}
          </p>
        );
      })}
    </div>
  );
}

export function ChatMessage({ message, onAction }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm border ${
          isUser 
            ? 'bg-[#E3C5A3] text-[#3F2D1F] border-[#D1B18D] rounded-br-sm' 
            : 'bg-white text-[#4A3322] border-[#E7D5BF] rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <p className="leading-relaxed text-[15px] break-words">{message.content}</p>
        ) : (
          <FormattedText content={message.content} />
        )}
        
        {message.actions && message.actions.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-[#E7D5BF]/50">
            {message.actions.map((action) => (
              <button
                key={`${message.id}-${action.url}`}
                type="button"
                onClick={() => onAction(action)}
                className="rounded-full shadow-sm border border-[#C66A2B] bg-[#FFF8EE] px-4 py-1.5 text-xs font-semibold text-[#8B4513] hover:bg-[#C66A2B] hover:text-white transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
