import React from 'react';

import { stationList, getPlaylist } from '../api/PandoraClient';

export default class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSong: null,
      history: [],
      playlist: [],
      stations: []
    };
  }
  componentWillMount() {
    stationList().then((stations) => {
      this.setState({ stations: stations });
    });
  }
  componentWillUpdate() {
    // if (this.refs.controls) {
    //   this.refs.controls.getDOMNode().removeEventListener("ended");
    // }
  }
  componentDidUpdate() {
    // if (this.refs.controls) {
    //   this.refs.controls.getDOMNode().addEventListener("ended", this._onSongEnd);
    // }
  }
  _onSongEnd(e) {
    console.log(ended);
    let currentIndex = this.state.playlist.indexOf(this.state.activeSong);

    this.setState({
      activeSong: this.state.playlist[currentIndex + 1],
      history: history.concat(this.state.activeSong)
    });
  }
  _onSelectStation(token, e) {
    e.preventDefault();

    getPlaylist(token).then((playlist) => {
      this.setState({
        activeSong: playlist[0],
        playlist: playlist
      });
    });
  }
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
  }
  _renderPlaylist() {
    if (!this.state.playlist.length) return;

    let songs = this.state.playlist.map((song) => {
      return (
        <li key={song.id}>
          <div className="song">
            <img src={song.album.imageUrl} />
            <p>Track: {song.name}</p>
            <p>Artist: {song.artist.name}</p>
            <p>Album: {song.album.name}</p>
          </div>
        </li>
      );
    });

    return (<ul>{songs}</ul>);
  }
  _renderAudioControls() {
    if (!this.state.activeSong) return;

    return (
      <audio controls ref="controls" onEnded={this._onSongEnd.bind(this)}>
        <source src={this.state.activeSong.url} type="audio/mpeg" />
      </audio>
    );
  }
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
}
