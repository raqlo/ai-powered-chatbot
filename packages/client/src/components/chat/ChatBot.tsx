import { type SubmitHandler } from 'react-hook-form';
import { useRef, useState } from 'react';
import axios from 'axios';
import TypingIndicator from './TypingIndicator';
import ChatMessages, { type Message } from './ChatMessages';
import ChatInput, { type ChatFormData } from './ChatInput';

type ChatResponse = {
   message: string;
};

export const ChatBot = () => {
   const conversationId = useRef(crypto.randomUUID());
   const [messages, setMessages] = useState<Message[]>([]);
   const [error, setError] = useState<string>('');
   const [isBotTyping, setIsBotTyping] = useState(false);

   const onSubmit: SubmitHandler<ChatFormData> = async ({ prompt }) => {
      try {
         setError('');
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);
         const { data } = await axios.post<ChatResponse>('/api/chat', {
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

   return (
      <div className={'flex flex-col h-full'}>
         <div
            className={`flex flex-col flex-1 gap-2 p-4 overflow-y-auto ${messages.length > 0 ? 'mt-4' : ''}`}
         >
            <ChatMessages messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {error && (
               <div className="px-3 py-1 rounded-xl bg-red-600 text-white self-start">
                  {error}
               </div>
            )}
         </div>
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};
