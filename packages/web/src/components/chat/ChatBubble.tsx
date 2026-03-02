import type { ChatMessage } from "../../stores/chat";

const PILLAR_COLORS: Record<string, string> = {
  needs: "from-blue-600 to-blue-400",
  wants: "from-purple-600 to-purple-400",
  culture: "from-amber-600 to-amber-400",
  unexpected: "from-pink-600 to-pink-400",
};

interface ChatBubbleProps {
  message: ChatMessage;
  onConfirm: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function ChatBubble({ message, onConfirm, onDismiss }: ChatBubbleProps) {
  const isUser = message.role === "user";
  const isTransaction =
    message.parseResult?.intent === "transaction" && !message.confirmed;
  const isConfirmed = message.confirmed;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-purple-600 text-white"
            : "bg-gray-800 text-gray-100"
        }`}
      >
        <p className="text-sm">{message.text}</p>

        {isTransaction && message.parseResult?.transaction && (
          <div className="mt-2">
            <div
              className={`rounded-xl bg-gradient-to-r ${
                PILLAR_COLORS[message.parseResult.transaction.pillar] || "from-gray-600 to-gray-400"
              } p-3 text-sm`}
            >
              <div className="flex justify-between">
                <span className="font-medium">
                  {message.parseResult.transaction.label}
                </span>
                <span className="font-bold">
                  Rp {message.parseResult.transaction.amount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="mt-1 text-xs opacity-80">
                {message.parseResult.transaction.pillar} &middot;{" "}
                {message.parseResult.transaction.date}
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => onConfirm(message.id)}
                className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-500"
              >
                Confirm
              </button>
              <button
                onClick={() => onDismiss(message.id)}
                className="rounded-lg bg-gray-700 px-3 py-1 text-xs font-medium text-white hover:bg-gray-600"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {isConfirmed && (
          <div className="mt-1 text-xs text-green-400">Saved</div>
        )}
      </div>
    </div>
  );
}
