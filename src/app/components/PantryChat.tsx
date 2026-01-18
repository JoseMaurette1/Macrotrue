"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ChefHat, Sparkles, Crown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function PantryChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your Pantry Chef. Tell me what ingredients you have (and any calorie targets), and I'll suggest delicious meals with full macro breakdowns! 🍳"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState({ count: 0, limit: 5, isPremium: false });
  const [calorieGoal, setCalorieGoal] = useState<number | null>(null);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch calorie goal and usage on mount
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await fetch("/api/goals");
        if (response.ok) {
          const data = await response.json();
          if (data.calorieGoal) {
            setCalorieGoal(data.calorieGoal);
          }
        }
      } catch (error) {
        console.error("Failed to fetch calorie goal:", error);
      }
    };

    const fetchUsage = async () => {
      try {
        const response = await fetch("/api/chat");
        if (response.ok) {
          const data = await response.json();
          setUsage({
            count: data.chatCount || 0,
            limit: data.limit || 5,
            isPremium: data.isPremium || false
          });
        }
      } catch (error) {
        console.error("Failed to fetch usage:", error);
      }
    };

    fetchGoal();
    fetchUsage();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Send context (last few messages) + current message
      const contextMessages = messages.filter(m => m.role !== "system").slice(-6);

      const payload = {
        messages: [...contextMessages, userMsg],
        calorieGoal: calorieGoal
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "limit_exceeded") {
          setShowUpgradePopup(true);
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

      {/* Upgrade Popup Modal */}
      <AnimatePresence>
        {showUpgradePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUpgradePopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowUpgradePopup(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Crown className="h-8 w-8 text-primary" />
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Unlock Extended AI Chef
                </h2>

                <p className="text-muted-foreground mb-6">
                  You&apos;ve reached your daily limit of free meal suggestions.
                  Upgrade to Premium for extended access to your personal AI chef!
                </p>

                <div className="space-y-3 w-full">
                  <Button
                    onClick={() => router.push("/Pricing")}
                    className="w-full"
                    size="lg"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setShowUpgradePopup(false)}
                    className="w-full"
                  >
                    Maybe Later
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
