import moment from 'moment';
import React from 'react';

import { stationList, getPlaylist } from '../api/PandoraClient';

function formatDuration(totalSeconds) {
  if (!totalSeconds || isNaN(totalSeconds)) {
    return '0:00';
  }

  var minutes = Math.round(totalSeconds / 60);
  var seconds = Math.round(totalSeconds % 60);
  var secondsPadded = seconds = (seconds < 10) ? '0' + seconds : seconds;

  return minutes + ':' + secondsPadded;
}

export default React.createClass({
  getInitialState() {
    return {
      activeSong: null,
      activeAudio: null,
      elapsed: 0,
      playlist: [],
      stations: []
    };
  },
  componentWillMount() {
    stationList().then((stations) => {
      this.setState({ stations: stations });
    });
  },
  _loadNextSong() {
    let currentIndex = this.state.playlist.indexOf(this.state.activeSong);
    let nextSong = this.state.playlist[currentIndex + 1];
    this._loadSong(nextSong);
  },
  _loadSong(song) {
    let activeAudio = new Audio(song.url);
    activeAudio.ontimeupdate = this._onTimeUpdate;
    activeAudio.onended = this._onSongEnd;

    this.setState({
      activeAudio: activeAudio,
      activeSong: song
    });
  },
  _onSongEnd() {
    this._loadNextSong();
    this._play();
  },
  _onSelectStation(token, e) {
    e.preventDefault();

    getPlaylist(token).then((playlist) => {
      this.state.playlist = playlist;
      this._loadSong(playlist[0]);
    });
  },
  _play() {
    this.state.activeAudio.play();
  },
  _pause() {
    this.state.activeAudio.pause();
  },
  _onTimeUpdate() {
    this.forceUpdate();
  },
  _renderStationList() {
    if (!this.state.stations.length) return;

    let stations = this.state.stations.map((station) => {
      return (
        <li key={station.id}>
          <a href="#" onClick={this._onSelectStation.bind(this, station.token)}>{station.name}</a>
        </li>
      );
    });

    return (<ul>{stations}</ul>);
  },
  _renderPlaylist() {
    if (!this.state.playlist.length) return;

    let songs = this.state.playlist.map((song) => {
      return (
        <li key={song.id}>
          <div className="song">
            <img src={song.album.imageUrl} height="50" width="50" />
            <p>Track: {song.name}</p>
            <p>Artist: {song.artist.name}</p>
            <p>Album: {song.album.name}</p>
          </div>
        </li>
      );
    });

    return (<ul>{songs}</ul>);
  },
  _renderAudioControls() {
    if (!this.state.activeAudio) return;

    var elapsed = this.state.activeAudio.currentTime || 0;
    var duration = this.state.activeAudio.duration || 0;

    return (
      <div>
        <span>{formatDuration(elapsed)}</span>
        <span>of</span>
        <span>{formatDuration(duration)}</span>
        <progress max={duration} value={elapsed}></progress>
        <button onClick={this._play}>Play</button>
        <button onClick={this._pause}>Pause</button>
      </div>
    );
  },
  render() {
    return (
      <div>
        <h2>Home Page</h2>
        {this._renderStationList()}
        {this._renderPlaylist()}
        {this._renderAudioControls()}
      </div>
    );
  }
});
