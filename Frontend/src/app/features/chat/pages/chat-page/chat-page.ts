import { Component, HostListener, Input } from '@angular/core';
import { ChatWindow } from '../../components/chat-window/chat-window';
import { ChatInput } from '../../components/chat-input/chat-input';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chatService';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [ChatWindow, ChatInput, CommonModule],
  templateUrl: './chat-page.html',
  styleUrl: './chat-page.scss',
})
export class ChatPage {
  isLoading$!: Observable<boolean>;
  mode: string = 'chat';
  modes = [
    { key: 'chat', label: 'Chat' },
    { key: 'debug', label: 'Debug' },
    { key: 'explain', label: 'Explain' },
    { key: 'generate', label: 'Generate' },
    { key: 'dsa', label: 'DSA' },
  ];
  isSidebarOpen = false;
  shouldAutoScroll = false;

  constructor(public chatService: ChatService) {
    this.isLoading$ = this.chatService.isLoading$;
  }

  onSendMessage(message: string) {
    this.shouldAutoScroll = true; // 🔥 force scroll
    this.chatService.sendMessage(message, this.mode);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768) {
      this.isSidebarOpen = false;
    }
  }
}
