import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { type SubmitHandler, useForm } from 'react-hook-form';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface IFormInput {
   prompt: string;
}

type ChatResponse = {
   message: string;
};

type Message = {
   content: string;
   role: 'user' | 'bot';
};

export const ChatBot = () => {
   const conversationId = useRef(crypto.randomUUID());
   const [messages, setMessages] = useState<Message[]>([]);
   const [error, setError] = useState<string>('');
   const lastMessageRef = useRef<HTMLDivElement | null>(null);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const { register, handleSubmit, reset, formState } = useForm<IFormInput>();

   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const onSubmit: SubmitHandler<IFormInput> = async ({ prompt }) => {
      try {
         setError('');
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);
         reset({ prompt: '' });
         const { data } = await axios.post<ChatResponse>('/api/chatx', {
            prompt,
            conversationId: conversationId.current,
         });
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
      } catch (err) {
         console.error('Error sending message:', err);
         setError('Something went wrong. Please try again later.');
      } finally {
         setIsBotTyping(false);
      }
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   const onCopyMessage = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData?.setData('text/plain', selection);
      }
   };

   return (
      <div className={'flex flex-col h-full'}>
         <div
            className={`flex flex-col flex-1 gap-2 p-4 overflow-y-auto ${messages.length > 0 ? 'mt-4' : ''}`}
         >
            {messages.map((message, index) => (
               <div
                  key={index}
                  onCopy={onCopyMessage}
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                  className={`px-3 py-1 rounded-xl ${
                     message.role === 'user'
                        ? 'bg-blue-600 text-white self-end'
                        : 'bg-gray-100 text-black self-start'
                  }`}
               >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
               </div>
            ))}
            {isBotTyping && (
               <div
                  className={
                     'flex gap-1 self-start px-3 py-3 bg-gray-200 rounded-xl'
                  }
               >
                  <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
            )}
            {error && (
               <div className="px-3 py-1 rounded-xl bg-red-600 text-white self-start">
                  {error}
               </div>
            )}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-xl"
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (data) => data.trim().length > 0,
               })}
               autoFocus={true}
               className="w-full border-0 outline-none focus:outline-0"
               placeholder="Ask anything"
               maxLength={1000}
            />
            <Button
               disabled={!formState.isValid}
               className="rounded-full w-9 h-9"
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};
