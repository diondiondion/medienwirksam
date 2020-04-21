import React, {useState} from 'react'
import {Flipper} from 'react-flip-toolkit'
import {useStorageState} from 'react-storage-hooks'
import {Location} from '@reach/router'
import {ThemeProvider} from 'styled-components'
import theme from '@style/theme'

import AudioPlayer from '@components/AudioPlayer'
import {BackLinkProvider} from '@components/BackLink/useBackLink'

function useLocalStorageState(...args) {
	return useStorageState(localStorage, ...args)
}

export const TrackContext = React.createContext()

function AppWrapper({children}) {
	const [playlist, setPlaylist] = useLocalStorageState(
		'medienwirksam-current-playlist',
		undefined
	)
	const [trackIndex, setTrackIndex] = useLocalStorageState(
		'medienwirksam-current-track-index',
		0
	)
	const [autoPlay, setAutoPlay] = useState(false)
	const currentTrack = playlist ? playlist.tracks[trackIndex] : undefined

	function goToNextTrack() {
		setAutoPlay(true)
		setTrackIndex((trackIndex + 1) % playlist.tracks.length)
	}

	function goToPrevTrack() {
		setAutoPlay(true)
		setTrackIndex(
			trackIndex !== 0 ? trackIndex - 1 : playlist.tracks.length - 1
		)
	}

	function changeTrack(playlistData, newTrackIndex) {
		setAutoPlay(true)
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
					<Location>
						{({location}) => (
							<BackLinkProvider pathname={location.pathname}>
								<Flipper
									flipKey={location.key}
									staggerConfig={{
										default: {
											speed: 0.5,
										},
										reverse: {
											reverse: true,
											speed: 0.5,
										},
									}}
								>
									{children}
								</Flipper>
							</BackLinkProvider>
						)}
					</Location>
					<AudioPlayer autoPlay={autoPlay} />
				</TrackContext.Provider>
			</ThemeProvider>
		</>
	)
}

export default AppWrapper
