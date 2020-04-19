import React, {useContext} from 'react'
import {graphql} from 'gatsby'
import styled, {keyframes} from 'styled-components'
import {Flipped} from 'react-flip-toolkit'

import friendlyList from '@utils/friendlyList'
import ClearButton from '@components/ClearButton'
import {BackIcon, PlayIcon} from '@components/icons'
import Layout from '@components/Layout'
import TitleLabel from '@components/TitleLabel'
import TextLink from '@components/TextLink'
import BackLink from '@components/BackLink'
import Playlist from '@components/Playlist'
import {TrackContext} from '@components/AppWrapper'

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

const BackLinkWrapper = styled.span`
	display: block;
	margin-bottom: ${p => p.theme.spacing.m};
	animation: ${fadeInFromRight} 250ms backwards ease-out 250ms;
`

const PageLayout = styled.main`
	@media (min-width: ${p => p.theme.breakpoints.s}) {
		display: grid;
		grid-template-columns: [left] minmax(0, 340px) [right] minmax(100px, 540px);
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

const PlaylistContainer = styled.section`
	position: relative;
	grid-column: right;

	animation: ${fadeInFromTop} 250ms backwards ease-out 250ms;
	transform-origin: 0 0;

	@media (min-width: ${p => p.theme.breakpoints.s}) {
		animation-name: ${fadeInFromLeft};
	}
`

const BigPlayButton = styled(ClearButton)`
	position: absolute;
	top: -${p => p.theme.spacing.l};
	right: ${p => p.theme.spacing.m};
	transform: rotate(-3deg);

	@media (min-width: ${p => p.theme.breakpoints.s}) {
		top: -${p => p.theme.spacing.s};
	}
`

function PlaylistPage({data}) {
	const {currentTrack, changeTrack, playlist: currentPlaylist} = useContext(
		TrackContext
	)
	const {imageCdnRoot} = data.site.siteMetadata
	const {
		frontmatter,
		fields: {slug},
	} = data.markdownRemark
	const playlist = {
		...frontmatter,
		slug,
		path: `/playlist${slug}`,
	}
	const {title, artists, year, tracks, frontCover, color} = playlist
	const isCurrentPlaylist = currentPlaylist?.title === title

	function playTrack(index) {
		changeTrack(playlist, index)
	}

	const imageUrl = frontCover
		? `https://${imageCdnRoot}w_340,h_340,c_fill/${frontCover}`
		: null

	const playlistArtists = friendlyList(artists)

	return (
		<Layout withoutLogo pageTitle={`${title} - ${playlistArtists}`}>
			<PageLayout>
				<PlaylistInfo>
					<BackLinkWrapper>
						<TextLink as={BackLink} to="/" size="xs">
							<BackIcon />
							zurück
						</TextLink>
					</BackLinkWrapper>
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
				<PlaylistContainer>
					{!isCurrentPlaylist && (
						<BigPlayButton
							smallPadding
							color={color}
							onClick={() => playTrack(0)}
						>
							<PlayIcon />
						</BigPlayButton>
					)}
					<Playlist
						id={title.replace(' ', '_').toLowerCase()}
						tracks={playlist.tracks}
						currentTrack={currentTrack}
						shouldExcludeArtist={artist => artists.includes(artist)}
						color={color}
						onPlay={playTrack}
					/>
				</PlaylistContainer>
			</PageLayout>
		</Layout>
	)
}

export default PlaylistPage

export const query = graphql`
	query($slug: String!) {
		site {
			siteMetadata {
				audioCdnRoot
				imageCdnRoot
				title
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
					artistsAlias
					artistsFeat
					producers
					filename
					fields {
						slug
					}
				}
			}
		}
	}
`
