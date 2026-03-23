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
  finalTranscript = '';
  manualEditing = false;
  private autoSendTimeout: any;
  isAdminFlowActive = false;

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
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.ngZone.run(() => {
          this.isListening = true;
          this.finalTranscript = '';
          this.manualEditing = false;
        });
      };

      this.recognition.onend = () => {
        this.ngZone.run(() => {
          this.isListening = false;

          if (!this.manualEditing && this.inputText.trim()) {
            this.autoSendTimeout = setTimeout(() => {
              this.sendMessage();
            }, 1000);
          }
        });
      };

      this.recognition.onerror = () => {
        this.ngZone.run(() => {
          this.isListening = false;
        });
      };

      this.recognition.onresult = (event: any) => {
        this.ngZone.run(() => {
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
              this.finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          const text = (this.finalTranscript + interimTranscript).trim();

          this.inputText = text;
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

  onInputClick() {
    this.manualEditing = true;

    if (this.autoSendTimeout) {
      clearTimeout(this.autoSendTimeout);
      this.autoSendTimeout = null;
    }

    if (this.isListening) {
      this.stopListening();
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
    const text = this.inputText.trim();
    if (!text) return;

    const lower = text.toLowerCase();

    const triggerAdmin =
      lower.includes('update') || lower.includes('change answer') || lower.includes('edit');

    if (triggerAdmin) {
      this.isAdminFlowActive = true;
    }

    if (this.isAdminFlowActive) {
      // Subscribe to admin API to check when update is completed
      this.chatService.sendAdminMessage(text)?.subscribe({
        next: (res) => {
          // Exit admin flow only if backend completed update
          if (res?.status === 'completed' || res?.result?.status === 'success') {
            this.isAdminFlowActive = false;
          }
        },
        error: () => {
          // Reset on error
          this.isAdminFlowActive = false;
        }
      });
    } else {
      this.chatService.sendMessage(text);
    }

    // Reset input and speech state
    this.inputText = '';
    this.finalTranscript = '';
    this.manualEditing = false;
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
