import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { marked } from 'marked';
import { ChatService } from '../../services/chatService';
import { Observable } from 'rxjs';
import { Message } from '../../../../models/chat.model';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-window.html',
  styleUrl: './chat-window.scss',
})
export class ChatWindow {
  @Input() messages: Message[] | null = [];

  @ViewChild('container') container!: ElementRef;
  @ViewChild('bottom') bottom!: ElementRef;
  isLoading$!: Observable<boolean>;

  constructor(public chatService: ChatService) {
    this.isLoading$ = this.chatService.isLoading$;
  }

  ngOnChanges() {
    // Delay scroll to ensure DOM updates before calculating scroll position
    setTimeout(() => this.smartScroll(), 0);
  }

  smartScroll() {
    const el = this.container.nativeElement;

    // Check if user is near bottom to avoid interrupting manual scroll
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (isNearBottom) {
      // Smooth scroll to latest message
      this.bottom.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }

  // Convert markdown text to HTML for rich message formatting
  formatMessage(text: string) {
    return marked.parse(text);
  }

  copyText(text: string, event: any) {
    // Copy message content to clipboard
    navigator.clipboard.writeText(text);

    const btn = event.currentTarget;
    const icon = btn.querySelector('.copy');

    const original = icon.innerHTML;
    icon.innerHTML = '✔';
    btn.title = 'Copied!';

    setTimeout(() => {
      icon.innerHTML = original;
      btn.title = 'Copy';
    }, 2000);
  }
}
