import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  Input,
  HostListener,
  NgZone,
} from '@angular/core';
import { ChatState } from 'models';
import { ChatService } from 'shared-services';
import { Subject, takeUntil } from 'rxjs';
import { marked } from 'marked';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  @Output() chatToggled = new EventEmitter<boolean>();
  @Input() isOpen = false;

  @Output() toggle = new EventEmitter<boolean>();
  @Output() clickOutside = new EventEmitter<void>();
  parseMarkdown(md: string): string {
    return marked.parse(md) as string;
  }

  state!: ChatState;
  inputText = '';
  private destroy$ = new Subject<void>();
  private recognition: any;
  isListening = false;
  isSpeechRecognitionSupported = false; 

  constructor(
    @Inject(ChatService) private chatService: ChatService,
    private el: ElementRef,
    private ngZone: NgZone
  ) { }

  unreadCount = 0;

  ngOnInit() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

       this.isSpeechRecognitionSupported = !!SpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-IN';
      this.recognition.continuous = false; 
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        this.ngZone.run(() => {
          this.isListening = true;
        });
      };

      this.recognition.onend = () => {
        this.ngZone.run(() => {
          this.isListening = false;
        });
      };

      this.recognition.onerror = () => {
        this.ngZone.run(() => {
          this.isListening = false;
        });
      };

      this.recognition.onresult = (event: any) => {
        this.ngZone.run(() => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              this.inputText = (this.inputText + ' ' + result[0].transcript).trim();
              this.sendMessage();
            }
          }
        });
      };
    }

    this.chatService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: ChatState) => {
        // increment unread when chat is closed and bot replies
        if (
          !state.isOpen &&
          state.messages.length > this.state?.messages?.length
        ) {
          const lastMessage = state.messages[state.messages.length - 1];
          if (lastMessage?.sender === 'bot') {
            this.unreadCount++;
          }
        }

        // reset unread when chat opens
        if (state.isOpen) this.unreadCount = 0;

        this.state = state;
        setTimeout(() => this.scrollBottom(), 50);
      });
  }

  onClick() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.toggle.emit(this.isOpen);
    }
  }
  toggleListening() {
    this.isListening = !this.isListening;
  }
  startListening() {
    this.toggleListening();
    if (this.recognition) {
      this.recognition.start();
    }
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: PointerEvent) {
    if (this.isOpen && !this.el.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.clickOutside.emit();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleChat() {
    this.chatService.toggleChat();
    this.chatToggled.emit(this.state.isOpen);
  }

  sendMessage() {
    if (!this.inputText.trim()) return;
    this.chatService.sendMessage(this.inputText);
    this.inputText = '';
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.sendMessage();
  }

  private scrollBottom() {
    if (this.messageContainer) {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    }
  }
}
