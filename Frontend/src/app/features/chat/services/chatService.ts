import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Message, ChatItem } from '../../../models/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chats: ChatItem[] = [];
  currentChatId: number | null = null;

  // Maintains reactive chat state across components
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  // Tracks API loading state to prevent duplicate requests
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    // Load chats from localStorage
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('chats');

      if (saved) {
        this.chats = JSON.parse(saved);
      }
    }
  }

  // Store chats locally to persist user sessions without backend
  saveToLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('chats', JSON.stringify(this.chats));
    }
  }

  // Reset current chat session
  newChat() {
    this.currentChatId = null;
    this.messagesSubject.next([]);
  }

  // Load selected chat and update UI state
  openChat(chatId: number) {
    if (this.currentChatId === chatId) return;

    const chat = this.chats.find((c) => c.id === chatId);
    if (!chat) return;

    this.currentChatId = chatId;
    this.messagesSubject.next([...chat.messages]);
  }

  // Delete chat and reset state if active chat is removed
  deleteChat(chatId: number) {
    this.chats = this.chats.filter((c) => c.id !== chatId);

    if (this.currentChatId === chatId) {
      this.currentChatId = null;
      this.messagesSubject.next([]);
    }
    this.saveToLocalStorage();
  }

  // Convert UI message format to OpenAI-compatible format
  private mapToOpenAIMessages(messages: Message[]) {
    return messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));
  }

  // Fake streaming typing effect
  typeEffect(botMsg: Message, text: string, chat: ChatItem) {
    let i = 0;

    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval);

        this.isLoadingSubject.next(false);
        this.saveToLocalStorage();

        return;
      }
      botMsg.text += text[i];
      this.messagesSubject.next([...chat.messages]);
      i++;
    }, 10);
  }

  // Handles sending message and streaming AI response
  sendMessage(message: string, mode: string) {
    if (!message.trim()) return;

    // Prevent multiple parallel API calls
    if (this.isLoadingSubject.value) return;

    let chat = this.chats.find((c) => c.id === this.currentChatId);

    // Create new chat session if none exists
    if (!chat) {
      chat = {
        id: Date.now(),
        title: message.slice(0, 30),
        messages: [],
      };

      this.chats.unshift(chat);
      this.currentChatId = chat.id;
    }

    // Add user message
    chat.messages.push({ text: message, sender: 'user' });
    this.messagesSubject.next([...chat.messages]);
    this.isLoadingSubject.next(true);

    // loading msg
    this.messagesSubject.next([...chat.messages]);

    // Limit context to last 10 messages to balance cost, performance, and relevance
    const openAIMessages = this.mapToOpenAIMessages(chat.messages).slice(-10);

    // Add placeholder bot message for streaming response
    const botMsg: Message = { text: '', sender: 'bot' };
    chat.messages.push(botMsg);
    this.messagesSubject.next([...chat.messages]);
    this.isLoadingSubject.next(true);

    (async () => {
      try {
        const response = await fetch(`${environment.apiUrl}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: openAIMessages,
            mode,
          }),
        });

        const data = await response.json();

        // Fake streaming
        this.typeEffect(botMsg, data.reply, chat);
      } catch (error) {
        // handle API failure
        botMsg.text = '⚠️ Server error';
        this.messagesSubject.next([...chat.messages]);
        this.isLoadingSubject.next(false);
      }
    })();
  }
}
