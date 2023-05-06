import { messageArray, messageSchema } from "@/lib/validators/message";
import { ChatGPTMessage, OpenAIStream, OpenAIStreamPayload } from "@/lib/openai-stream";
import { chatbotPrompt } from "@/helpers/contents/chatbot-prompts";
export async function POST(req: Request, res: Response) {
  const { message } = await req.json();
  
  // validation

  const parseMessage = messageArray.parse(message);
  const outBondMessage: ChatGPTMessage[] = parseMessage.map((message) => ({
    role: message.isUserMassage ? "user" : "system",
    content: message.text,
  }));
  // for array first items
  outBondMessage.unshift({
    role: "system",
    content: chatbotPrompt,
  });
  const payload:OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: outBondMessage,
    temperature: 0.4,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 150,
    stream: true,
    n:1
  };
   const stream = await OpenAIStream(payload)
  
  return new Response(stream);
}

