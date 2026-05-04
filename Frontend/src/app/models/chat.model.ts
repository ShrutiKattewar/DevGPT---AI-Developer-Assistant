export interface Message {
  text: string;
  sender: 'user' | 'bot';
  loading?: boolean;
}

export interface ChatItem {
  id: number;
  title: string;
  messages: Message[];
}
