import { useState } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <div className="flex gap-2 p-4 border-t border-gray-800 bg-gray-950">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type a transaction or question..."
        disabled={disabled}
        className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        className="rounded-xl bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-500 disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
}
