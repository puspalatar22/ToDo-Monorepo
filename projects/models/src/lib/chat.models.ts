export interface ChatSource {
    title: string;
    section_title: string;
    page_id:string;
    url: string;
    images: string[];
};

export interface ChatResponse {
    answer: string;
    image_urls: string[];
    sources: ChatSource[];
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timeStamp: Date;
    sources: ChatSource[];
    imageUrls: string[];
}

export interface ChatState {
    messages: ChatMessage[];
    isOpen: boolean;
    isTyping: boolean;
}