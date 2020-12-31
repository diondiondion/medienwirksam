import React, {useContext, useState} from 'react'
import {Link} from 'gatsby'
import styled, {css} from 'styled-components'
import {useMatch} from '@reach/router'
import {motion} from 'framer-motion'

import {getRgb} from '@utils/hexToRgb'
import friendlyList from '@utils/friendlyList'
import {getTrackLink} from '@utils/getLink'
import formatTime from '@utils/formatTime'
import useHasMounted from '@utils/useHasMounted'

import theme from '@style/theme'
import Slider from '@components/Slider'
import TextLink from '@components/TextLink'
import ThemeSection from '@components/ThemeSection'
import ClearButton from '@components/ClearButton'
import {
	PlayIcon,
	PauseIcon,
	SkipIcon,
	MoreIcon,
	MuteIcon,
	MutedIcon,
} from '@components/icons'
import {PlaylistContext} from '@components/PlaylistState'
import {CDN_ROOT_AUDIO, CDN_ROOT_IMAGE} from '@constants'

import {AudioPlayerContext} from './AudioPlayerContext'
import useMediaSession from './useMediaSession'

const VisuallyHidden = styled.span`
	position: absolute;
	overflow: hidden;
	width: 1px;
	height: 1px;
	padding: 0;
	clip: rect(0 0 0 0);
	border: 0;
`

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

	color: ${p => p.theme.highlight.color};
	background-color: ${p => p.theme.highlight.background};

	@media (min-width: ${theme.breakpoints.m}) {
		font-size: 18px;
	}

	.hideOnDesktop {
		@media (min-width: ${p => p.theme.breakpoints.m}) {
			display: none;
		}
	}

	.hideOnTablet {
		@media (max-width: ${p => p.theme.breakpoints.m}) {
			display: none;
		}
	}
