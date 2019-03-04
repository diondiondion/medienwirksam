import React, {useContext} from 'react'

import useSiteMetaData from '@utils/useSiteMetaData'
import {TrackContext} from '@components/AppWrapper'

function AudioPlayer() {
	const {audioCdnRoot} = useSiteMetaData()
	const {currentTrack, goToNextTrack, goToPrevTrack, playlist} = useContext(
		TrackContext
	)

	if (!currentTrack) return 'No track selected'

	return (
		<div>
			<audio
				controls
				src={`https://${audioCdnRoot}${currentTrack.filename}`}
				onEnded={goToNextTrack}
			/>
			<button onClick={goToPrevTrack}>&laquo;</button>({currentTrack.title} from
			&quot;{playlist.title}&quot;)
			<button onClick={goToNextTrack}>&raquo;</button>
		</div>
	)
}

export default AudioPlayer
