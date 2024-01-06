import { TMessage, TUserMessage } from "../../types/chat";
import { MediaDeviceConfigType } from "../CallModal/types";

export type CallWindowProps = {
    remoteSrc: any;
    localSrc: any;
    config: MediaDeviceConfigType | null;
    mediaDevice: any;
    finishCall: (isCaller: boolean) => void;
    chat: TUserMessage[];
    nickname: string;
}

export type Theme = {
    theme: 'light' | 'dark';
} 