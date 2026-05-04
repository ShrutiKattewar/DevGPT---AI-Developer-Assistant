import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [FormsModule, TextFieldModule],
  templateUrl: './chat-input.html',
  styleUrl: './chat-input.scss',
})
export class ChatInput {
  @Output() send = new EventEmitter<string>();
  @Input() isLoading: boolean = false;

  message = '';

  sendMessage() {
    if (!this.message.trim() || this.isLoading) return;

    this.send.emit(this.message);
    this.message = '';
  }
}