`

const ThumbnailWrapper = styled.div`
	@media (max-width: ${p => p.theme.breakpoints.xs}) {
		display: none;
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
	@media (max-width: ${p => p.theme.breakpoints.xs}) {
		order: -1;
	}
	@media (min-width: ${p => p.theme.breakpoints.m}) {
		flex: 1 1 auto;
		text-align: center;
	}
`

const MobileDrawerButton = styled(ClearButton)`
	@media (min-width: ${p => p.theme.breakpoints.m}) {
		display: none;
	}
`
const MobileDrawerToggleArea = styled(TextLink)`
	position: absolute;
	top: -0.5rem;
	left: 0;
	right: 0;
	width: 100%;
	height: 1rem;

	@media (min-width: ${p => p.theme.breakpoints.m}) {
		display: none;
	}
`

const MobileDrawer = styled.div`
	position: relative;
	flex: 1 1 200px;

	@media (max-width: 800px) {
		position: absolute;
		bottom: 100%;
		left: 0;
		z-index: -1;

		display: flex;
		width: 100%;
		padding: 0.5rem;

		background-color: ${p => p.theme.highlight.background};

		${p =>
			!p.isOpen &&
			css`
				transform: translateY(calc(100% - 2px));
			`}
	}
`

const SongPositionWrapper = styled.div`
	position: relative;
	width: 100%;
`

const progressStyles = css`
	background-color: rgba(${p => getRgb(p.theme.highlight.color)}, 0.25);

	&::-webkit-progress-bar {
		background: rgba(${p => getRgb(p.theme.highlight.color)}, 0.25);
	}

	&::-moz-progress-bar {
		background: ${p => p.theme.highlight.color};
	}

	&::-webkit-progress-value {
		background: ${p => p.theme.highlight.color};
	}

	&::-ms-fill {
		background: ${p => p.theme.highlight.color};
	}
`

const SongPositionSlider = styled(Slider)`
	position: relative;
	z-index: 1;

	@media (max-width: 800px) {
		${p =>
			p.isHidden &&
			`
			display: none;
		`}
	}
`

const SongProgressBar = styled.progress`
	position: absolute;
	top: calc(50% - 3px);
	left: 0;
	width: 100%;
	height: 6px;
	z-index: 0;
	border: 0;

	@media (max-width: 800px) {
		${p =>
			!p.isCollapsed &&
			`
			top: -0.5rem;
			left: -0.5rem;
			width: calc(100% + 1rem);
			height: 2px;
		`}
	}

	${progressStyles}
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

const VolumeSliderWrapper = styled.div`
	position: relative;
`

const VolumeProgressBar = styled.progress`
	position: absolute;
	top: calc(50% - 3px);
	left: 0;
	width: 100%;
	height: 6px;
	z-index: -1;
	border: 0;

	${progressStyles}
`

function RewindButton(props) {
	return (
		<ClearButton
			aria-label="Zum Anfang oder zum vorherigen Track wechseln"
			{...props}
		>
			<SkipIcon style={{transform: 'rotate(180deg)'}} />
		</ClearButton>
	)
}

function SkipButton(props) {
	return (
		<ClearButton aria-label="Track überspringen" {...props}>
			<SkipIcon />
		</ClearButton>
	)
}

function MaybeLink({children, to, as: Component, ...otherProps}) {
	if (!to && !Component) {
		return children
	} else if (!to && Component) {
		return <Component>{children}</Component>
	}
	return (
		<TextLink as={Link} to={to} {...otherProps}>
			{children}
		</TextLink>
	)
}

function AudioPlayer() {
	const [isMobileDrawerOpen, setMobileDrawerOpenState] = useState(false)
	const {autoPlay, currentIndex} = useContext(PlaylistContext)
	const {audioRef, player} = useContext(AudioPlayerContext)
	const {currentTrack, playlist, goToNextTrack, goToPrevTrack} = useContext(
		PlaylistContext
	)
	const playlistColor = playlist?.color || theme.background
	const isUserOnCurrentPlaylist = Boolean(
		useMatch(playlist?.path || '/notMatching')
	)

	const src = currentTrack
		? `https://${CDN_ROOT_AUDIO}${currentTrack.filename}`
		: ''

	const imageSrc = playlist?.frontCover
		? `https://${CDN_ROOT_IMAGE}w_340/${playlist.frontCover}`
		: null

	useMediaSession({
		title: currentTrack?.title,
		artist: currentTrack?.artists,
		album: playlist?.title,
		artwork: imageSrc ? [{src: imageSrc, type: 'image/jpg'}] : undefined,
		nextTrack: goToNextTrack,
		previousTrack: goToPrevTrack,
	})

	function rewind() {
		if (player?.currentTime > 2) {
			player.seekTo(0)
		} else {
			goToPrevTrack()
		}
	}

	if (!useHasMounted() || !currentTrack) return null

	return (
		<ThemeSection color={playlistColor}>
			<Wrapper as={motion.div} initial={{y: '100%'}} animate={{y: 0}}>
				<audio
					ref={audioRef}
					src={src}
					autoPlay={autoPlay}
					preload="auto"
					onEnded={goToNextTrack}
				/>
				{playlist && imageSrc && (
					<ThumbnailWrapper>
						<MaybeLink to={isUserOnCurrentPlaylist ? null : playlist.path}>
							<img src={imageSrc} alt={playlist.title} width="56" height="56" />
						</MaybeLink>
					</ThumbnailWrapper>
				)}
				<TrackInfo>
					<VisuallyHidden>Aktueller Track:</VisuallyHidden>
					{currentTrack ? (
						<>
							<MaybeLink
								to={getTrackLink(currentTrack)}
								as="strong"
								state={{
									trackContext: {
										playlist,
										index: currentIndex,
									},
								}}
							>
								{currentTrack.title}
							</MaybeLink>
							<br />
							<VisuallyHidden>von</VisuallyHidden>
							{currentTrack.artistsAlias || friendlyList(currentTrack.artists)}
							{currentTrack.artistsFeat && (
								<> ft. {friendlyList(currentTrack.artistsFeat)}</>
							)}
						</>
					) : (
						<>Kein Track ausgewählt</>
					)}
				</TrackInfo>
				<ButtonSection>
					<RewindButton dimmed className="hideOnTablet" onClick={rewind} />
					<ClearButton
						smallPadding
						onClick={player.togglePlay}
						aria-label="Abspielen"
						aria-pressed={player.isPlaying}
					>
						{player.isPlaying ? <PauseIcon /> : <PlayIcon />}
					</ClearButton>
					<SkipButton dimmed className="hideOnTablet" onClick={goToNextTrack} />
				</ButtonSection>
				<ProgressReadout className="hideOnTablet">
					{formatTime(player.currentTime)}/{formatTime(player.duration)}
				</ProgressReadout>
				<MobileDrawerButton
					onClick={() => setMobileDrawerOpenState(!isMobileDrawerOpen)}
					aria-label="Mehr Optionen"
					aria-pressed={isMobileDrawerOpen}
					dimmed={!isMobileDrawerOpen}
				>
					<MoreIcon />
				</MobileDrawerButton>
				<MobileDrawerToggleArea
					as="button"
					type="button"
					onClick={() => setMobileDrawerOpenState(!isMobileDrawerOpen)}
					aria-hidden="true"
				/>
				<MobileDrawer isOpen={isMobileDrawerOpen}>
					{isMobileDrawerOpen && (
						<RewindButton
							aria-hidden="true"
							className="hideOnDesktop"
							onClick={rewind}
						/>
					)}
					<SongPositionWrapper>
						<SongProgressBar
							isCollapsed={isMobileDrawerOpen}
							value={player.currentTime}
							min="0"
							max={player.duration}
							aria-label="Spielfortschritt"
						/>
						<SongPositionSlider
							isHidden={!isMobileDrawerOpen}
							withTrack={false}
							color={playlistColor}
							value={player.currentTime}
							min="0"
							max={player.duration}
							onChange={e => player.seekTo(e.target.value)}
							aria-label="Spielfortschritt ändern"
						/>
					</SongPositionWrapper>
					{isMobileDrawerOpen && (
						<SkipButton
							aria-hidden="true"
							className="hideOnDesktop"
							onClick={goToNextTrack}
						/>
					)}
				</MobileDrawer>
				<VolumeSection className="hideOnTablet">
					<ClearButton onClick={player.toggleMute} aria-label="Stumm schalten">
						{player.isMuted ? <MutedIcon /> : <MuteIcon />}
					</ClearButton>
					<VolumeSliderWrapper>
						<VolumeProgressBar
							value={player.volume}
							min="0"
							max="1"
							aria-label="Lautstärke"
						/>
						<Slider
							color={playlistColor}
							value={player.volume}
							min="0"
							max="1"
							step="0.05"
							onChange={e => player.setVolume(e.target.value)}
							style={{width: '100px'}}
							aria-label="Lautstärke ändern"
						/>
					</VolumeSliderWrapper>
				</VolumeSection>
			</Wrapper>
		</ThemeSection>
	)
}

export default AudioPlayer
