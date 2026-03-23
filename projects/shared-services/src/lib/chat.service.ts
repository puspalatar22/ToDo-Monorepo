import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatMessage, ChatState } from 'models';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as marked from 'marked';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly url = 'http://192.168.0.89:8004/ask';
  private readonly adminUrl = 'http://192.168.0.89:8004/admin/chat';
  private sessionId = crypto.randomUUID();
  public isAnswerUpdated: boolean = false;

  private state: ChatState = {
    messages: [],
    isOpen: false,
    isTyping: false,
  };

  private stateSubject = new BehaviorSubject<ChatState>(this.state);
  state$ = this.stateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

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

    this.http.post<any>(this.url, {
      query: userText,
      session_id: this.sessionId
    }).subscribe({
      next: (res) => {
        this.updateState({ isTyping: false });

        // Adjust based on API response
        const answer = res?.answer || res?.response || 'No response from server';

        let combinedText = answer;

        // Append images if present
        if (res?.image_urls?.length) {
          res.image_urls.forEach((url: string) => {
            combinedText += `\n\n![image](${url})`;
          });
        }

        this.addMessage({
          text: combinedText,
          sender: 'bot',
          sources: res?.sources || [],
        });
      },
      error: (err) => {
        console.error('API Error:', err);
        this.updateState({ isTyping: false });

        this.addMessage({
          text: 'Error connecting to server. Please try again.',
          sender: 'bot',
        });
      },
    });
  }

 sendAdminMessage(userText: string) {
  if (!userText.trim()) return;

  // Add user message
  this.addMessage({ text: userText, sender: 'user' });
  this.updateState({ isTyping: true });

  // Return the observable so component can subscribe
  return this.http.post<any>(this.adminUrl, {
    query: userText,
    session_id: this.sessionId
  }).pipe(
    // Tap into the response to handle side effects
    tap((res) => {
      this.updateState({ isTyping: false });

      // Add bot response
      this.addMessage({
        text: res?.message || 'No response from admin API',
        sender: 'bot',
      });

      // ✅ Update isAnswerUpdated if completed/success
      if (res?.status === 'completed' || res?.result?.status === 'success') {
        this.isAnswerUpdated = true;
      } else {
        this.isAnswerUpdated = false;
      }
    }),
    catchError((err) => {
      this.updateState({ isTyping: false });

      this.addMessage({
        text: err?.error?.message || 'Admin API error',
        sender: 'bot',
      });

      // Reset flag on error
      this.isAnswerUpdated = false;

      // Re-throw error so component can handle if needed
      return throwError(() => err);
    })
  );
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

  // Convert Markdown to HTML safely
  parseMarkdown(markdownText: string): SafeHtml {
    const html = marked.parse(markdownText || '') as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}