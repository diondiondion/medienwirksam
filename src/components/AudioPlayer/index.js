import React, {useContext, useRef} from 'react'
import styled from 'styled-components'
import invert from 'invert-color'

import useSiteMetaData from '@utils/useSiteMetaData'
import formatTime from '@utils/formatTime'
import theme from '@style/theme'
import {TrackContext} from '@components/AppWrapper'
import Slider from '@components/Slider'

import useAudioPlayer from './useAudioPlayer'

const Wrapper = styled.div`
	display: flex;

	color: ${p => invert(p.highlightColor, true)};
	background-color: ${p => p.highlightColor};

	font-size: ${p => p.theme.typeScale.s}px;

	& > * + * {
		margin-left: 1em;
	}
`

function AudioPlayer() {
	const audioRef = useRef(null)
	const player = useAudioPlayer(audioRef)
	const {audioCdnRoot} = useSiteMetaData()
	const {currentTrack, goToNextTrack, goToPrevTrack, playlist} = useContext(
		TrackContext
	)
	const playlistColor = playlist ? playlist.color : theme.background
	const src = currentTrack
		? `https://${audioCdnRoot}${currentTrack.filename}`
		: ''

	return (
		<Wrapper highlightColor={playlistColor}>
			{currentTrack && (
				<div>
					<strong>{currentTrack.title}</strong>
					<br />
					{currentTrack.artists}
				</div>
			)}
			<audio ref={audioRef} src={src} preload="auto" onEnded={goToNextTrack} />
			<button onClick={goToPrevTrack}>&laquo;</button>
			<button type="button" onClick={player.togglePlay}>
				{player.isPlaying ? 'Pause' : 'Play'}
			</button>
			<button onClick={goToNextTrack}>&raquo;</button>
			<p>
				{formatTime(player.currentTime)}/{formatTime(player.duration)}
			</p>
			<Slider
				color={playlistColor}
				value={player.currentTime}
				min="0"
				max={player.duration}
				onChange={e => player.seekTo(e.target.value)}
			/>
			<button type="button" onClick={player.toggleMute}>
				{player.isMuted ? 'Unmute' : 'Mute'}
			</button>
			<Slider
				color={playlistColor}
				value={player.volume}
				min="0"
				max="1"
				step="0.05"
				onChange={e => player.setVolume(e.target.value)}
				style={{width: '100px'}}
			/>
		</Wrapper>
	)
}

export default AudioPlayer
