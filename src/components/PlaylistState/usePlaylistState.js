import {useState} from 'react'
import {useStorageState} from 'react-storage-hooks'

function useLocalStorageState(...args) {
	return useStorageState(localStorage, ...args)
}

function usePlaylistState() {
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

	return {
		currentIndex: trackIndex,
		currentTrack,
		playlist,
		changeTrack,
		goToNextTrack,
		goToPrevTrack,
		autoPlay,
	}
}

export default usePlaylistState
