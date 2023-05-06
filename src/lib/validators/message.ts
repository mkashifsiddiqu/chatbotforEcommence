import { z } from "zod";
export const messageSchema=z.object({
    id:z.string(),
    isUserMassage:z.boolean(),
    text:z.string()
})
// for backend 
export const messageArray = z.array(messageSchema)

export type Message = z.infer<typeof messageSchema>