import React, {useContext} from 'react'
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
	IsPlayingIcon,
} from '@components/icons'
import {PlaylistContext} from '@components/PlaylistState'

const Waveform = styled.img`
	display: block;
	width: 100%;
	padding-bottom: ${p => p.theme.spacing.m};
	opacity: 0.333;
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
	margin: 0 ${p => p.theme.spacing.m};
`

const Features = styled.span`
	opacity: 0.7;
`

const Subtitle = styled.p`
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

	const trackColor = trackContext?.playlist.color || getRandomColor()
	const imageFilename = getImageLinkFromMp3Link(filename)
	const imageLink = `https://${audioCdnRoot}h_${wavformHeight},w_${waveformWidth},fl_waveform,co_rgb:${removeHash(
		trackColor
	)},b_transparent/${imageFilename}`
	const mp3Link = `https://${audioCdnRoot}${filename}`

	const artistsList = artistsAlias || friendlyList(artists)
	const featureList = artistsFeat ? ` ft. ${friendlyList(artistsFeat)}` : ''

	const {currentTrack, changeTrack} = useContext(PlaylistContext)
	const playlist =
		trackContext?.playlist || getSingleTrackPlaylist(track, trackColor)
	const trackIndex = trackContext?.index || 0

	function play() {
		changeTrack(playlist, trackIndex)
	}

	const isCurrentTrack = currentTrack?.title === title

	return (
		<Layout pageTitle={`${title} - ${artistsList}${featureList}`}>
			<Panel>
				<Content>
					<ClearButton
						smallPadding
						dimmed={isCurrentTrack}
						disabled={isCurrentTrack}
						color={trackColor}
						onClick={play}
					>
						{isCurrentTrack ? <IsPlayingIcon size={45} /> : <PlayIcon />}
					</ClearButton>
					<SongDetails>
						<p>
							{artistsList}
							<Features>{featureList}</Features>
						</p>
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
										{friendlyList(artists)}
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
				<Waveform
					src={imageLink}
					width={waveformWidth}
					height={wavformHeight}
					alt=""
				/>
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
