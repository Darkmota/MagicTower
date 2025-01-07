import type { AudioSystem } from './types/global.js';

let audioContext: AudioContext | null = null;

try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass();
} catch (e) {
    alert("该浏览器不支持Web Audio API");
}

function audioLoad(src: string, callback: (audio: HTMLAudioElement) => void): void {
    if (!src) return;
    const audio = document.createElement("audio");
    audio.oncanplay = () => callback(audio);
    audio.src = src;
    audio.crossOrigin = "anonymous";
    callback(audio);
}

function playSound(buffer: AudioBuffer, startTime?: number): void {
    if (!audioContext) return;
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(startTime || 0);
}

function loadSound(url: string, index: number): void {
    if (!audioContext) return;
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        audioContext!.decodeAudioData(
            request.response,
            function(buffer: AudioBuffer) {
                mainAudio.buffer[index] = $.extend(buffer, {}, true);
                mainAudio.loaded++;
                if (mainAudio.loaded === mainAudio.loadTotal) {
                    mainAudio.dataReady = true;
                }
            },
            function() {
                alert("WEB Audio API error");
            }
        );
    };
    request.send();
}

export class GameAudio implements AudioSystem {
    public loaded: number = 0;
    private waitBuffer: boolean = false;
    public loadTotal: number = Infinity;
    public dataReady: boolean = false;
    private data: any = null;
    private audio: HTMLAudioElement[] = [];
    public buffer: AudioBuffer[] = [];
    private BGM: AudioBufferSourceNode | null = null;
    private BGMId: number = -1;

    public load(audioData: { audio: any[], audioNum: number }): void {
        this.loaded = 0;
        this.loadTotal = Infinity;
        this.dataReady = false;
        this.buffer = [];
        this.data = audioData.audio;
        this.loadTotal = audioData.audioNum;
        for (let i = 0; i < this.loadTotal; ++i) {
            loadSound(this.data[i][2], i);
        }
    }

    public playSE(i: number): void {
        playSound(this.buffer[i]);
    }

    public playBGM(i: number): void {
        if (!audioContext) return;
        
        if (i !== this.BGMId) {
            this.BGMId = i;
            if (this.BGM) {
                this.BGM.stop();
            }
            this.BGM = audioContext.createBufferSource();
            this.BGM.connect(audioContext.destination);
            this.BGM.buffer = this.buffer[i];
            this.BGM.start(0);
        }
    }

    public stopBGM(): void {
        if (this.BGM) {
            this.BGM.stop();
            this.BGM = null;
            this.BGMId = -1;
        }
    }
}
