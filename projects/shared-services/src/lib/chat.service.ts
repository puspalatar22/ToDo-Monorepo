import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatMessage, ChatState } from 'models';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as marked from 'marked';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly url = 'assets/mocks/chat-markdown-responses.json';

  private state: ChatState = {
    messages: [],
    isOpen: false,
    isTyping: false,
  };

  private stateSubject = new BehaviorSubject<ChatState>(this.state);
  state$ = this.stateSubject.asObservable();

  private mockData: any[] = [];
  private dataloaded = false;
  private pendingText: string | null = null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.loadMockdata();
  }

  private loadMockdata() {
    this.http.get<{ responses: any[] }>(this.url).subscribe({
      next: (data) => {
        this.mockData = data.responses;
        this.dataloaded = true;
        if (this.pendingText) {
          this.respondToMessage(this.pendingText);
          this.pendingText = null;
        }
      },
      error: (err) => console.error('Failed to load mock data:', err),
    });
  }

  toggleChat() {
    this.updateState({ isOpen: !this.state.isOpen });
    if (this.state.isOpen && this.state.messages.length === 0) {
      this.addMessage({ text: "Hello, I'm a bot. How can I help you today?" });
    }
  }

  sendMessage(userText: string) {
    if (!userText.trim()) return;

    // Add user message
    this.addMessage({ text: userText, sender: 'user' });
    this.updateState({ isTyping: true });

    setTimeout(() => {
      this.updateState({ isTyping: false });

      if (!this.dataloaded) {
        this.pendingText = userText.toLowerCase();
        this.addMessage({ text: 'Loading Responses, Please wait...', sender: 'bot' });
        return;
      }

      this.respondToMessage(userText.toLowerCase());
    }, 800);
  }

  private addMessage(partial: Partial<ChatMessage>) {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      text: partial.text ?? '',
      sender: partial.sender ?? 'bot',
      timeStamp: partial.timeStamp ?? new Date(),
      sources: partial.sources ?? [],
      imageUrls: partial.imageUrls ?? [],
    };

    this.updateState({
      messages: [...this.state.messages, message],
    });
  }

  private updateState(partial: Partial<ChatState>) {
    this.state = { ...this.state, ...partial };
    this.stateSubject.next(this.state);
  }

  private respondToMessage(text: string) {
    const matched = this.mockData.find((r) =>
      r.keywords.some((k: string) => text.includes(k))
    );

    const response =
      matched ?? this.mockData.find((r) => r.keywords.includes('default'));

    if (!response) return;

    // Merge Markdown images in text and any imageUrls array
    let combinedText = response.answer;

    // Append extra images at the bottom if any
    if (response.image_urls?.length) {
      response.image_urls.forEach((url: string) => {
        combinedText += `\n\n![image](${url})`;
      });
    }

    // Add bot message
    this.addMessage({
      text: combinedText,
      sender: 'bot',
      sources: response.sources,
    });
  }

  // Convert Markdown to HTML safely
parseMarkdown(markdownText: string): SafeHtml {
  const html = marked.parse(markdownText || '') as string;
  return this.sanitizer.bypassSecurityTrustHtml(html);
}
}