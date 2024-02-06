import React, { useEffect, useState } from 'react';
//import ReactAudioPlayer from 'react-audio-player';
import './AudioPlayer.css'
import { Button } from 'react-bootstrap';
import AudioList from './AudioList';

const AudioPlayer = () => {
    const [audioSrc, setAudioSrc] = useState('');
    const [playlist, setPlaylist] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    let audioPlayerElement = document.getElementById("audioPlayer");


    useEffect(() => {
        const storedPlaylist = JSON.parse(localStorage.getItem('audioPlaylist')) || [];
        const lastPlayedTrackIndex = parseInt(localStorage.getItem('lastPlayedTrackIndex'), 10) || 0;
        setCurrentTrackIndex(lastPlayedTrackIndex);
        setPlaylist(storedPlaylist);
    }, []);

    const handleFileChange = (event) => {
        const files = event.target.files;

        if (files && files.length > 0) {
            setLoading(true);

            const newPlaylist = Array.from(files).map((f) => {
                if (!f.type.startsWith("audio/")) {
                    alert(`You can only upload up to audio files.`);
                    return [];
                }
                var audioName = f.name.toString();
                var url = URL.createObjectURL(f);
                var audioFile = { name: audioName.toString(), src: url };

                return audioFile;
            });

            const updatedPlaylist = [...playlist, ...newPlaylist];
            setIsPlaying(true);
            setCurrentTime(0);
            setPlaylist(updatedPlaylist);
            setAudioSrc(updatedPlaylist[currentTrackIndex].src);
            localStorage.setItem("audioPlaylist", JSON.stringify([...updatedPlaylist]));
            setLoading(false);
        }
    };

    const saveToLocalStorage = () => {
        localStorage.setItem('lastPlayedTrackIndex', currentTrackIndex.toString());
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    const handlePlayPause = () => {
        if (isPlaying) {
            audioPlayerElement.pause();
            let time = Number(audioPlayerElement.currentTime);
            setCurrentTime(time);
            setCurrentTrackIndex(currentTrackIndex);
            setAudioSrc(audioPlayerElement.currentSrc);
        } else {
            audioPlayerElement.currentTime = currentTime.toString();
            audioPlayerElement.play();
        }
        setIsPlaying(!isPlaying);
        saveToLocalStorage();
    };

    const playNext = () => {
        if (playlist.length > 1 && currentTrackIndex < playlist.length - 1) {
            const nextIndex = (currentTrackIndex + 1) % playlist.length;
            setCurrentTrackIndex(nextIndex);
            setIsPlaying(true);
            setAudioSrc(playlist[nextIndex].src);
            saveToLocalStorage();
            audioPlayerElement.play();
        }
    };

    const playPrevious = () => {
        if (playlist.length > 0 && currentTrackIndex !== 0) {
            const prevTrackIndex = (currentTrackIndex - 1) % playlist.length;
            setCurrentTrackIndex(prevTrackIndex);
            setIsPlaying(true);
            setAudioSrc(playlist[prevTrackIndex].src);
            saveToLocalStorage();
            audioPlayerElement.play();
        }
    };

    const handlePlay = (index) => {
        setCurrentTrackIndex(index);
        setAudioSrc(playlist[index].src);
        setIsPlaying(true);
        audioPlayerElement.play();
        saveToLocalStorage();
    };

    const decreaseVolume = () => {
        let volValue = Number(audioPlayerElement.volume);
        if (volValue > 0.0) {
            audioPlayerElement.volume = (volValue - 0.1).toFixed(1);
            setVolume(volValue);
        } else {
            audioPlayerElement.volume = "0.0"
            setVolume(volValue);
        }
    };

    const halfVolume = () => {
        audioPlayerElement.volume = (0.5).toFixed(1);
        setVolume(0.5);
    }

    const increaseVolume = () => {
        let volValue = Number(audioPlayerElement.volume);
        if (volValue < 1.0) {
            audioPlayerElement.volume = (volValue + 0.1).toFixed(1);
            setVolume(volValue);
        } else {
            audioPlayerElement.volume = "1.0"
            setVolume(volValue);
        }
    };

    const handleVolumeChange = (e) => {
        const value = parseFloat(e.target.value);
        setVolume(value);
        audioPlayerElement.volume = value;
    };

    const handleSeek = (e) => {
        const value = parseFloat(e.target.value);
        audioPlayerElement.currentTime = value;
        setCurrentTime(value);
    };

    const handleSeeking = (event) => {
        setCurrentTime(parseFloat(event.target.currentTime));
    };

    const handleVolumeChanging = (event) => {
        setVolume(parseFloat(event.target.volume));
    };

    const handleTimeUpdate = (time) => {
        setCurrentTime(parseFloat(time.target.currentTime));
        setDuration(audioPlayerElement.duration)
    };
    const handleLoadedData = () => {
        setDuration(audioPlayerElement.duration);
    };

    const muteOrUnmuteAction = () => {
        if (isMuted === true) {
            audioPlayerElement.muted = false;
            setIsMuted(false);
        } else {
            audioPlayerElement.muted = true;
            setIsMuted(true);
        }
    }
    return (
        <div>
            <section>
                <label htmlFor="upload">📁</label>
                <input type="file" id='upload' accept="audio/*" onChange={handleFileChange} className="file-input" multiple />
                <hr></hr>
                <div className='row'>
                    <div className='player'>
                        {
                            playlist.length > 0 &&
                            (
                                <div>
                                    <h2 className="now-playing-heading"><b>Now Playing:</b> {loading ? '' : playlist[currentTrackIndex]?.name}</h2>
                                    <audio
                                        id='audioPlayer'
                                        src={audioSrc}
                                        autoPlay={isPlaying}
                                        onEnded={playNext}
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        className='audio-player'
                                        onSeeking={(e) => handleSeeking(e)}
                                        onVolumeChange={(e) => handleVolumeChanging(e)}
                                        onTimeUpdate={(e) => handleTimeUpdate(e)}
                                        onLoadedData={handleLoadedData}
                                        muted={isMuted}
                                    >
                                    </audio>
                                    <br></br>
                                    <div className='controls'>
                                        {
                                            isPlaying
                                                ? <Button onClick={handlePlayPause} title='Stop/Pause' variant="primary-outline">⏸️</Button>
                                                : <Button onClick={handlePlayPause} title='Play/Resume' variant="primary-outline">▶️</Button>
                                        }
                                       <div><span>{formatTime(currentTime)}: </span></div>
                                        <input
                                            type="range"
                                            min="0"
                                            max={duration}
                                            value={currentTime}
                                            onChange={handleSeek}
                                            style={{ width: '50%' }}
                                        />
                                        <div><span>{formatTime(duration)}</span></div>
                                        <Button onClick={playPrevious} title='Play Previous' variant="primary-outline">⏮️</Button>
                                        <Button onClick={playNext} title='Play Next' variant="primary-outline">⏭️</Button>
                                        <br></br>
                                        {
                                            isMuted
                                                ? <Button 
                                                onClick={muteOrUnmuteAction} 
                                                title='Mute' variant="primary-outline">🔇</Button>
                                                : <Button 
                                                onClick={muteOrUnmuteAction} 
                                                title='Unmute' 
                                                variant="primary-outline"
                                               
                                                >🔈</Button>
                                        }
                                        <input
                                            id='volumeControl'
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={volume}
                                            onChange={handleVolumeChange}
                                            style={{ width: '30%' }}
                                        />
                                        <Button 
                                        onClick={decreaseVolume} 
                                        title='Volume-' 
                                        variant="primary-outline">🔈</Button>{' '}
                                        <Button onClick={halfVolume} title='Half Volume' variant="primary-outline">🔉</Button>{' '}
                                        <Button onClick={increaseVolume} title='Volume+' variant="primary-outline">🔊</Button>
                                    </div>
                                    <br></br>
                                </div>
                            )
                        }
                    </div>
                    <h2 className="playlist-heading">Playlist</h2>
                    {
                        playlist.length > 0 && (
                            <div className="table-container">
                                <AudioList list={playlist} onClickPlay={handlePlay} currentTrackIndex={currentTrackIndex}></AudioList>
                            </div>
                        )
                    }
                </div>
            </section>
        </div>
    );
};

export default AudioPlayer;
