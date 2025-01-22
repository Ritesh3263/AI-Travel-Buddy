"use client";

import { useChat } from 'ai/react';

import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

import ReactMarkdown  from "react-markdown";
import remarkGfm from 'remark-gfm';

// interface Message {
//   role: "user" | "assistant";
//   content: string;
// }

export default function Home() {

  const { messages, setMessages, input, isLoading, handleInputChange, handleSubmit, error } = useChat();

  // useEffect(() => {
  //   if (messages.length === 0) {
  //     fetch('/api/chat', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ messages: [] }),
       
  //     })
      
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.messages && data.messages.length > 0) {
  //           setMessages([
  //             {
  //               id: Date.now().toString(), // Unique ID for the initial message
  //               role: 'assistant',
  //               content: 'Hello! I am your travel assistant. Where would you like to escape this time?',
  //             },
  //           ]);
  //           console.log(data.messages);
  //         }
  //       })
  //       .catch((err) => console.error('Error fetching initial message:', err));
  //   }
  // }, [messages, setMessages]);

 // Ref to the scroll container
 const chatEndRef = useRef<HTMLDivElement>(null)

// Auto-scroll effect
useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])

  // console.log(error);
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-50 via-gray-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <h5 className='float-right p-5 text-gray-400'>Made with &#9829; by Ritesh</h5>
      <div className="container max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-6 w-full">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Plane className="h-8 w-8 text-white fill-current" />
            </div>
            <h1 className="sm:max-md:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">AI Travel Buddy</h1>
          </div>
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-b from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="p-6">
                <p className="text-sm text-center text-gray-600 dark:text-gray-300 leading-relaxed">
                  <span className='hidden sm:flex' >
                  Our AI-powered travel assistant helps you create personalized travel itineraries, 
                  find the best accommodations, and discover unique experiences tailored to your preferences.</span>
                  <span className='flex sm:hidden'>
                    AI Travel Buddy is a free AI assistant that helps users create personalized travel itineraries.
                  </span> 
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="grid gap-4">
          <Card className="bg-gradient-to-b from-white to-white/95 dark:from-gray-800 dark:to-gray-800/95 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <ScrollArea className="h-[45vh] md:h-[60vh] px-6 py-4" >
              <div className="space-y-6" >
              
                {messages.length === 0 &&(
                  <div className="flex flex-col md:flex-row h-[45vh] md:h-[60vh] gap-3 justify-center items-center text-gray-500 dark:text-gray-400">
                    <Plane className="h-6 w-6 text-white fill-current" />
                    <p className="text-sm text-center">No messages yet. Type a message to start the conversation.</p>
                    {/* {error && <p className="text-sm">Error Occured! Retry</p>} */}
                  </div>
                )}
                
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
                        
                        <ReactMarkdown
                          children={m.content}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            ul: ({ children }) => (
                              <ul className="list-disc pl-4">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal pl-4">
                                {children}
                              </ol>
                            ),
                            
                          }}
                        />
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
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>
          </Card>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Describe your ideal trip..."
              className="text-base sm:text-lg  flex-grow bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-lg"
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