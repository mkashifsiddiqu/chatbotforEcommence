import { messageSchema, messageArray, Message } from "@/lib/validators/message";
import { nanoid } from "nanoid";
import { ReactNode, createContext, useState } from "react";


export const MessageContext = createContext<{
    messages: Message[],
    isMessageUpdating: boolean,
    addMessages: (message: Message[]) => void,
    removeMessages: (id: string) => void,
    updateMessages: (id: string, updateFn: (prevText: string) => string) => void,
    setThisMessageUpdating: (isUpdating: boolean) => void
}>({
    messages: [],
    isMessageUpdating: false,
    addMessages: () => { },
    removeMessages: () => { },
    updateMessages: () => { },
    setThisMessageUpdating: () => { }
})

export function MessageProvider({ children }: { children: ReactNode }) {
    const [isMessageUpdating, setThisMessageUpdating] = useState<boolean>(false)
    const [messages, setMessage] = useState<Message[]>([
        {
            id: nanoid(),
            text: 'Hello, how can I help you?',
            isUserMassage: false,
        },
    ])
    const addMessages = (message: Message[]) => {
        // setMessage((prev) => [...prev, message])
        setMessage((prev:any) => [...prev, message])
    }
    const removeMessages = (id: string) => {
        setMessage((prev) => prev.filter((message) => message.id !== id))
    }
    const updateMessages = (id: string, updateFn: (prevText: string) => string) => {
        setMessage((prev) => prev.map((message) => {
            if (message.id == id) {
                return { ...message, text: updateFn(message.text) }
            }
            return message
        }))
    }

    return (
        <MessageContext.Provider value={{
            messages,
            addMessages,
            removeMessages,
            updateMessages,
            isMessageUpdating,
            setThisMessageUpdating
        }}>
            {children}
        </MessageContext.Provider>)
}