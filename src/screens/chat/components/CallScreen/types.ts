import { MediaDeviceConfigType } from "../CallModal/types";

export type CallScreenProps = {
    peerNickname: string;
    onEndCall: () => void;
    mediaDevice: any;
    remoteSrc: any;
    config: MediaDeviceConfigType
}