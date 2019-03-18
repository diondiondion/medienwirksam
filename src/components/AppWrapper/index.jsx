import React, {useState} from 'react'
import {Persist} from 'react-persist'
import {ThemeProvider} from 'styled-components'
import theme from '@style/theme'

import AudioPlayer from '@components/AudioPlayer'

export const TrackContext = React.createContext()

function AppWrapper({children}) {
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
			<ThemeProvider theme={theme}>
				<TrackContext.Provider
					value={{
						currentTrack,
						playlist,
						changeTrack,
						goToNextTrack,
						goToPrevTrack,
					}}
				>
					<AudioPlayer />
					{children}
				</TrackContext.Provider>
			</ThemeProvider>
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
