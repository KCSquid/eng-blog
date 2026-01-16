"use client";

import { useRef, useState, useEffect } from "react";

export default function QR() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loop, setLoop] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(1);

  // Ensure duration is set when src changes or metadata is loaded
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateDuration = () => setDuration(audio.duration || 0);
    audio.addEventListener("loadedmetadata", updateDuration);
    // If metadata already loaded
    if (audio.duration) setDuration(audio.duration);
    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [audioRef.current]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    audioRef.current.currentTime = percent * duration;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleRewind = () => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, audioRef.current.currentTime - 10);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleForward = () => {
    if (!audioRef.current || !duration) return;
    const newTime = Math.min(duration, audioRef.current.currentTime + 10);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleLoop = () => {
    setLoop((l) => !l);
    if (audioRef.current) {
      audioRef.current.loop = !loop;
    }
  };

  const handleVolumeClick = () => setShowVolume((v) => !v);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  };

  const formatTime = (t: number) => {
    if (!isFinite(t) || t < 0) t = 0;
    return `${Math.floor(t / 60)
      .toString()
      .padStart(2, "0")}:${Math.floor(t % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="font-sans h-screen w-screen flex flex-col gap-4 items-center justify-center">
      <div className="absolute top-0 left-0 -z-10 min-w-screen rotate-180">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#0099ff"
              fillOpacity="1"
              d="M0,160L34.3,160C68.6,160,137,160,206,149.3C274.3,139,343,117,411,122.7C480,128,549,160,617,176C685.7,192,754,192,823,176C891.4,160,960,128,1029,106.7C1097.1,85,1166,75,1234,101.3C1302.9,128,1371,192,1406,224L1440,256L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
            ></path>
          </svg>
        </svg>
      </div>
      <div className="h-1/2 aspect-square rounded-sm bg-[url(https://naccnaca-biographies.s3.amazonaws.com/31909/autumnpeltier_credit_jessicadeeks_20220103_macleans.jpg)] bg-cover"></div>
      <div className="w-[50vh] text-center flex flex-col gap-2">
        <h1 className="text-2xl font-semibold ">
          Water, Justice, and Youth: The voice of Autumn Peltier
        </h1>
        <h2 className="text-base text-neutral-500">
          NBE3U0 Final Project Podcast
        </h2>
      </div>
      <div className="w-[50vh] h-1/6 rounded-sm flex flex-col overflow-hidden">
        <div className="bg-sky-200 w-full grow flex flex-col justify-center px-4 py-2">
          <div className="flex items-center justify-between text-sm font-mono text-sky-900 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div
            className="relative h-2 bg-sky-300 rounded cursor-pointer"
            onClick={handleBarClick}
          >
            <div
              className="absolute top-0 left-0 h-2 bg-sky-500 rounded"
              style={{
                width: duration ? `${(currentTime / duration) * 100}%` : "0%",
                transition: "width 0.1s linear",
              }}
            ></div>
          </div>
        </div>
        <div className="bg-blue-300 w-full basis-3/5 flex items-center justify-center relative">
          <button
            className={`rounded-full bg-blue-100/75 hover:bg-blue-50 text-blue-900 p-3 shadow mx-2 ${
              loop ? "ring-2 ring-blue-600" : ""
            }`}
            onClick={handleLoop}
            aria-label="Toggle loop"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-repeat-icon lucide-repeat"
            >
              <path d="m17 2 4 4-4 4" />
              <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
              <path d="m7 22-4-4 4-4" />
              <path d="M21 13v1a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
          <button
            className="rounded-full bg-blue-100/75 hover:bg-blue-50 text-blue-900 p-3 font-bold text-lg shadow mx-2"
            onClick={handleRewind}
            aria-label="Rewind 10 seconds"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-skip-back-icon lucide-skip-back"
            >
              <path d="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z" />
              <path d="M3 20V4" />
            </svg>
          </button>
          <button
            className="rounded-full bg-blue-100 hover:bg-blue-50 text-blue-900 p-3 font-bold text-lg shadow mx-2"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-pause-icon lucide-pause"
              >
                <rect x="14" y="3" width="5" height="18" rx="1" />
                <rect x="5" y="3" width="5" height="18" rx="1" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-play-icon lucide-play"
              >
                <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
              </svg>
            )}
          </button>
          <button
            className="rounded-full bg-blue-100/75 hover:bg-blue-50 text-blue-900 p-3 font-bold text-lg shadow mx-2"
            onClick={handleForward}
            aria-label="Forward 10 seconds"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-skip-forward-icon lucide-skip-forward"
            >
              <path d="M21 4v16" />
              <path d="M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z" />
            </svg>
          </button>
          <div className="relative mx-2">
            <button
              className="rounded-full bg-blue-100/75 hover:bg-blue-50 text-blue-900 p-3 shadow"
              onClick={handleVolumeClick}
              aria-label="Volume"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-volume2-icon lucide-volume-2"
              >
                <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
                <path d="M16 9a5 5 0 0 1 0 6" />
                <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
              </svg>
            </button>
            {showVolume && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-12 bg-white rounded shadow px-3 py-2 flex items-center z-10">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 accent-blue-500"
                />
              </div>
            )}
          </div>
          <audio
            ref={audioRef}
            src="/peltier.mp3"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            loop={loop}
            hidden
          />
        </div>
      </div>
    </div>
  );
}
