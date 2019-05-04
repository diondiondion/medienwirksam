import React, {useContext, useRef, useEffect} from 'react'
import {Link} from 'gatsby'
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

	padding: 0.5rem;

	color: ${p => invert(p.highlightColor, true)};
	background-color: ${p => p.highlightColor};

	@media (min-width: ${theme.breakpoints.m}) {
		font-size: 18px;
	}

	.hideOnMobile {
		@media (max-width: 540px) {
			display: none;
		}
	}

	.hideOnTablet {
		@media (max-width: 800px) {
			display: none;
		}
	}
`

const TrackInfo = styled.div`
	flex: 1 1 160px;
	margin-left: 0.5rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`

const ButtonSection = styled.div`
	@media (min-width: 800px) {
		flex: 1 1 auto;
		text-align: center;
	}
`

const ProgressReadout = styled.div`
	padding: 0 1rem;
`

const VolumeSection = styled.div`
	display: flex;
	align-items: center;
	padding-left: 1rem;

	@media (max-width: 960px) {
		display: none;
	}
`

function AudioPlayer({autoPlay}) {
	const audioRef = useRef(null)
	const player = useAudioPlayer(audioRef)
	const {audioCdnRoot, imageCdnRoot} = useSiteMetaData()
	const {currentTrack, playlist, goToNextTrack, goToPrevTrack} = useContext(
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

	useEffect(() => {
		if ('mediaSession' in navigator) {
			/* eslint-disable-next-line no-undef */
			navigator.mediaSession.metadata = new MediaMetadata({
				title: currentTrack && currentTrack.title,
				artist: currentTrack && currentTrack.artists,
				album: playlist && playlist.title,
				artwork: [{src: imageSrc, type: 'image/jpg'}],
			})
			navigator.mediaSession.setActionHandler('nexttrack', goToNextTrack)
			navigator.mediaSession.setActionHandler('previoustrack', goToPrevTrack)
		}
	}, [currentTrack, playlist, imageSrc, goToNextTrack, goToPrevTrack])

	return (
		<Wrapper highlightColor={playlistColor}>
			{playlist && (
				<Link to={playlist ? `/playlist${playlist.slug}` : null}>
					<img src={imageSrc} alt="" width="56" height="56" />
				</Link>
			)}
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
			<ButtonSection>
				<ClearButton dimmed className="hideOnMobile" onClick={goToPrevTrack}>
					<SkipIcon style={{transform: 'rotate(180deg)'}} />
				</ClearButton>
				<ClearButton smallPadding onClick={player.togglePlay}>
					{player.isPlaying ? <PauseIcon /> : <PlayIcon />}
				</ClearButton>
				<ClearButton dimmed className="hideOnMobile" onClick={goToNextTrack}>
					<SkipIcon />
				</ClearButton>
			</ButtonSection>
			<ProgressReadout className="hideOnTablet">
				{formatTime(player.currentTime)}/{formatTime(player.duration)}
			</ProgressReadout>
			<Slider
				color={playlistColor}
				value={player.currentTime}
				min="0"
				max={player.duration}
				onChange={e => player.seekTo(e.target.value)}
				style={{flex: '1 1 200px'}}
				className="hideOnTablet"
			/>
			<VolumeSection className="hideOnTablet">
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
