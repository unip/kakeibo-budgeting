import { useRef, useEffect } from "react";
import { useChatStore } from "../stores/chat";
import { ChatInput } from "../components/chat/ChatInput";
import { ChatBubble } from "../components/chat/ChatBubble";

export function HomePage() {
  const { messages, loading, send, confirm, dismiss } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen flex-col bg-gray-950">
      <header className="border-b border-gray-800 px-4 py-3">
        <h1 className="text-lg font-bold text-white">Kakeibo</h1>
        <p className="text-xs text-gray-400">
          Type a transaction or ask a question
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">Welcome to Kakeibo</p>
              <p className="mt-1 text-sm">
                Try: &quot;bought coffee 45k&quot; or &quot;total expenses this
                month&quot;
              </p>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            onConfirm={confirm}
            onDismiss={dismiss}
          />
        ))}
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="rounded-2xl bg-gray-800 px-4 py-3 text-sm text-gray-400">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={send} disabled={loading} />
    </div>
  );
}
