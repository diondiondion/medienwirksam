import React, {useContext, useCallback} from 'react'
import {Link, graphql} from 'gatsby'
import styled, {keyframes} from 'styled-components'
import {Flipped} from 'react-flip-toolkit'

import {TrackContext} from '@components/AppWrapper'
import ClearButton from '@components/ClearButton'
import {BackIcon, PlayIcon} from '@components/icons'
import Layout from '@components/Layout'
import TitleLabel from '@components/TitleLabel'

const fadeInFromLeft = keyframes`
	from {
		opacity: 0;
		transform: translateX(-50px);
	}
`

const fadeInFromTop = keyframes`
	from {
		opacity: 0;
		transform: translateY(-50px);
	}
`

const fadeInFromRight = keyframes`
	from {
		opacity: 0;
		transform: translateX(50px);
	}
`

const BackLink = styled(Link)`
	display: inline-block;
	margin-bottom: ${p => p.theme.spacing.m};
	color: ${p => p.theme.text};
	text-decoration: none;
	font-weight: bold;
	font-size: ${p => p.theme.typeScale.s};

	animation: ${fadeInFromRight} 250ms backwards ease-out 250ms;

	&:hover,
	&.focus-visible {
		text-decoration: underline;
	}

	& > svg {
		margin-right: 0.5rem;
		font-size: 1.8em;
		vertical-align: -0.3em;
	}
`

const PageLayout = styled.main`
	@media (min-width: ${p => p.theme.breakpoints.s}) {
		display: grid;
		grid-template-columns: [left] minmax(0, 340px) [right] minmax(0, 540px);
		grid-template-rows: auto;
		grid-gap: ${p => p.theme.spacing.l};
		justify-content: center;
		align-items: flex-start;
	}
	@media (min-width: ${p => p.theme.breakpoints.m}) {
		grid-gap: ${p => p.theme.spacing.xxl};
	}
`

const PlaylistInfo = styled.div`
	width: 100%;
	max-width: 340px;
	margin: 0 auto;
	grid-column: left;
`

const Header = styled.header`
	width: 80%;
`

const Metadata = styled.p`
	display: inline-block;
	margin: ${p => p.theme.spacing.m} ${p => p.theme.spacing.s};
`

const TracklistContainer = styled.section`
	position: relative;
	grid-column: right;
	margin: 0;
	padding: ${p => p.theme.spacing.m};

	background-color: ${p => p.theme.panel};
	box-shadow: 0 0 30px #ffffff2b;

	animation: ${fadeInFromTop} 250ms backwards ease-out 250ms;
	transform-origin: 0 0;

	@media (min-width: ${p => p.theme.breakpoints.s}) {
		animation-name: ${fadeInFromLeft};
	}
`

const Tracklist = styled.ol`
	margin: 0;
	padding: 0;
`

const TracklistItem = styled.li`
	list-style: none;
`

const Track = styled.a`
	display: block;
	padding: 5px 0;

	font-size: 18px;
	color: inherit;
	text-decoration: none;

	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	${p =>
		p.isPlaying &&
		`
		font-weight: bold;
		padding-left: ${p.theme.spacing.m};
	`}
`

const PositionedClearButton = styled(ClearButton)`
	position: absolute;
	top: -${p => p.theme.spacing.l};
	right: ${p => p.theme.spacing.m};
	transform: rotate(-3deg);

	@media (min-width: ${p => p.theme.breakpoints.s}) {
		top: -${p => p.theme.spacing.s};
	}
`

function Playlist({data}) {
	const {currentTrack, changeTrack} = useContext(TrackContext)
	const {audioCdnRoot, imageCdnRoot} = data.site.siteMetadata

	const playlist = data.markdownRemark.frontmatter
	const {slug} = data.markdownRemark.fields
	const {title, artists, year, tracks, frontCover, color} = playlist

	const audioLinkPrefix = `https://${audioCdnRoot}`

	const imageUrl = frontCover
		? `https://${imageCdnRoot}w_340,h_340,c_fill/${frontCover}`
		: null

	const playTrack = useCallback(
		(e, trackIndex) => {
			e.preventDefault()
			const playlistWithSlug = {
				...playlist,
				slug,
			}
			changeTrack(playlistWithSlug, trackIndex)
		},
		[changeTrack, playlist, slug]
	)

	const playlistArtists = artists.join(' und ')

	const isCurrentPlaylist =
		currentTrack &&
		playlist.tracks.find(track => track && track.title === currentTrack.title)

	return (
		<Layout withoutLogo pageTitle={`${title} - ${playlistArtists}`}>
			<PageLayout>
				<PlaylistInfo>
					<BackLink to="/">
						<BackIcon />
						zurück
					</BackLink>
					<Flipped stagger="reverse" flipId={`playlistImage-${slug}`}>
						<figure>
							{imageUrl && (
								<img src={imageUrl} alt="" width="340" height="340" />
							)}
						</figure>
					</Flipped>
					<Header>
						<Flipped stagger="reverse" flipId={`playlistTitle-${slug}`}>
							<TitleLabel as="h1" color={color}>
								{title}
							</TitleLabel>
						</Flipped>
					</Header>
					<Flipped stagger="reverse" flipId={`playlistInfo-${slug}`}>
						<Metadata>
							<strong>{playlistArtists}</strong>
							<br />
							{year}
							<br />
							{tracks.length} tracks
						</Metadata>
					</Flipped>
				</PlaylistInfo>
				<TracklistContainer>
					{!isCurrentPlaylist && (
						<PositionedClearButton
							smallPadding
							color={color}
							onClick={e => playTrack(e, 0)}
						>
							<PlayIcon />
						</PositionedClearButton>
					)}
					<Tracklist>
						{playlist.tracks.map((track, index) => {
							if (!track)
								return (
									<TracklistItem key={index}>
										Track {index + 1} nicht gefunden
									</TracklistItem>
								)

							const isPlaying =
								currentTrack && currentTrack.title === track.title
							return (
								<TracklistItem key={track.title}>
									<Track
										isPlaying={isPlaying}
										href={audioLinkPrefix + track.filename}
										onClick={e => playTrack(e, index)}
									>
										{track.title}

										{track.artists_feat && (
											<span style={{opacity: 0.6}}>
												{' '}
												ft. {track.artists_feat.join(', ')}
											</span>
										)}
									</Track>
								</TracklistItem>
							)
						})}
					</Tracklist>
				</TracklistContainer>
			</PageLayout>
		</Layout>
	)
}

export default Playlist

export const query = graphql`
	query($slug: String!) {
		site {
			siteMetadata {
				audioCdnRoot
				imageCdnRoot
			}
		}
		markdownRemark(fields: {slug: {eq: $slug}}) {
			html
			fields {
				slug
			}
			frontmatter {
				title
				artists
				year
				frontCover
				backCover
				color
				tracks {
					title
					artists
					artists_feat
					producers
					filename
				}
			}
		}
	}
`
