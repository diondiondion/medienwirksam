import React, {useContext, useRef, useEffect, useMemo} from 'react'
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
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 100;

	display: flex;
	align-items: center;
	justify-content: stretch;
	flex-wrap: wrap;

	padding: 0 0.5rem;

	color: ${p => invert(p.highlightColor, true)};
	background-color: ${p => p.highlightColor};

	& > :not(:first-child) {
		margin-left: 0.5rem;
	}

	@media (min-width: ${theme.breakpoints.m}) {
		font-size: 18px;
	}
`

const TrackInfo = styled.div`
	flex: 1 1 200px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`

const VolumeSection = styled.div`
	display: flex;
	align-items: center;

	@media (max-width: 800px) {
		display: none;
	}
`

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
			navigator.mediaSession.metadata = new MediaMetadata({
				title,
				artist,
				album,
				artwork,
			})
			navigator.mediaSession.setActionHandler('nexttrack', nextTrack)
			navigator.mediaSession.setActionHandler('previoustrack', previousTrack)
		}

		return function cleanUp() {
			if ('mediaSession' in navigator) {
				navigator.mediaSession.setActionHandler('nexttrack', null)
				navigator.mediaSession.setActionHandler('previoustrack', null)
			}
		}
	}, [title, artist, album, artwork, nextTrack, previousTrack])
}

function AudioPlayer({autoPlay}) {
	const audioRef = useRef(null)
	const player = useAudioPlayer(audioRef)
	const {audioCdnRoot, imageCdnRoot} = useSiteMetaData()
	const {currentTrack, goToNextTrack, goToPrevTrack, playlist} = useContext(
		TrackContext
	)
	const playlistColor = playlist ? playlist.color : theme.background
	const src = currentTrack
		? `https://${audioCdnRoot}${currentTrack.filename}`
		: ''

	const imageSrc =
		playlist && playlist.frontCover
			? `https://${imageCdnRoot}${playlist.frontCover}`
			: null

	useMediaSession(
		useMemo(
			() => ({
				title: currentTrack && currentTrack.title,
				artist: currentTrack && currentTrack.artists,
				album: playlist && playlist.title,
				artwork: [{src: imageSrc, sizes: '128x128', type: 'image/jpg'}],
				skip: goToNextTrack,
				prev: goToPrevTrack,
			}),
			[currentTrack, playlist, imageSrc, goToNextTrack, goToPrevTrack]
		)
	)

	return (
		<Wrapper highlightColor={playlistColor}>
			<img src={imageSrc} alt="" width="56" height="56" />
			<audio
				ref={audioRef}
				src={src}
				autoPlay={autoPlay}
				preload="auto"
				onEnded={goToNextTrack}
			/>
			<TrackInfo>
				{currentTrack ? (
					<>
						<strong>{currentTrack.title}</strong>
						<br />
						{currentTrack.artists}
					</>
				) : (
					<>Kein Track ausgewählt</>
				)}
			</TrackInfo>
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
				style={{flex: '1 1 200px'}}
			/>
			<VolumeSection>
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
			</VolumeSection>
		</Wrapper>
	)
}

export default AudioPlayer
