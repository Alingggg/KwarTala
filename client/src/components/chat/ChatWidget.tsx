import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { FiMessageCircle, FiRotateCcw, FiSend, FiX } from "react-icons/fi";
import { isAxiosError } from "axios";
import { useClearChat, useCurrencyContext, useSendMessage } from "@/hooks";
import ChatMarkdown from "./ChatMarkdown";

interface ChatMessage {
  role: "user" | "assistant" | "error";
  text: string;
}

const MAX_MESSAGE_LENGTH = 500;
const ERROR_FALLBACK = "Something went wrong. Please try again.";

const SUGGESTIONS = [
  "How much did I spend this month?",
  "What's my biggest expense category?",
  "How much budget do I have left?",
];

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { currency } = useCurrencyContext();
  const { mutate: sendMessage, isPending } = useSendMessage();
  const { mutate: clearChat } = useClearChat();
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    clearChat();
  }, [clearChat]);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isPending, isOpen]);

  const resizeInput = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(resizeInput, [input]);

  const send = (text: string) => {
    const message = text.trim();
    if (!message || isPending) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");

    sendMessage(
      { message, currency: currency ?? "₱" },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", text: data.reply },
          ]);
        },
        onError: (error) => {
          const text = isAxiosError(error)
            ? error.response?.data?.message
            : undefined;
          setMessages((prev) => [
            ...prev,
            { role: "error", text: text ?? ERROR_FALLBACK },
          ]);
        },
      }
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const startNewChat = () => {
    clearChat();
    setMessages([]);
    setInput("");
  };

  const bubbleStyles = {
    user: "self-end bg-night-500 text-timberwolf-900 whitespace-pre-wrap",
    assistant: "self-start bg-timberwolf-700 text-night-500",
    error: "self-start bg-auburn-900 text-auburn-500 whitespace-pre-wrap",
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-timberwolf-900 md:inset-auto md:bottom-24 md:right-6 md:z-40 md:w-96 md:h-[32rem] md:rounded-xl md:shadow-2xl md:overflow-hidden">
          <div className="flex items-center justify-between bg-night-500 text-timberwolf-900 px-4 py-3">
            <p className="font-semibold">KwarTala Assistant</p>
            <div className="flex items-center gap-1">
              <button
                onClick={startNewChat}
                disabled={isPending || messages.length === 0}
                title="New chat"
                aria-label="New chat"
                className="p-2 rounded-lg hover:bg-night-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                <FiRotateCcw size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                aria-label="Close chat"
                className="p-2 rounded-lg hover:bg-night-600 transition-colors cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col h-full justify-end gap-2">
                <p className="text-sm text-night-700 mb-2">
                  Hi! I can look up your spending, add or edit expenses, and
                  set your budget. Try asking:
                </p>
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => send(suggestion)}
                    className="text-left text-sm border border-night-600 text-night-600 rounded-lg px-3 py-2 hover:bg-timberwolf-600 transition-colors cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm break-words ${
                      bubbleStyles[message.role]
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <ChatMarkdown text={message.text} />
                    ) : (
                      message.text
                    )}
                  </div>
                ))}
                {isPending && (
                  <div className="self-start flex gap-1 rounded-xl bg-timberwolf-700 px-3 py-3">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-2 h-2 rounded-full bg-night-700 animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-timberwolf-500 p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                maxLength={MAX_MESSAGE_LENGTH}
                rows={1}
                className="flex-1 max-h-32 resize-none bg-timberwolf-800 border border-timberwolf-500 rounded-md p-2 px-3 text-sm text-night-500 focus:ring-2 focus:ring-night-600 outline-none"
              />
              <button
                onClick={() => send(input)}
                disabled={isPending || !input.trim()}
                aria-label="Send message"
                className="p-2.5 rounded-md bg-night-600 text-timberwolf-900 hover:bg-night-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-night-600"
              >
                <FiSend size={18} />
              </button>
            </div>
            <p
              className={`mt-1 text-right text-xs ${
                input.length >= MAX_MESSAGE_LENGTH
                  ? "text-auburn-500"
                  : "text-night-700"
              }`}
            >
              {input.length}/{MAX_MESSAGE_LENGTH}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className={`fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-night-500 text-timberwolf-900 hover:bg-night-600 shadow-lg transition-colors cursor-pointer items-center justify-center ${
          isOpen ? "hidden md:flex" : "flex"
        }`}
      >
        {isOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </button>
    </>
  );
}

export default ChatWidget;
