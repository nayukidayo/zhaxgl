import { TUICallKitAPI } from "../../../TUICallService/index";
const PATH = "../../../static";
Component({
  properties: {
    callRole: {
      type: String,
    },
    callStatus: {
      type: String,
    },
    callMediaType: {
      type: Number,
    },
    callDuration: {
      type: String,
    },
    pusher: {
      type: Object,
    },
    playerList: {
      type: Array,
    },
    localUserInfo: {
      type: Object,
    },
    remoteUserInfoList: {
      type: Array,
    },
    isEarPhone: {
      type: Boolean,
    },
    bigScreenUserId: {
      type: Boolean,
    },
    enableFloatWindow: {
      type: Boolean,
    },
    enableVirtualBackground: {
      type: Boolean,
    },
    isVirtualBackground: {
      type: Boolean,
    },
  },
  data: {
    IMG_DEFAULT_AVATAR: `${PATH}/default_avatar.png`,
    IMG_HANGUP: `${PATH}/hangup.png`,
    IMG_ACCEPT: `${PATH}/dialing.png`,
    IMG_SPEAKER_FALSE: `${PATH}/speaker-false.png`,
    IMG_SPEAKER_TRUE: `${PATH}/speaker-true.png`,
    IMG_AUDIO_TRUE: `${PATH}/audio-true.png`,
    IMG_AUDIO_FALSE: `${PATH}/audio-false.png`,
    IMG_CAMERA_TRUE: `${PATH}/camera-true.png`,
    IMG_CAMERA_FALSE: `${PATH}/camera-false.png`,
    IMG_TRANS: `${PATH}/trans.png`,
    IMG_SWITCH_CAMERA: `${PATH}/switch_camera.png`,
    IMG_MINIMIZE_BLACK: `${PATH}/minimize-black.svg`,
    IMG_MINIMIZE_WHITE: `${PATH}/minimize-white.png`,
    IMG_VIRTUALBACKGROUND_OPEN: `${PATH}/virtualBackground-open.png`,
    IMG_VIRTUALBACKGROUND_CLOSE: `${PATH}/virtualBackground-close.png`,
    IMG_VIRTUALBACKGROUND_MINI: `${PATH}/virtualBackground-mini.png`,
    // 使用空字符串作为属性传入，属性更新不会更新live-pusher
    pictureMode: "push",
  },
  methods: {
    async accept() {
      await TUICallKitAPI.accept();
    },
    async hangup() {
      await TUICallKitAPI.hangup();
    },
    async reject() {
      await TUICallKitAPI.reject();
    },
    async switchCamera() {
      await TUICallKitAPI.switchCamera();
    },
    toggleMinimize() {
      wx.navigateBack();
    },
    async microPhoneHandler() {
      if (this.data.localUserInfo.isAudioAvailable) {
        await TUICallKitAPI.closeMicrophone();
      } else {
        await TUICallKitAPI.openMicrophone();
      }
    },
    async cameraHandler() {
      if (this.data.localUserInfo.isVideoAvailable) {
        await TUICallKitAPI.closeCamera();
      } else {
        await TUICallKitAPI.openCamera('localVideo');
      }
    },
    async toggleSoundMode() {
      await TUICallKitAPI.setSoundMode();
    },
    async setBlurBackground() {
      await TUICallKitAPI.setBlurBackground(!this.data.isVirtualBackground);
    },
    toggleViewSize() {
      TUICallKitAPI.switchScreen(
        this.data.bigScreenUserId ? "player" : "localVideo"
      );
    },
  },
  lifetimes: {
    detached() {
    },
  },
});
