import {useEffect} from 'react'

function useMediaSession({
	title,
	artist,
	album,
	artwork,
	nextTrack,
	previousTrack,
}) {
	useEffect(() => {
		if ('mediaSession' in navigator) {
			/* eslint-disable-next-line no-undef */
			navigator.mediaSession.metadata = new MediaMetadata({
				title,
				artist,
				album,
				artwork,
			})
			navigator.mediaSession.setActionHandler('nexttrack', nextTrack)
			navigator.mediaSession.setActionHandler('previoustrack', previousTrack)
		}
	}, [title, artist, album, artwork, nextTrack, previousTrack])
}

export default useMediaSession
