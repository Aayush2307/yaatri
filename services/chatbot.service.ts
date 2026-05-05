type ChatAction = {
  type: 'redirect';
  label: string;
  url: string;
};

type ChatbotResponse = {
  message: string;
  actions: ChatAction[];
  intent: string;
  sessionId?: string | null;
};

export async function sendChatMessage(message: string, sessionId: string | null, authToken?: string | null) {
  const response = await fetch('/api/chatbot/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId, authToken }),
  });

  if (!response.ok) {
    let errorMessage = 'Chat request failed';
    try {
      const data = (await response.json()) as { message?: string };
      if (data?.message) errorMessage = data.message;
    } catch {
      // Ignore JSON parsing errors.
    }
    throw new Error(errorMessage);
  }

  return (await response.json()) as ChatbotResponse;
}
