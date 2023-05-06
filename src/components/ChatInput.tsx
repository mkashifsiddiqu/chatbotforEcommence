"use client"
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import React, { FC, HTMLAttributes, useContext, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { nanoid } from 'nanoid'
import { Message } from '@/lib/validators/message'
import { MessageContext } from '@/context/messages'
import { CornerDownLeft, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

//************************** */ Main 
interface ChatInputProps extends HTMLAttributes<HTMLDivElement> { }
const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
    // Ref 
    const refTextAuto = useRef<null | HTMLTextAreaElement>(null)
    // UseState
    const [input, setInput] = useState<string>('')
    // UseContext
    const { messages,
        addMessages,
        removeMessages,
        updateMessages,
        isMessageUpdating,
        setThisMessageUpdating
    } = useContext(MessageContext)
    // UseReactQuery
    const { mutate: SendMessage, isLoading } = useMutation({
        mutationFn: async (message: Message) => {
            const response = await fetch('/api/message', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({ message: [message] }),
            })
              if(!response.ok){
                throw new Error();
                  
              }
            return response.body
        },
        onMutate(message:any){

            addMessages(message)
        }
        ,
        onSuccess: async (stream) => {

            if (!stream) throw new Error('No Found Stream')

            const id = nanoid()
            const ResponseMesage:any = {
                id,
                isUserMassage: false,
                text: ''
            }
            addMessages(ResponseMesage)
            setThisMessageUpdating(true)
            const reader = stream.getReader()
            const decoder = new TextDecoder()
            let done = false
            while (!done) {
                const { done: doneReading, value } = await reader.read()
                done = doneReading
                const chunkValue = decoder.decode(value)
                updateMessages(id, (prev) => prev + chunkValue)
                console.log(`chunk value received`, chunkValue)
            }
            // clean up 
            setThisMessageUpdating(false)
            setInput('')
            setTimeout(() => {
                refTextAuto.current?.focus()
            }, 10)
        },onError(_,message){
            console.log('working ..erorr')
            toast.error('Something went wrong please try again later')
            removeMessages(message.id)
            refTextAuto.current?.focus()
        }
    })
    // main return main fnCom
    return (
        <div {...props} className={cn('border-t border-zinc-300', className)}>
            <div className='relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none'>
                <TextareaAutosize
                    ref={refTextAuto}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key == 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            const message: Message = {
                                id: nanoid(),
                                isUserMassage: true,
                                text: input,
                            }
                            // mutation 
                            SendMessage(message)
                        }
                    }}
                    disabled={isLoading}
                    rows={2}
                    maxRows={4}
                    autoFocus
                    placeholder='write a Message ....'
                    className='peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6'
                />
                <div className='absolute inset-y-0 right-0 flex py-1.5 pr-1.5'>
                    <kbd className='inline-flex items-center rounded border bg-white border-gray-200 px-1 font-sans text-xs text-gray-400'>
                        {isLoading
                            ? <Loader2 className='w-3 h-3 animate-spin' />
                            : <CornerDownLeft className='w-3 h-3' />
                        }
                    </kbd>
                </div>
                <div
                    className='absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600'
                    aria-hidden='true'
                />
            </div>
        </div>
    )
}

export default ChatInput