import { MediaDeviceConfigType } from "../CallModal/types";

export type CallScreenProps = {
    peerNickname: string;
    onEndCall: () => void;
    remoteSrc: any;
    config: MediaDeviceConfigType
}