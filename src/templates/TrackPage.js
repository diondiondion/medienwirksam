import React from 'react'
import styled from 'styled-components'
import {graphql} from 'gatsby'

import friendlyList from '@utils/friendlyList'
import Layout from '@components/Layout'
import Heading from '@components/Heading'
import Panel from '@components/Panel'
import Stack from '@components/Stack'
import TextLink from '@components/TextLink'
import ClearButton from '@components/ClearButton'
import {BeatIcon, MicIcon, DownloadIcon, PlayIcon} from '@components/icons'

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

const MetaIcon = styled.span`
	margin-right: ${p => p.theme.spacing.xxs};
	vertical-align: -0.25em;
	font-size: ${p => p.theme.typeScale.m};
	opacity: 0.7;
`

const DownloadLink = styled(TextLink).attrs({download: true})`
	align-self: flex-start;
	white-space: nowrap;

	& svg {
		margin-left: ${p => p.theme.spacing.xxs};
		margin-right: 0;
	}

	& span {
		@media (max-width: ${p => p.theme.breakpoints.s}) {
			display: none;
		}
	}
`

function getRandomColor() {
	const letters = '0123456789ABCDEF'
	let color = ''
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

function getImageLinkFromMp3Link(filename) {
	const [nameWithoutExt] = filename.split('.')

	return `${nameWithoutExt}.png`
}

const waveformSizes = {
	width: 800,
	height: 120,
}

function Artist({data}) {
	const {currentTrack, site} = data
	const {
		title,
		artists,
		artistsAlias,
		artistsFeat,
		producers,
		filename,
	} = currentTrack

	const {audioCdnRoot} = site.siteMetadata
	const trackColor = getRandomColor()
	const imageFilename = getImageLinkFromMp3Link(filename)
	const imageLink = `https://${audioCdnRoot}h_${waveformSizes.height},w_${waveformSizes.width},fl_waveform,co_rgb:${trackColor},b_transparent/${imageFilename}`
	const mp3Link = `https://${audioCdnRoot}${filename}`

	const artistsList = artistsAlias || friendlyList(artists)
	const featureList = artistsFeat ? ` ft. ${friendlyList(artistsFeat)}` : ''

	return (
		<Layout pageTitle={`${title} - ${artistsList}${featureList}`}>
			<Panel>
				<Content>
					<ClearButton smallPadding color={`#${trackColor}`} onClick={() => {}}>
						<PlayIcon />
					</ClearButton>
					<SongDetails>
						<p>
							{artistsList}
							<Features>{featureList}</Features>
						</p>
						<Heading spacing={null}>{title}</Heading>
						<Subtitle>
							<Stack inline spacing="m">
								<>
									<MetaIcon as={BeatIcon} aria-label="Beat:" />
									{friendlyList(producers)}
								</>
								{artistsAlias && (
									<>
										<MetaIcon as={MicIcon} aria-label="Am Mikrofon:" />
										{friendlyList(artists)}
									</>
								)}
							</Stack>
						</Subtitle>
					</SongDetails>
					<DownloadLink size="xs" href={mp3Link}>
						<span>Download</span>
						<DownloadIcon />
					</DownloadLink>
				</Content>
				<Waveform
					src={imageLink}
					width={waveformSizes.width}
					height={waveformSizes.height}
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
		currentTrack: tracksYaml(fields: {slug: {eq: $slug}}) {
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
