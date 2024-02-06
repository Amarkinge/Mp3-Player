import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import './AudioList.css'

const AudioList = ({ list, onClickPlay, currentTrackIndex }) => {
    return (
        <div>
            <table className="responsive-table">
                <tbody>
                    {list.length < 1 ? <tr><td colSpan={2}><Spinner animation="border"></Spinner></td></tr>
                        : list.map((track, index) => (
                            <tr key={index} className="playlist-item responsive-table">
                                {index === currentTrackIndex
                                    ? <td>🎵 <strong>{track.name.toString()}</strong></td>
                                    : <td>{track.name}</td>}
                                <td><button className='btn btn-outline-light' onClick={() => onClickPlay(index)}>▶️</button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default AudioList;
