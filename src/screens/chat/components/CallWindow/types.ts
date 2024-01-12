import { TMessage, TUserMessage } from "../../types/chat";
import { MediaDeviceConfigType } from "../CallModal/types";

export type CallWindowProps = {
    config: MediaDeviceConfigType | null;
    finishCall: (isCaller: boolean) => void;
    chat: TUserMessage[];
    nickname: string;
    setPeerNicknameFunc: (nickname: string) => void;
    startAudioCalling: () => void;
    chatStatus: string;
}

export type Theme = {
    theme: 'light' | 'dark';
} 