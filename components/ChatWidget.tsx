"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function renderMessageContent(text: string, isUser: boolean) {
  // Convert markdown links [text](url) and bare URLs into clickable links
  const parts = text.split(/(\[.*?\]\(.*?\)|https?:\/\/[^\s)]+)/g);
  return parts.map((part, i) => {
    // Markdown link: [text](url)
    const mdMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (mdMatch) {
      return (
        <a
          key={i}
          href={mdMatch[2]}
          target={mdMatch[2].startsWith("http") ? "_blank" : undefined}
          rel={mdMatch[2].startsWith("http") ? "noopener noreferrer" : undefined}
          className={`underline font-semibold ${isUser ? "text-white" : "text-primary"}`}
        >
          {mdMatch[1]}
        </a>
      );
    }
    // Bare URL
    if (part.match(/^https?:\/\//)) {
      const label = part.includes("book-online")
        ? "Book an Orientation"
        : part.includes("service-page")
          ? "Book Here"
          : part.includes("participant-complaints")
            ? "File a Complaint"
            : "Visit Link";
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline font-semibold ${isUser ? "text-white" : "text-primary"}`}
        >
          {label}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data.message) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'm having trouble right now. Please call us at 414-600-3745 or email Info@TheMindfulGroupInc.Org.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting. Please call us at 414-600-3745.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary hover:bg-primary-light text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
            aria-label="Open chat"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-120px)] bg-white rounded-xl shadow-2xl border border-border-light flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary px-5 py-4 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-white font-semibold text-sm">
                  The Mindful Group
                </h3>
                <p className="text-white/70 text-xs">
                  Ask us anything about our programs
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p className="text-text font-semibold text-sm mb-2">
                    Welcome!
                  </p>
                  <p className="text-text-light text-xs leading-relaxed mb-4">
                    I can help with program info, enrollment,
                    support services, and more.
                  </p>
                  <div className="space-y-2">
                    {[
                      "What programs do you offer?",
                      "How do I enroll?",
                      "Do you help with transportation?",
                      "I want to donate or volunteer",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setInput(q);
                          setTimeout(() => {
                            const fakeEvent = { preventDefault: () => {} };
                            void fakeEvent;
                            setMessages([{ role: "user", content: q }]);
                            setLoading(true);
                            fetch("/api/chat", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                messages: [{ role: "user", content: q }],
                              }),
                            })
                              .then((r) => r.json())
                              .then((data) => {
                                setMessages((prev) => [
                                  ...prev,
                                  {
                                    role: "assistant",
                                    content:
                                      data.message ||
                                      "Please call us at 414-600-3745.",
                                  },
                                ]);
                              })
                              .catch(() => {
                                setMessages((prev) => [
                                  ...prev,
                                  {
                                    role: "assistant",
                                    content: "Please call us at 414-600-3745.",
                                  },
                                ]);
                              })
                              .finally(() => {
                                setLoading(false);
                                setInput("");
                              });
                          }, 0);
                        }}
                        className="block w-full text-left px-3 py-2 text-xs text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed rounded-xl ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-surface text-text rounded-bl-sm"
                    }`}
                  >
                    {renderMessageContent(msg.content, msg.role === "user")}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-surface text-text-light px-4 py-3 rounded-xl rounded-bl-sm text-sm">
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 bg-text-light/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-text-light/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-text-light/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Talk to Human Banner */}
            <div className="px-4 py-2 bg-surface border-t border-border-light">
              <p className="text-[11px] text-text-light text-center">
                Need a person?{" "}
                <a
                  href="tel:4146003745"
                  className="text-primary font-semibold hover:underline"
                >
                  Call 414-600-3745
                </a>{" "}
                or{" "}
                <a
                  href="mailto:Info@TheMindfulGroupInc.Org"
                  className="text-primary font-semibold hover:underline"
                >
                  email us
                </a>
              </p>
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border-light shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  disabled={loading}
                  className="flex-1 bg-surface border border-border-light rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-light/50 focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-primary hover:bg-primary-light text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
