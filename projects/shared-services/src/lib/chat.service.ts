import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatResponse } from 'models';
import { ChatMessage } from 'models';
import { ChatState } from 'models';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly url = 'assets/mocks/chat-responses.json';

  private state: ChatState = {
    messages: [],
    isOpen: false,
    isTyping: false,
  };

  private stateSubject = new BehaviorSubject<ChatState>(this.state);
  state$ = this.stateSubject.asObservable();

  private mockData: any[] = [];
  private dataloaded = false;
  private pendingText: string |null = null;

  constructor(private http: HttpClient) {
    this.loadMockdata();
  }

  private loadMockdata() {
    this.http.get<{ responses: any[] }>(this.url).subscribe({
      next: (data) => {
        this.mockData  = data.responses;   
        this.dataloaded = true;

        if (this.pendingText) {
          this.respondToMessage(this.pendingText);
          this.pendingText = null;
        }
      },
      error: (err) => console.error('Failed to load mock data:', err)
    });
  }

  toggleChat() {
    this.updateState({ isOpen: !this.state.isOpen });

    if (this.state.isOpen && this.state.messages.length === 0) {
      this.addMessage({
        text: "Hello, I'm a bot. How can I help you today?",
        sender: 'bot',
      });
    }
  }

sendMessage(userText: string) {
  if (!userText.trim()) return;

  // user message
  this.addMessage({ text: userText, sender: 'user' });
  console.log(this.addMessage);

  this.updateState({ isTyping: true });

  setTimeout(() => {
    this.updateState({ isTyping: false });

    if(!this.dataloaded){
      this.pendingText = userText.toLowerCase();
      this.addMessage({text: 'Loading Responses, Please wait...', sender: 'bot'});
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
        messages: [...this.state.messages, message]
    })
  }

  private updateState(partial: Partial<ChatState>) {
    this.state = { ...this.state, ...partial };
    this.stateSubject.next(this.state);
  }

private respondToMessage(text: string) {
  const matched = this.mockData.find((r) =>
    r.keywords.some((k: string) => text.includes(k))
  );

  const response = matched ?? this.mockData.find((r) => r.keywords.includes('default'));

  // bot message
  this.addMessage({
    text     : response.answer,
    sender   : 'bot',           
    sources  : response.sources,
    imageUrls: response.image_urls,
  });
}
}
