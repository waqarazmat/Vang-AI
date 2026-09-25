// The one interface every demo talks to. Swap the adapter, keep the demos.

export type Channel = 'voice' | 'whatsapp' | 'webchat';

export type ChatTurn = { role: 'customer' | 'assistant'; text: string };

export type AssistantRequest = {
  channel: Channel;
  locale: string;
  message: string;
  history: ChatTurn[];
};

export type AssistantReply = { text: string };

export interface AssistantAdapter {
  reply(request: AssistantRequest): Promise<AssistantReply>;
}
