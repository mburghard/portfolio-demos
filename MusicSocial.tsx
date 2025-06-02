'use client';
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Poppins } from 'next/font/google';

interface User {
  id: string;
  name: string;
  genre: string;
  instruments: string[];
  bio: string;
  profileImage: string;
  bannerImage: string;
  followers: number;
  following: number;
}

interface Post {
  id: string;
  userId: string;
  content: string;
  likes: number;
  comments: Comment[];
  image?: string;
  createdAt: Date;
}

interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}

interface MusicUpload {
  id: string;
  userId: string;
  title: string;
  url: string;
  coverArt: string;
  genre?: string;
  description?: string;
}

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const dummyUsers: User[] = [
  {
    id: "1",
    name: "Luna Nightingale",
    genre: "Indie Folk",
    instruments: ["Vocals", "Guitar", "Piano"],
    bio: "Singer-songwriter from Portland, OR. I write about nature and dreams.",
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww",
    bannerImage:
      "https://images.unsplash.com/photo-1715405538341-5c7ed5d047d2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    followers: 1423,
    following: 567,
  },
  {
    id: "2",
    name: "Ethan Rivers",
    genre: "Electronic",
    instruments: ["Synth", "Drums", "Bass"],
    bio: "Producer and multi-instrumentalist from Brooklyn, NY.",
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA==",
    bannerImage:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    followers: 2897,
    following: 431,
  },
  {
    id: "3",
    name: "Ava Moon",
    genre: "Jazz",
    instruments: ["Saxophone", "Flute"],
    bio: "Jazz musician from New Orleans, LA. Exploring the intersection of jazz and ambient sounds.",
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww",
    bannerImage:
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    followers: 986,
    following: 374,
  },
  {
    id: "4",
    name: "Jasper Blackwood",
    genre: "Rock",
    instruments: ["Guitar", "Vocals"],
    bio: "Rock musician from Los Angeles, CA. Writing songs about life's adventures.",
    profileImage:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGF2YXRhcnxlbnwwfHwwfHx8MA==",
    bannerImage:
      "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?q=80&w=2716&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    followers: 2123,
    following: 589,
  },
  {
    id: "5",
    name: "Mia Fields",
    genre: "Classical",
    instruments: ["Violin", "Piano"],
    bio: "Classically trained violinist from Boston, MA. Exploring modern classical compositions.",
    profileImage:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGF2YXRhcnxlbnwwfHwwfHx8MA==",
    bannerImage:
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    followers: 1754,
    following: 402,
  },
];

const dummyPosts: Post[] = [
  {
    id: "1",
    userId: "1",
    content: "Just released a new single! Check it out on all major platforms 🎵",
    likes: 45,
    comments: [
      {
        id: "1",
        userId: "2",
        content: "Amazing work! Love it",
        createdAt: new Date(),
      },
    ],
    image:
      "https://images.unsplash.com/photo-1433048980017-63f162f662b0?q=80&w=2448&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    createdAt: new Date(),
  },
  {
    id: "2",
    userId: "2",
    content:
      "Working on a new track inspired by my recent travels. Can't wait to share the final result!",
    likes: 32,
    comments: [],
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2621&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    createdAt: new Date(),
  },
  {
    id: "3",
    userId: "3",
    content: "Jamming with some amazing musicians tonight! 🎸",
    likes: 67,
    comments: [],
    image:
      "https://images.unsplash.com/photo-1481886756534-97af88ccb438?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    createdAt: new Date(),
  },
  {
    id: "4",
    userId: "4",
    content:
      "Excited to announce my upcoming tour dates! Follow me for updates and behind-the-scenes content 🎤",
    likes: 89,
    comments: [],
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG91cnxlbnwwfHwwfHx8MA==",
    createdAt: new Date(),
  },
  {
    id: "5",
    userId: "5",
    content: "New music video coming soon! Stay tuned 🎬",
    likes: 123,
    comments: [],
    image:
      "https://images.unsplash.com/photo-1560785218-893cc779709b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    createdAt: new Date(),
  },
];

