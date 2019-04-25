import React, {useContext, useRef} from 'react'
import styled from 'styled-components'
import invert from 'invert-color'

import useSiteMetaData from '@utils/useSiteMetaData'
import formatTime from '@utils/formatTime'
import theme from '@style/theme'
import {TrackContext} from '@components/AppWrapper'
import Slider from '@components/Slider'
import ClearButton from '@components/ClearButton'
import {
	PlayIcon,
	PauseIcon,
	SkipIcon,
	MuteIcon,
	MutedIcon,
} from '@components/icons'

import useAudioPlayer from './useAudioPlayer'

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;

	color: ${p => invert(p.highlightColor, true)};
	background-color: ${p => p.highlightColor};

	font-size: ${p => p.theme.typeScale.s}px;
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
			<div>
				<ClearButton dimmed onClick={goToPrevTrack}>
					<SkipIcon style={{transform: 'rotate(180deg)'}} />
				</ClearButton>
				<ClearButton onClick={player.togglePlay}>
					{player.isPlaying ? <PauseIcon /> : <PlayIcon />}
				</ClearButton>
				<ClearButton dimmed onClick={goToNextTrack}>
					<SkipIcon />
				</ClearButton>
			</div>
			<p>
				{formatTime(player.currentTime)}/{formatTime(player.duration)}
			</p>
			<Slider
				color={playlistColor}
				value={player.currentTime}
				min="0"
				max={player.duration}
				onChange={e => player.seekTo(e.target.value)}
				style={{width: '200px'}}
			/>
			<ClearButton onClick={player.toggleMute}>
				{player.isMuted ? <MutedIcon /> : <MuteIcon />}
			</ClearButton>
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
