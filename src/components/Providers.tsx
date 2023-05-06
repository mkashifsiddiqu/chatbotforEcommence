"use client"
import { MessageProvider } from '@/context/messages'
import { QueryClientProvider,QueryClient } from '@tanstack/react-query'
import React,{FC, ReactNode} from 'react'
interface ProvidersProps{
    children:ReactNode
}
const Providers:FC<ProvidersProps> = ({children}) => {
    const queryClient =new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <MessageProvider>
      {children}
      </MessageProvider>
   </QueryClientProvider>
  )
}

export default Providers