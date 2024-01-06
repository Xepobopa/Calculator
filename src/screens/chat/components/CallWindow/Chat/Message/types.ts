import { TUserMessage } from "../../../../types/chat";

export type MessageProps = {
    messageData: TUserMessage;
    theme: string; // 'light' | 'dark'
    nickname: string;
}

export type MessageType = {
    text: string;
    from: string;
    date?: Date;
}