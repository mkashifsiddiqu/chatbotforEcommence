"use client"
import { MessageContext } from '@/context/messages'
import { cn } from '@/lib/utils'
import React, { FC, HTMLAttributes, useContext } from 'react'
import MarkdownLite from './MarkdownLite'
interface ChatMessagesProps extends HTMLAttributes<HTMLDivElement> {

}
const ChatMessages: FC<ChatMessagesProps> = ({ className, ...props }) => {
    const { messages } = useContext(MessageContext)
    const invertMessage = [...messages].reverse()
    return (
        <div {...props}
            className={
                cn('flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch', className)}
        >
            <div className='flex flex-1 flex-grow' />
            {invertMessage.map((message) => (
                <div key={message.id} className='chat-message'>
                    <div className={cn('flex flex-end', {
                        'justify-end': message.isUserMassage
                    })}>
                        <div className={cn('flex flex-col space-y-2 text-sm max-w-xs mx-2 overflow-x-hidden', {
                            'order-1 items-end': message.isUserMassage,
                            'order-2 items-start': !message.isUserMassage,
                        })}>
                            <p className={cn('px-2 py-2 rounded-lg', {
                                'bg-blue-600 text-white': message.isUserMassage,
                                'bg-gray-200 text-gray-900': !message.isUserMassage,

                            })}>

                                {/* {message.text} */}
                                <MarkdownLite text={message.text} />



                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ChatMessages