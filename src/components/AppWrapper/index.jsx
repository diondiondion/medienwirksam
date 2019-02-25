import React, {useState} from 'react'
import {Persist} from 'react-persist'

import useSiteMetaData from './useSiteMetaData'

export const TrackContext = React.createContext()

function AppWrapper({children}) {
	const {audioCdnRoot} = useSiteMetaData()
	const [playlist, setPlaylist] = useState(undefined)
	const [trackIndex, setTrackIndex] = useState(0)
	const currentTrack = playlist ? playlist.tracks[trackIndex] : undefined

	function goToNextTrack() {
		setTrackIndex((trackIndex + 1) % playlist.tracks.length)
	}

	function goToPrevTrack() {
		setTrackIndex(
			trackIndex !== 0 ? trackIndex - 1 : playlist.tracks.length - 1
		)
	}

	function changeTrack(playlistData, newTrackIndex) {
		setTrackIndex(newTrackIndex)
		setPlaylist(playlistData)
	}

	return (
		<>
			{currentTrack && (
				<div>
					<audio
						controls
						src={`https://${audioCdnRoot}${currentTrack.filename}`}
						onEnded={goToNextTrack}
					/>
					<button onClick={goToPrevTrack}>&laquo;</button>({currentTrack.title}{' '}
					from '{playlist.title}')
					<button onClick={goToNextTrack}>&raquo;</button>
				</div>
			)}
			{!currentTrack && <>Please select a track</>}
			<TrackContext.Provider
				value={{
					currentTrack,
					playlist,
					changeTrack,
				}}
			>
				{children}
			</TrackContext.Provider>
			<Persist
				name="playlistState"
				data={{
					playlist,
					trackIndex,
				}}
				debounce={500}
				onMount={data => {
					setPlaylist(data.playlist)
					setTrackIndex(data.trackIndex)
				}}
			/>
		</>
	)
}

export default AppWrapper
