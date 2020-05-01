import React, {useContext, useRef} from 'react'
import styled from 'styled-components'
import {graphql} from 'gatsby'

import {getTrackLink} from '@utils/getLink'
import friendlyList from '@utils/friendlyList'
import Layout from '@components/Layout'
import Heading from '@components/Heading'
import Panel from '@components/Panel'
import Stack from '@components/Stack'
import TextLink from '@components/TextLink'
import ClearButton from '@components/ClearButton'
import {
	BeatIcon,
	MicIcon,
	DownloadIcon,
	PlayIcon,
	PauseIcon,
} from '@components/icons'
import {PlaylistContext} from '@components/PlaylistState'
import {AudioPlayerContext} from '@components/AudioPlayer/AudioPlayerContext'

const WaveformContainer = styled.div`
	position: relative;
	padding-bottom: ${p => p.theme.spacing.m};
`

const Waveform = styled.img`
	display: block;
	width: 100%;
`

const WaveformShade = styled.div.attrs(p => ({
	style: {
		transform: `scaleX(${p.scale || 1})`,
	},
}))`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;

	background-color: ${p => p.theme.background};
	opacity: 0.666;
	transform-origin: top right;

	pointer-events: none;
`

const BigPlayButton = styled(ClearButton)`
	transform: rotate(-1.5deg);

	@media (max-width: ${p => p.theme.breakpoints.s}) {
		margin-left: -${p => p.theme.spacing.l};
	}
`

const PlaybackIcon = styled(PlayIcon)`
	font-size: 30px;

	@media (min-width: ${p => p.theme.breakpoints.m}) {
		font-size: 45px;
	}
`

const Content = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	padding: ${p => p.theme.spacing.m};
`

const SongDetails = styled.div`
	flex-grow: 1;
	flex-shrink: 1;
	margin: 0 ${p => p.theme.spacing.s};

	@media (min-width: ${p => p.theme.breakpoints.m}) {
		margin: 0 ${p => p.theme.spacing.m};
	}
`

const Features = styled.span`
	opacity: 0.7;
`

const Topline = styled.p`
	line-height: 0.9;
	margin-bottom: ${p => p.theme.spacing.xxs};
`

const Subtitle = styled.p`
	margin-top: ${p => p.theme.spacing.xxs};
	font-size: ${p => p.theme.typeScale.xs};
`

const DownloadLink = styled(TextLink).attrs({download: true})`
	align-self: flex-start;
	white-space: nowrap;

	& span {
		@media (max-width: ${p => p.theme.breakpoints.s}) {
			display: none;
		}
	}
`

function getRandomColor() {
	const letters = '0123456789ABCDEF'
	let color = '#'
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

function removeHash(hex) {
	return hex.slice(1)
}

function getWaveformShadeScale(duration, currentTime) {
	return 1 - duration / currentTime
}

function getImageLinkFromMp3Link(filename) {
	const [nameWithoutExt] = filename.split('.')

	return `${nameWithoutExt}.png`
}

const waveformWidth = 800
const wavformHeight = 120

function getSingleTrackPlaylist(track, color) {
	return {
		slug: track.fields.slug,
		title: `${track.title} von ${friendlyList(track.artists)}`,
		artist: track.artists,
		color,
		tracks: [track],
		path: getTrackLink(track),
	}
}

function Artist({data, location}) {
	const {track, site} = data
	const {title, artists, artistsAlias, artistsFeat, producers, filename} = track
	const {audioCdnRoot} = site.siteMetadata
	const {state: locState} = location
	const trackContext = locState?.trackContext
	const {player} = useContext(AudioPlayerContext)
	const randomColor = useRef(getRandomColor())

	const trackColor = trackContext?.playlist.color || randomColor.current
	const imageFilename = getImageLinkFromMp3Link(filename)
	const imageUrl = `https://${audioCdnRoot}q_auto,h_${wavformHeight},w_${waveformWidth},fl_waveform,co_rgb:${removeHash(
		trackColor
	)},b_transparent/${imageFilename}`
	const mp3Link = `https://${audioCdnRoot}${filename}`

	const artistsList = artistsAlias || friendlyList(artists)
	const featureList = artistsFeat ? ` ft. ${friendlyList(artistsFeat)}` : ''

	const {currentTrack, changeTrack} = useContext(PlaylistContext)
	const playlist =
		trackContext?.playlist || getSingleTrackPlaylist(track, trackColor)
	const trackIndex = trackContext?.index || 0

	function playThisTrack() {
		changeTrack(playlist, trackIndex)
	}

	const isCurrentTrack = currentTrack?.title === title

	return (
		<Layout
			pageTitle={`${title} - ${artistsList}${featureList}`}
			imageUrl={imageUrl}
			slug={getTrackLink(track)}
		>
			<Panel>
				<Content>
					<BigPlayButton
						smallPadding
						dimmed={isCurrentTrack && player.isPlaying}
						color={trackColor}
						onClick={isCurrentTrack ? player.togglePlay : playThisTrack}
					>
						<PlaybackIcon
							as={isCurrentTrack && player.isPlaying ? PauseIcon : undefined}
						/>
					</BigPlayButton>
					<SongDetails>
						<Topline>
							{artistsList}
							<Features>{featureList}</Features>
						</Topline>
						<Heading spacing={null}>{title}</Heading>
						<Subtitle>
							<Stack inline spacing="m">
								{producers && (
									<>
										<BeatIcon
											dimmed
											scale={0.75}
											spacingRight="xs"
											aria-label="Beat:"
										/>
										{friendlyList(producers)}
									</>
								)}
								{artistsAlias && (
									<>
										<MicIcon
											dimmed
											scale={0.75}
											spacingRight="xs"
											aria-label="Am Mikrofon:"
										/>
										{friendlyList(
											artistsFeat ? [...artists, ...artistsFeat] : artists
										)}
									</>
								)}
							</Stack>
						</Subtitle>
					</SongDetails>
					<DownloadLink size="xs" href={mp3Link}>
						<span>Download</span>
						<DownloadIcon spacingLeft="xxs" />
					</DownloadLink>
				</Content>
				<WaveformContainer>
					<Waveform
						src={imageUrl}
						width={waveformWidth}
						height={wavformHeight}
						alt=""
					/>
					<WaveformShade
						scale={
							isCurrentTrack && player.currentTime > 1
								? getWaveformShadeScale(player.currentTime, player.duration)
								: 1
						}
					/>
					{/* <progress
						value={player.currentTime}
						min="0"
						max={player.duration}
						style={{width: '100%'}}
					/> */}
				</WaveformContainer>
			</Panel>
		</Layout>
	)
}

export default Artist

export const query = graphql`
	query($slug: String!) {
		site {
			siteMetadata {
				audioCdnRoot
				imageCdnRoot
				title
			}
		}
		track: tracksYaml(fields: {slug: {eq: $slug}}) {
			id
			title
			artists
			artistsAlias
			artistsFeat
			producers
			filename
			fields {
				slug
			}
		}
	}
`
