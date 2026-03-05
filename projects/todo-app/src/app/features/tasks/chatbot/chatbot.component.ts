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
} from '@angular/core';
import { ChatState } from 'models';
import { ChatService } from 'shared-services';
import { Subject, takeUntil } from 'rxjs';

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

  state!: ChatState;
  inputText = '';
  private destroy$ = new Subject<void>();
  private recognition: any;
  isListening = false;

  constructor(
    @Inject(ChatService) private chatService: ChatService,
    private el: ElementRef,
  ) {}

  unreadCount = 0;

  ngOnInit() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-IN';
      this.recognition.continuous = false; //stop after one sentence
      this.recognition.interimResults = true; //show live typing

      this.recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript;

            this.inputText = (this.inputText + ' ' + transcript).trim();
          }
        }
      };

      this.recognition.onStart = () => {
        this.isListening = true;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.onerror = () => {
        this.isListening = false;
      };
    }

    this.chatService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: ChatState) => {
        // ✅ increment unread when chat is closed and bot replies
        if (
          !state.isOpen &&
          state.messages.length > this.state?.messages?.length
        ) {
          const lastMessage = state.messages[state.messages.length - 1];
          if (lastMessage?.sender === 'bot') {
            this.unreadCount++;
          }
        }

        // ✅ reset unread when chat opens
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
    } else {
      alert('Your browser does not support speech recognition.');
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