const dummyMusicUploads: MusicUpload[] = [
  {
    id: "1",
    userId: "1",
    title: "Echoes in the Forest",
    url: "https://freepd.com/music/Landra's%20Dream.mp3",
    coverArt:
      "https://images.unsplash.com/photo-1433048980017-63f162f662b0?q=80&w=2448&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    genre: "Indie Folk",
    description: "A soothing acoustic track inspired by nature walks"
  },
  {
    id: "2",
    userId: "2",
    title: "Neon Dreams",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    coverArt:
      "https://images.unsplash.com/photo-1543121955-8dfb9e9e255f?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    genre: "Electronic",
    description: "Upbeat electronic track with dreamy synths"
  },
  {
    id: "3",
    userId: "3",
    title: "Moonlit Swing",
    url: "https://freepd.com/music/Finally%20See%20The%20Light.mp3",
    coverArt:
      "https://images.unsplash.com/photo-1512805121331-92b37f7ecd36?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    genre: "Jazz",
    description: "Smooth jazz piece for late night listening"
  },
  {
    id: "4",
    userId: "4",
    title: "Wildfire",
    url: "https://freepd.com/music/Murder%20On%20The%20Bayou.mp3",
    coverArt:
      "https://images.unsplash.com/photo-1708014991860-576252226623?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    genre: "Rock",
    description: "Delta Blues-inspired dark rock track"
  },
  {
    id: "5",
    userId: "5",
    title: "Symphony of Dreams",
    url: "https://freepd.com/music/Rulers%20of%20Our%20Lands.mp3",
    coverArt:
      "https://images.unsplash.com/photo-1516060610219-308fc12a5e37?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    genre: "Classical",
    description: "Orchestral composition inspired by dreams"
  },
];

const genreOptions = [
  "Rock", "Pop", "Hip Hop", "R&B", "Electronic", "Jazz",
  "Classical", "Indie", "Folk", "Country", "Metal", "Punk",
  "Blues", "Reggae", "World", "Experimental", "Other"
];

const MusicPlayer = ({
  song,
  onClose,
  isExpanded,
  toggleExpand
}: {
  song: MusicUpload;
  onClose: () => void;
  isExpanded: boolean;
  toggleExpand: () => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setCurrentTime(audio.currentTime);
    const handleCanPlay = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);
    setCurrentTime(0);
    audio.src = song.url;
    audio.load();

    const handleCanPlayThrough = () => {
      audio.play().catch(error => {
        console.error("Playback failed:", error);
        setIsLoading(false);
      });
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [song]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error("Playback failed:", error);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const seekTime = parseFloat(e.target.value);
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`absolute bottom-12 left-0 right-0 z-50 bg-gray-900 text-white border-t border-gray-800 transition-all duration-300 ${isExpanded ? 'h-40' : 'h-24'}`}>
      <div className="container mx-auto px-4 h-full">
        {!isExpanded ? (
          <div className="flex items-center h-full gap-4">
            <button
              onClick={togglePlay}
              className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white truncate">{song.title}</h3>
              <p className="text-gray-300 text-sm truncate">
                {dummyUsers.find(u => u.id === song.userId)?.name || "Unknown Artist"}
              </p>
              <div className="w-full mt-2">
                <input
                  type="range"
                  value={currentTime}
                  min="0"
                  max={duration || 100}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 ${progress}%, #4b5563 ${progress}%)`
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleExpand}
                className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src={song.coverArt}
                  alt={`${song.title} cover art`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white">{song.title}</h3>
                <p className="text-gray-300 text-sm">
                  {dummyUsers.find(u => u.id === song.userId)?.name || "Unknown Artist"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>

              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-gray-400 w-8">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  value={currentTime}
                  min="0"
                  max={duration || 100}
                  onChange={handleSeek}
                  className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 ${progress}%, #4b5563 ${progress}%)`
                  }}
                />
                <span className="text-xs text-gray-400 w-8">{formatTime(duration)}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <button
                  onClick={toggleExpand}
                  className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <audio
        ref={audioRef}
        src={song.url}
        onEnded={() => setIsPlaying(false)}
        aria-label={`${song.title}`}
        preload="auto"
      />
    </div>
  );
};

