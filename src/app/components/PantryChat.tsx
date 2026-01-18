"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ChefHat, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function PantryChat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hi! I'm your Pantry Chef. Tell me what ingredients you have, and I'll suggest some delicious meals! 🍳" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState({ count: 0, limit: 5, isPremium: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Send context (last few messages) + current message
      const contextMessages = messages.filter(m => m.role !== "system").slice(-6); 
      // Filter out the initial welcome message from API context if needed, but it's fine to keep
      
      const payload = [...contextMessages, userMsg];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "limit_exceeded") {
           setMessages((prev) => [...prev, { 
             role: "assistant", 
             content: `⛔ **Limit Reached**\n\nYou've used ${data.chatCount}/${data.limit} free messages today. Upgrade to Premium for unlimited chat!` 
           }]);
        } else {
           throw new Error(data.error || "Failed to fetch");
        }
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        setUsage({ 
          count: data.chatCount, 
          limit: data.limit, 
          isPremium: data.isPremium 
        });
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting to the kitchen. Please try again later. 🤕" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto border rounded-xl shadow-sm bg-card overflow-hidden">
      {/* Header */}
      <div className="bg-primary/5 p-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-full">
            <ChefHat className="text-primary h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Pantry Chef</h3>
            <p className="text-xs text-muted-foreground">AI-powered meal suggestions</p>
          </div>
        </div>
        {!usage.isPremium && (
          <div className="text-xs font-medium px-3 py-1 bg-background border rounded-full text-muted-foreground">
            {usage.count}/{usage.limit} daily requests
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-white dark:bg-muted text-foreground rounded-tl-none border"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white dark:bg-muted border rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 shadow-sm">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">Cooking up ideas...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-card border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="I have chicken, rice, and broccoli..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
