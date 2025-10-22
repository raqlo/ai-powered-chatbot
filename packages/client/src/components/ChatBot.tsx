import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type React from 'react';

interface IFormInput {
   prompt: string;
}

export const ChatBot = () => {
   const { register, handleSubmit, reset, formState } = useForm<IFormInput>();
   const onSubmit: SubmitHandler<IFormInput> = (data) => {
      console.log(data);
      reset();
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
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
            className="w-full border-0 outline-none focus:outline-0"
            placeholder="Ask anything"
            maxLength={1000}
         />
         <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
            <FaArrowUp />
         </Button>
      </form>
   );
};
