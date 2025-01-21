"use client";

import { useChat } from 'ai/react';

import { useState } from "react";
import { Send, Loader2, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

// interface Message {
//   role: "user" | "assistant";
//   content: string;
// }

export default function Home() {

  const { messages, input, isLoading, handleInputChange, handleSubmit } = useChat();
  
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-50 via-gray-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <h5 className='float-right p-5 text-gray-400'>Made with &#9829; by Ritesh</h5>
      <div className="container max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Plane className="h-8 w-8 text-white fill-current" />
            </div>
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">AI Travel Buddy</h1>
          </div>
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-b from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our AI-powered travel assistant helps you create personalized travel itineraries, 
                  find the best accommodations, and discover unique experiences tailored to your preferences.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="grid gap-4">
          <Card className="bg-gradient-to-b from-white to-white/95 dark:from-gray-800 dark:to-gray-800/95 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <ScrollArea className="h-[60vh] px-6 py-4">
              <div className="space-y-6">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 shadow-sm ${
                        m.role === "user"
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white ml-4"
                          : "bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700/90 mr-4"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {m.content}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-3 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700/90">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Describe your ideal trip..."
              className="flex-grow bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-lg"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white px-6 shadow-md"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}