const UserProfileModal = ({
  user,
  onClose,
  currentUserId,
  following,
  handleFollow,
  musicUploads,
  handlePlayMusic
}: {
  user: User;
  onClose: () => void;
  currentUserId: string;
  following: string[];
  handleFollow: (userId: string) => void;
  musicUploads: MusicUpload[];
  handlePlayMusic: (music: MusicUpload) => void;
}) => {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-800 shadow-2xl overflow-hidden"
      >
        {/* Banner Section */}
        <div className="relative h-64 sm:h-80 w-full">
          <img
            src={user.bannerImage || "/placeholder.svg"}
            alt="Banner"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-gray-900/50"></div>
          <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
            {currentUserId !== user.id && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFollow(user.id)}
                className={`px-4 py-2 rounded-full font-bold transition-all shadow-lg backdrop-blur-sm ${following.includes(user.id)
                    ? "bg-gray-800/80 text-white border border-gray-700 hover:bg-gray-700/80"
                    : "bg-gradient-to-r from-purple-600/90 to-pink-600/90 hover:from-purple-700/90 hover:to-pink-700/90 text-white"
                  }`}
              >
                {following.includes(user.id) ? "Following" : "Follow"}
              </motion.button>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center bg-gray-800/80 hover:bg-gray-700/80 rounded-full transition-colors shadow-lg backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Profile Info - Still at bottom of banner */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10">
                  <img
                    src={user.profileImage || "/placeholder.svg"}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {user.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-300 text-sm rounded-full">
                    {user.genre}
                  </span>
                  {user.instruments.slice(0, 3).map((instrument) => (
                    <span key={instrument} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                      {instrument}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Bio Section */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Bio
                </h2>
                <p className="text-gray-300">
                  {user.bio || "This musician hasn't written a bio yet."}
                </p>
              </div>

              {/* Posts Section */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Posts
                </h2>
                {dummyPosts.filter(post => post.userId === user.id).length > 0 ? (
                  <div className="space-y-4">
                    {dummyPosts
                      .filter((post) => post.userId === user.id)
                      .map((post) => (
                        <div key={post.id} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                              <img
                                src={user.profileImage || "/placeholder.svg"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="font-medium">{user.name}</p>
                          </div>
                          <p className="mb-3 text-gray-300">{post.content}</p>
                          {post.image && (
                            <div className="rounded-lg overflow-hidden mb-3">
                              <img
                                src={post.image || "/placeholder.svg"}
                                alt="Post"
                                className="w-full h-auto max-h-64 object-cover"
                              />
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span>
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <div className="flex space-x-3">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {post.likes}
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                {post.comments.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-1">No posts yet</h3>
                    <p className="text-gray-500 text-sm">This musician hasn't shared any posts</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Stats
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-700/50">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-gray-300">Followers</span>
                    </div>
                    <span className="text-white font-bold">
                      {user.followers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-700/50">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-gray-300">Following</span>
                    </div>
                    <span className="text-white font-bold">
                      {user.following.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Music Uploads */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  Music
                </h2>
                {musicUploads.filter(music => music.userId === user.id).length > 0 ? (
                  <div className="space-y-3">
                    {musicUploads
                      .filter((music) => music.userId === user.id)
                      .map((music) => (
                        <motion.div
                          key={music.id}
                          whileHover={{ x: 2 }}
                          className="flex items-center space-x-3 bg-gray-900/50 hover:bg-gray-900/70 rounded-lg p-3 border border-gray-700/50 cursor-pointer transition-colors"
                          onClick={() => handlePlayMusic(music)}
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                            <img
                              src={music.coverArt || "/placeholder.svg"}
                              alt={music.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{music.title}</p>
                            <p className="text-xs text-gray-400 truncate">{music.genre}</p>
                          </div>
                          <button className="p-1.5 bg-purple-600/20 hover:bg-purple-600/30 rounded-full text-purple-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </motion.div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="mx-auto w-14 h-14 bg-gray-700/50 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-300 mb-1">No music uploaded</h3>
                    <p className="text-gray-500 text-xs">This musician hasn't shared any tracks yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const MusicUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  currentUserId
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (music: Omit<MusicUpload, 'id'>) => void;
  currentUserId: string;
}) => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    setTimeout(() => {
      const newMusic: Omit<MusicUpload, 'id'> = {
        userId: currentUserId,
        title,
        url: audioFile ? URL.createObjectURL(audioFile) : "",
        coverArt: coverFile ? URL.createObjectURL(coverFile) : "https://via.placeholder.com/150",
        genre,
        description
      };

      onUpload(newMusic);
      setIsUploading(false);
      onClose();
      setTitle("");
      setGenre("");
      setDescription("");
      setAudioFile(null);
      setCoverFile(null);
      setPreviewImage(null);
    }, 1500);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative bg-gray-900 rounded-2xl w-full max-w-md p-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-6">Upload Music</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  required
                >
                  <option value="">Select a genre</option>
                  {genreOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Audio File</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-xl cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        MP3, WAV, or other audio files
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="audio/*"
                      onChange={(e) => e.target.files && setAudioFile(e.target.files[0])}
                      required
                    />
                  </label>
                </div>
                {audioFile && (
                  <p className="mt-2 text-sm text-gray-300">
                    Selected: {audioFile.name}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Cover Art (Optional)</label>
                <div className="flex items-center space-x-4">
                  {previewImage ? (
                    <div className="w-24 h-24 rounded-xl overflow-hidden">
                      <img src={previewImage} alt="Cover preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-gray-800 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-700 border-dashed rounded-xl cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <p className="mb-2 text-sm text-gray-400">
                            <span className="font-semibold">Click to upload</span>
                          </p>
                          <p className="text-xs text-gray-400">
                            JPG, PNG up to 5MB
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleCoverChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isUploading}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Uploading...
                    </div>
                  ) : (
                    "Upload"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MusicianSocialApp = () => {
  const [currentUser, setCurrentUser] = useState<User>(dummyUsers[0]);
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  const [musicUploads, setMusicUploads] = useState<MusicUpload[]>(dummyMusicUploads);
  const [following, setFollowing] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "discover" | "feed">("profile");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const [newPostPreview, setNewPostPreview] = useState<string | null>(null);
  const [commentContents, setCommentContents] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentProfile, setCurrentProfile] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<MusicUpload | null>(null);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  useEffect(() => {
    const currentUserProfile = users.find((user) => user.id === currentUser.id);
    if (currentUserProfile) {
      setCurrentProfile(currentUserProfile);
    }
  }, [currentUser, users]);

  const handleFollow = (userId: string) => {
    if (following.includes(userId)) {
      setFollowing(following.filter((id) => id !== userId));
    } else {
      setFollowing([...following, userId]);
    }
  };

  const handleCreatePost = () => {
    if (newPostContent.trim() || newPostImage) {
      const newPost: Post = {
        id: Date.now().toString(),
        userId: currentUser.id,
        content: newPostContent,
        likes: 0,
        comments: [],
        image: newPostImage ? URL.createObjectURL(newPostImage) : undefined,
        createdAt: new Date(),
      };

      setPosts([newPost, ...posts]);
      setNewPostContent("");
      setNewPostImage(null);
      setNewPostPreview(null);
    }
  };

  const handleCreateComment = (postId: string) => {
    const content = commentContents[postId];
    if (content?.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        userId: currentUser.id,
        content: content,
        createdAt: new Date(),
      };

      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, newComment],
            };
          }
          return post;
        })
      );

      setCommentContents(prev => ({ ...prev, [postId]: "" }));
    }
  };

  const handleCommentChange = (postId: string, value: string) => {
    setCommentContents(prev => ({ ...prev, [postId]: value }));
  };

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const handleUploadMusic = (music: Omit<MusicUpload, 'id'>) => {
    const newMusic: MusicUpload = {
      ...music,
      id: Date.now().toString(),
    };
    setMusicUploads([newMusic, ...musicUploads]);
  };

  const handleDeleteMusic = (musicId: string) => {
    setMusicUploads(musicUploads.filter(music => music.id !== musicId));
  };

  const handlePlayMusic = (music: MusicUpload) => {
    setNowPlaying(music);
  };

  const handleClosePlayer = () => {
    setNowPlaying(null);
  };

  const filteredUsers = users.filter((user) => {
    if (user.id === currentUser.id) return false;
    if (searchQuery.trim() === "") return true;
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.instruments.some((i) =>
        i.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  const feedPosts = [...posts.filter(post => following.includes(post.userId)),
  ...posts.filter(post => post.userId === currentUser.id)];

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewPostImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (profilePreview) {
      setCurrentUser(prev => ({
        ...prev,
        profileImage: profilePreview
      }));
    }

    if (bannerPreview) {
      setCurrentUser(prev => ({
        ...prev,
        bannerImage: bannerPreview
      }));
    }

    setProfileImageFile(null);
    setBannerImageFile(null);
  };

  return (
    <div className={`min-h-screen bg-gray-950 text-white ${poppins.className}`}>
      {/* <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>{`
            @font-face {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfedw.ttf) format('truetype');
            }
            @font-face {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 500;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlEA.ttf) format('truetype');
            }
            @font-face {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 600;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlEA.ttf) format('truetype');
            }
            @font-face {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 700;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlEA.ttf) format('truetype');
            }
        `}</style>
        </Helmet> */}
      {nowPlaying && (
        <MusicPlayer
          song={nowPlaying}
          onClose={handleClosePlayer}
          isExpanded={isPlayerExpanded}
          toggleExpand={() => setIsPlayerExpanded(!isPlayerExpanded)}
        />
      )}

      {viewingUser && (
        <UserProfileModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
          currentUserId={currentUser.id}
          following={following}
          handleFollow={handleFollow}
          musicUploads={musicUploads}
          handlePlayMusic={handlePlayMusic}
        />
      )}

      <MusicUploadModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
        onUpload={handleUploadMusic}
        currentUserId={currentUser.id}
      />

      <header className="sticky top-0 z-40 bg-gray-900/90 shadow-lg backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("feed")}
            className="flex items-center cursor-pointer"
          >
            <svg className="w-8 h-8 mr-2 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
            </svg>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 bg-clip-text text-transparent">
              RhythmConnect
            </h1>
          </motion.div>

          <nav className="md:flex space-x-6">
            {[
              { id: "profile", label: "Profile" },
              { id: "discover", label: "Discover" },
              { id: "feed", label: "Feed" }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-2 py-1 transition-colors ${activeTab === tab.id
                    ? "text-purple-400"
                    : "text-gray-300 hover:text-purple-400"
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
              </motion.button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <div className="relative w-10 h-10 overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src={currentUser.profileImage}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex justify-around border-t border-gray-800 py-2">
          {[
            { id: "profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
            { id: "discover", label: "Discover", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
            { id: "feed", label: "Feed", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center px-2 py-1 text-xs ${activeTab === tab.id ? "text-purple-400" : "text-gray-400"
                }`}
            >
              <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Profile Header */}
              <div className="relative rounded-2xl overflow-hidden h-60 bg-gradient-to-br from-purple-900/50 to-gray-900 border border-gray-800">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                <img
                  src={bannerPreview || currentProfile?.bannerImage || "/placeholder.svg"}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-transparent">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between">
                    <div className="flex items-end">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1 mr-4">
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10">
                          <img
                            src={profilePreview || currentProfile?.profileImage || "/placeholder.svg"}
                            alt={currentProfile?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                          />
                        </label>
                      </div>
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                          {currentProfile?.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full">
                            {currentProfile?.genre}
                          </span>
                          {currentProfile?.instruments.map((instrument, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                              {instrument}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {(profilePreview || bannerPreview) && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveProfile}
                        className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-6 rounded-xl transition-all shadow-lg shadow-purple-500/10"
                      >
                        Save Changes
                      </motion.button>
                    )}
                  </div>
                </div>
                <label className="absolute top-4 right-4 bg-gray-900/50 hover:bg-gray-800/70 p-2 rounded-lg cursor-pointer transition-colors backdrop-blur-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleBannerImageChange}
                  />
                </label>
              </div>

              {/* Bio Section */}
              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Bio</h2>
                  <button className="text-gray-400 hover:text-purple-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {currentProfile?.bio || "No bio yet. Tell the world about yourself!"}
                </p>
              </div>

              {/* Create Post */}
              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img
                        src={currentUser.profileImage}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="flex-1 p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                    rows={3}
                  />
                </div>

                {newPostPreview && (
                  <div className="relative rounded-xl overflow-hidden mb-4 group">
                    <img
                      src={newPostPreview}
                      alt="Post preview"
                      className="w-full h-auto max-h-96 object-cover"
                    />
                    <button
                      onClick={() => {
                        setNewPostImage(null);
                        setNewPostPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-gray-900/80 hover:bg-gray-800/90 p-2 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <label className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/70 cursor-pointer transition-colors">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePostImageChange}
                      />
                    </label>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() && !newPostImage}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </motion.button>
                </div>
              </div>

              {/* Posts and Music Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Posts Section */}
                  <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white mb-6">Your Posts</h2>

                    {posts.filter(post => post.userId === currentUser.id).length > 0 ? (
                      <div className="space-y-6">
                        {posts
                          .filter((post) => post.userId === currentUser.id)
                          .map((post) => (
                            <div key={post.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                              {/* Post Header */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                      <img
                                        src={users.find(u => u.id === post.userId)?.profileImage || "/placeholder.svg"}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <p className="font-bold">{users.find(u => u.id === post.userId)?.name}</p>
                                    <p className="text-xs text-gray-400">
                                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                </div>
                                <button className="text-gray-400 hover:text-white">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                  </svg>
                                </button>
                              </div>

                              {/* Post Content */}
                              <p className="mb-4 text-gray-300">{post.content}</p>

                              {/* Post Image */}
                              {post.image && (
                                <div className="rounded-xl overflow-hidden mb-4 border border-gray-800">
                                  <img
                                    src={post.image}
                                    alt="Post"
                                    className="w-full h-auto max-h-96 object-cover"
                                  />
                                </div>
                              )}

                              {/* Post Actions */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleLikePost(post.id)}
                                    className="flex items-center space-x-1 text-gray-300 hover:text-pink-400 transition-colors"
                                  >
                                    <svg className="w-5 h-5" fill={post.likes > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span>{post.likes}</span>
                                  </motion.button>
                                  <button className="flex items-center space-x-1 text-gray-300 hover:text-purple-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span>{post.comments.length}</span>
                                  </button>
                                </div>
                              </div>

                              {/* Comments Section */}
                              <div className="space-y-3">
                                {post.comments.map((comment) => (
                                  <div key={comment.id} className="flex items-start space-x-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800">
                                      <img
                                        src={users.find(u => u.id === comment.userId)?.profileImage || "/placeholder.svg"}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 bg-gray-800/50 rounded-xl p-3">
                                      <div className="flex justify-between items-start">
                                        <p className="font-medium text-sm">
                                          {users.find(u => u.id === comment.userId)?.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                      </div>
                                      <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
                                    </div>
                                  </div>
                                ))}

                                {/* Add Comment */}
                                <div className="flex items-center space-x-2 mt-4">
                                  <div className="flex-1 bg-gray-800/50 rounded-full px-4 py-2">
                                    <input
                                      type="text"
                                      value={commentContents[post.id] || ""}
                                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                      placeholder="Write a comment..."
                                      className="w-full bg-transparent border-none focus:ring-0 text-sm text-white placeholder-gray-400"
                                      onKeyPress={(e) => e.key === 'Enter' && handleCreateComment(post.id)}
                                    />
                                  </div>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleCreateComment(post.id)}
                                    disabled={!commentContents[post.id]?.trim()}
                                    className="p-2 bg-purple-600/50 hover:bg-purple-600/70 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-300 mb-1">No posts yet</h3>
                        <p className="text-gray-500 text-sm">Share your thoughts with the community</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Stats Card */}
                  <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white mb-4">Stats</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/50">
                        <p className="text-2xl font-bold text-purple-400">{currentProfile?.followers || 0}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Followers</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/50">
                        <p className="text-2xl font-bold text-pink-400">{currentProfile?.following || 0}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Following</p>
                      </div>
                    </div>
                  </div>

                  {/* Music Uploads */}
                  <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-white">Your Music</h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMusicModalOpen(true)}
                        className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-1.5 px-4 rounded-lg transition-all"
                      >
                        Upload
                      </motion.button>
                    </div>

                    {musicUploads.filter(music => music.userId === currentUser.id).length > 0 ? (
                      <div className="space-y-3">
                        {musicUploads
                          .filter((music) => music.userId === currentUser.id)
                          .map((music) => (
                            <motion.div
                              key={music.id}
                              whileHover={{ translateX: 2 }}
                              className="flex items-center space-x-3 bg-gray-800/50 hover:bg-gray-800/70 rounded-xl p-3 border border-gray-700/50 cursor-pointer transition-colors"
                              onClick={() => handlePlayMusic(music)}
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700/50 flex-shrink-0">
                                <img
                                  src={music.coverArt || "/placeholder.svg"}
                                  alt={music.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{music.title}</p>
                                <p className="text-xs text-gray-400 truncate">{music.genre}</p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlayMusic(music);
                                  }}
                                  className="p-1.5 bg-purple-600/20 hover:bg-purple-600/30 rounded-full text-purple-400 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMusic(music.id);
                                  }}
                                  className="p-1.5 bg-gray-700/50 hover:bg-gray-700/70 rounded-full text-gray-400 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-300 mb-1">No music uploaded</h3>
                        <p className="text-gray-500 text-sm">Share your creations with the world</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Discover Tab */}
          {activeTab === "discover" && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold text-white">Discover Musicians</h1>

              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, genre, or instrument..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors backdrop-blur-sm"
                />
              </div>

              {/* Genre Filters */}
              <div className="overflow-x-auto pb-2">
                <div className="flex space-x-2">
                  {["All", "Indie", "Electronic", "Jazz", "Rock", "Classical"].map((genre) => (
                    <button
                      key={genre}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${searchQuery === genre
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70"
                        } transition-colors`}
                      onClick={() => setSearchQuery(genre === "All" ? "" : genre)}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Musicians Grid */}
              {filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      whileHover={{ y: -5 }}
                      className="bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800 backdrop-blur-sm transition-all hover:shadow-lg"
                    >
                      <div className="relative h-48">
                        <img
                          src={user.bannerImage || "/placeholder.svg"}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          {currentUser.id !== user.id && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleFollow(user.id)}
                              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${following.includes(user.id)
                                  ? "bg-gray-800/80 text-white border border-gray-700"
                                  : "bg-purple-600 hover:bg-purple-700 text-white"
                                }`}
                            >
                              {following.includes(user.id) ? "Following" : "Follow"}
                            </motion.button>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center">
                            <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-1 mr-3">
                              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10">
                                <img
                                  src={user.profileImage || "/placeholder.svg"}
                                  alt={user.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div>
                              <h2 className="text-lg font-bold text-white">{user.name}</h2>
                              <p className="text-gray-300 text-sm">
                                {user.genre}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {user.bio}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {user.instruments.map((instrument) => (
                            <span key={instrument} className="px-2 py-1 bg-gray-800/50 text-gray-300 text-xs rounded-full">
                              {instrument}
                            </span>
                          ))}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setViewingUser(user)}
                          className="w-full py-2 bg-gray-800/50 hover:bg-gray-700/70 rounded-lg text-sm transition-colors border border-gray-700/50"
                        >
                          View Profile
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-300 mb-2">No musicians found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Feed Tab */}
          {activeTab === "feed" && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold text-white">Your Feed</h1>

              {/* Create Post */}
              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img
                        src={currentUser.profileImage}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="flex-1 p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                    rows={3}
                  />
                </div>

                {newPostPreview && (
                  <div className="relative rounded-xl overflow-hidden mb-4 group">
                    <img
                      src={newPostPreview}
                      alt="Post preview"
                      className="w-full h-auto max-h-96 object-cover"
                    />
                    <button
                      onClick={() => {
                        setNewPostImage(null);
                        setNewPostPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-gray-900/80 hover:bg-gray-800/90 p-2 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <label className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/70 cursor-pointer transition-colors">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePostImageChange}
                      />
                    </label>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() && !newPostImage}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </motion.button>
                </div>
              </div>

              {/* Feed Posts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {feedPosts.length > 0 ? (
                    feedPosts.map((post) => (
                      <div key={post.id} className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 backdrop-blur-sm">
                        {/* Post Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                              <div className="w-full h-full rounded-full overflow-hidden">
                                <img
                                  src={users.find(u => u.id === post.userId)?.profileImage || "/placeholder.svg"}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div>
                              <p className="font-bold">{users.find(u => u.id === post.userId)?.name}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                          </button>
                        </div>

                        {/* Post Content */}
                        <p className="mb-4 text-gray-300">{post.content}</p>

                        {/* Post Image */}
                        {post.image && (
                          <div className="rounded-xl overflow-hidden mb-4 border border-gray-800">
                            <img
                              src={post.image}
                              alt="Post"
                              className="w-full h-auto max-h-96 object-cover"
                            />
                          </div>
                        )}

                        {/* Post Actions */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleLikePost(post.id)}
                              className="flex items-center space-x-1 text-gray-300 hover:text-pink-400 transition-colors"
                            >
                              <svg className="w-5 h-5" fill={post.likes > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span>{post.likes}</span>
                            </motion.button>
                            <button className="flex items-center space-x-1 text-gray-300 hover:text-purple-400 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span>{post.comments.length}</span>
                            </button>
                          </div>
                        </div>

                        {/* Comments Section */}
                        <div className="space-y-3">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex items-start space-x-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800">
                                <img
                                  src={users.find(u => u.id === comment.userId)?.profileImage || "/placeholder.svg"}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 bg-gray-800/50 rounded-xl p-3">
                                <div className="flex justify-between items-start">
                                  <p className="font-medium text-sm">
                                    {users.find(u => u.id === comment.userId)?.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
                              </div>
                            </div>
                          ))}

                          {/* Add Comment */}
                          <div className="flex items-center space-x-2 mt-4">
                            <div className="flex-1 bg-gray-800/50 rounded-full px-4 py-2">
                              <input
                                type="text"
                                value={commentContents[post.id] || ""}
                                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full bg-transparent border-none focus:ring-0 text-sm text-white placeholder-gray-400"
                                onKeyPress={(e) => e.key === 'Enter' && handleCreateComment(post.id)}
                              />
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleCreateComment(post.id)}
                              disabled={!commentContents[post.id]?.trim()}
                              className="p-2 bg-purple-600/50 hover:bg-purple-600/70 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-900/50 rounded-2xl p-8 text-center border border-gray-800 backdrop-blur-sm">
                      <div className="mx-auto w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-gray-300 mb-2">Your feed is empty</h3>
                      <p className="text-gray-500 mb-4">Follow musicians to see their posts here</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab("discover")}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-6 rounded-xl transition-all"
                      >
                        Discover Musicians
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Following Sidebar */}
                <div className="space-y-6">
                  <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white mb-4">Following</h2>
                    <div className="space-y-4">
                      {users
                        .filter((user) => following.includes(user.id))
                        .map((user) => (
                          <motion.div
                            key={user.id}
                            whileHover={{ x: 5 }}
                            className="flex items-center space-x-3 cursor-pointer group"
                            onClick={() => setViewingUser(user)}
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-1 group-hover:from-purple-600 group-hover:to-pink-600 transition-colors">
                              <div className="w-full h-full rounded-full overflow-hidden">
                                <img
                                  src={user.profileImage || "/placeholder.svg"}
                                  alt={user.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div>
                              <p className="font-bold group-hover:text-purple-400 transition-colors">{user.name}</p>
                              <p className="text-xs text-gray-400">{user.genre}</p>
                            </div>
                          </motion.div>
                        ))}
                      {following.length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-gray-500 mb-3">You're not following anyone yet</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab("discover")}
                            className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-1.5 px-4 rounded-lg transition-all"
                          >
                            Find Musicians
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trending Music */}
                  <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white mb-4">Trending Music</h2>
                    <div className="space-y-3">
                      {musicUploads.slice(0, 3).map((music) => (
                        <motion.div
                          key={music.id}
                          whileHover={{ translateX: 2 }}
                          className="flex items-center space-x-3 bg-gray-800/50 hover:bg-gray-800/70 rounded-xl p-3 border border-gray-700/50 cursor-pointer transition-colors"
                          onClick={() => handlePlayMusic(music)}
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700/50 flex-shrink-0">
                            <img
                              src={music.coverArt || "/placeholder.svg"}
                              alt={music.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{music.title}</p>
                            <p className="text-xs text-gray-400 truncate">
                              {users.find(u => u.id === music.userId)?.name}
                            </p>
                          </div>
                          <button className="p-1.5 bg-purple-600/20 hover:bg-purple-600/30 rounded-full text-purple-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="bg-gray-900/80 border-t border-gray-800 py-8 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">RhythmConnect</h3>
              <p className="text-gray-400 text-sm">
                Connecting musicians worldwide. Share your music, collaborate, and grow together.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Explore</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Featured Artists</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Top Genres</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">New Releases</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Upcoming Events</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Press</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Copyright</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} RhythmConnect. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm">Terms</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MusicianSocialApp;