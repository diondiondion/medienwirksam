import React, {Component} from 'react'
import {StaticQuery, graphql} from 'gatsby'
import {Persist} from 'react-persist'

export const TrackContext = React.createContext()

class AppWrapper extends Component {
	state = {
		currentPlaylist: undefined,
		currentTrackIndex: undefined,
	}

	changeTrack = (playlistData, newTrackIndex) => {
		this.setState({
			currentTrackIndex: newTrackIndex,
			currentPlaylist: playlistData,
		})
	}

	goToNextTrack = () => {
		const {currentTrackIndex, currentPlaylist} = this.state
		const isLastTrack = currentTrackIndex === currentPlaylist.tracks.length - 1

		this.setState({
			currentTrackIndex: isLastTrack ? 0 : currentTrackIndex + 1,
		})
	}

	goToPrevTrack = () => {
		const {currentTrackIndex, currentPlaylist} = this.state
		const isFirstTrack = currentTrackIndex === 0
		const lastTrackIndex = currentPlaylist.tracks.length - 1

		this.setState({
			currentTrackIndex: isFirstTrack ? lastTrackIndex : currentTrackIndex - 1,
		})
	}

	render() {
		const {children} = this.props
		const {currentTrackIndex, currentPlaylist} = this.state

		let currentTrack
		if (currentPlaylist) {
			currentTrack = currentPlaylist.tracks[currentTrackIndex]
		}

		return (
			<>
				<StaticQuery
					query={graphql`
						query {
							site {
								siteMetadata {
									audioCdnRoot
								}
							}
						}
					`}
					render={data => {
						const {audioCdnRoot} = data.site.siteMetadata
						return (
							<>
								{currentTrack && (
									<>
										<audio
											controls
											src={`https://${audioCdnRoot}${currentTrack.filename}`}
											onEnded={this.goToNextTrack}
										/>
										<button onClick={this.goToPrevTrack}>&laquo;</button>(
										{currentTrack.title} from '{currentPlaylist.title}')
										<button onClick={this.goToNextTrack}>&raquo;</button>
									</>
								)}
								{!currentTrack && <>Please select a track</>}
							</>
						)
					}}
				/>
				<TrackContext.Provider
					value={{
						currentTrack,
						currentPlaylist,
						changeTrack: this.changeTrack,
					}}
				>
					{children}
				</TrackContext.Provider>
				<Persist
					name="playlistState"
					data={this.state}
					debounce={500}
					onMount={data => this.setState(data)}
				/>
			</>
		)
	}
}

export default AppWrapper
