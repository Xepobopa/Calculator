import { I18nManager } from "react-native";

export enum TMessageEnum {
    User,
    Internal
}

export type TMessage = {
    type: TMessageEnum;
}

/**
 * A Type witch represent a user message that 2 users can see
 */
export type TUserMessage = {
    from: string;
    text: string;
} & TMessage

/**
 * A Type witch represent a not user message for internall app usage
 */
export type TInternalMessage = {
    peerNickname: string;
} & TMessage

export type Chat = {
    chat: TUserMessage[];
}