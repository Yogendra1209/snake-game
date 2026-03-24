import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "SYS.AUDIO_STREAM_01",
    artist: "NEURAL_NET_v2",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "SYS.AUDIO_STREAM_02",
    artist: "DEEP_LEARN_ALG",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "SYS.AUDIO_STREAM_03",
    artist: "QUANTUM_CORE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const playNext = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const playPrev = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) setProgress((current / duration) * 100);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full bg-black border-4 border-cyan-500 p-4 relative">
      <div className="absolute top-0 left-0 bg-cyan-500 text-black px-2 text-lg font-bold">
        AUDIO_SUBSYSTEM
      </div>
      
      <audio ref={audioRef} src={currentTrack.url} onTimeUpdate={handleTimeUpdate} onEnded={playNext} />
      
      <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-fuchsia-500 text-3xl glitch-neon-text">
            {currentTrack.title}
          </h3>
          <p className="text-cyan-400 text-xl">
            SRC: {currentTrack.artist}
          </p>
        </div>
        
        <div className="flex items-center gap-4 border-2 border-fuchsia-500 p-2">
          <span className="text-fuchsia-500 text-xl">VOL:</span>
          <button onClick={() => setIsMuted(!isMuted)} className="text-cyan-400 hover:text-fuchsia-500 text-xl">
            [{isMuted || volume === 0 ? 'MUTED' : 'ACTIVE'}]
          </button>
          <input 
            type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume}
            onChange={(e) => { setVolume(parseFloat(e.target.value)); if (isMuted) setIsMuted(false); }}
            className="w-24 h-4 bg-black border-2 border-cyan-500 appearance-none cursor-pointer accent-fuchsia-500"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-6 w-full bg-black border-2 border-cyan-500 mt-4 cursor-pointer relative" onClick={handleProgressClick}>
        <div 
          className="h-full bg-fuchsia-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex justify-between px-2 items-center pointer-events-none text-black mix-blend-difference text-xl">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4 border-t-2 border-cyan-500 pt-4">
        <div className="text-cyan-400 text-xl animate-pulse">
          {isPlaying ? 'PLAYBACK_ACTIVE' : 'STANDBY_MODE'}
        </div>
        <div className="flex gap-4">
          <button onClick={playPrev} className="text-2xl text-cyan-400 hover:text-black hover:bg-cyan-400 border-2 border-cyan-400 px-4 py-1 transition-none">
            [ &lt;&lt; ]
          </button>
          <button onClick={togglePlay} className="text-2xl text-fuchsia-500 hover:text-black hover:bg-fuchsia-500 border-2 border-fuchsia-500 px-4 py-1 transition-none">
            [ {isPlaying ? 'PAUSE' : 'PLAY'} ]
          </button>
          <button onClick={playNext} className="text-2xl text-cyan-400 hover:text-black hover:bg-cyan-400 border-2 border-cyan-400 px-4 py-1 transition-none">
            [ &gt;&gt; ]
          </button>
        </div>
      </div>
    </div>
  );
}
