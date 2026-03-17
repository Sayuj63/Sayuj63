"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "bot" | "user";
  text: string;
}

const GREETING: Message = {
  role: "bot",
  text: "Hello! I am MISHA, your personal AI Mentor at MentorLeap.\nHow can I help you accelerate your career today?",
};

export default function AiAssistantPage() {
    const [messages, setMessages] = useState<Message[]>([GREETING]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const send = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const val = input.trim();
        if (!val || isTyping) return;

        const userMsg: Message = { role: "user", text: val };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const history = messages.slice(1).map(m => ({ 
                role: m.role === "bot" ? "assistant" : "user", 
                content: m.text 
            }));
            history.push({ role: "user", content: val });

            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: history, message: val }),
            });
            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                { role: "bot", text: data.reply || "I encountered an error. Please try again." },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "I'm having a connection glitch. Can you check your connection?" },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 p-10 h-full flex flex-col min-h-[85vh]">
            <div className="mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00e5ff] to-[#6366f1] flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                    <Sparkles size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white">MISHA</h1>
                    <p className="text-[#00e5ff] font-bold text-[10px] uppercase tracking-[0.2em]">Your Personal AI Mentor</p>
                </div>
            </div>

            <Card className="!p-0 bg-[#020617] border-white/10 flex flex-col flex-1 shadow-2xl overflow-hidden relative">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#00e5ff]/5 blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10 w-full">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex gap-4 max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 mt-1">
                                {m.role === "bot" ? <Bot size={16} className="text-[#00e5ff]" /> : <User size={16} className="text-[#cbd5f5]" />}
                            </div>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                m.role === "bot" 
                                ? "bg-white/5 border border-white/5 text-[#cbd5f5] rounded-tl-sm"
                                : "bg-gradient-to-br from-[#00e5ff] to-[#6366f1] text-[#020617] font-medium rounded-tr-sm"
                            }`}>
                                {m.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-4 max-w-[85%] mr-auto">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 mt-1">
                                <Bot size={16} className="text-[#00e5ff]" />
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 rounded-tl-sm flex items-center gap-1.5 h-[52px]">
                                <div className="w-2 h-2 rounded-full bg-[#00e5ff] animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-[#00e5ff] animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 rounded-full bg-[#00e5ff] animate-bounce [animation-delay:-0.3s]"></div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                <div className="p-4 border-t border-white/10 bg-[#0f172a]/80 backdrop-blur-md relative z-10">
                    <form onSubmit={send} className="relative flex items-center">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Ask MISHA about coaching, pricing, or leadership advice..."
                            className="w-full bg-[#020617] border border-white/10 rounded-xl py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 focus:bg-white/[0.02] transition-colors"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isTyping}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="absolute right-2 p-2.5 rounded-lg bg-[#00e5ff]/10 text-[#00e5ff] hover:bg-[#00e5ff]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
