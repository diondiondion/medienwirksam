import React, {useContext, useCallback} from 'react'
import {graphql} from 'gatsby'
import styled, {keyframes} from 'styled-components'
import {Flipped} from 'react-flip-toolkit'

import {TrackContext} from '@components/AppWrapper'
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

const PageLayout = styled.main`
	@media (min-width: ${p => p.theme.breakpoints.s}) {
		display: grid;
		grid-template-columns: [left] minmax(0, 340px) [right] minmax(0, 540px);
		grid-template-rows: auto;
		grid-gap: ${p => p.theme.spacing.l};
		justify-content: center;
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

	@media (min-width: ${p => p.theme.breakpoints.s}) {
		margin-top: ${p => p.theme.spacing.l};
	}
`

const Metadata = styled.p`
	padding: 0 ${p => p.theme.spacing.s};
`

const PlaylistWrapper = styled.ol`
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

const PlaylistRow = styled.li`
	list-style: none;
`

const PlaylistTrack = styled.a`
	display: block;
	padding: 5px 0;

	font-size: 18px;
	color: inherit;
	text-decoration: none;

	${p =>
		p.isPlaying &&
		`
		font-weight: bold;
	`}
`

function Playlist({data}) {
	const {currentTrack, changeTrack} = useContext(TrackContext)
	const {audioCdnRoot, imageCdnRoot} = data.site.siteMetadata

	const playlist = data.markdownRemark.frontmatter
	const {slug} = data.markdownRemark.fields
	const {title, artists, year, tracks, frontCover, color} = playlist

	const audioLinkPrefix = `https://${audioCdnRoot}`

	const imageUrl = frontCover
		? `https://${imageCdnRoot}w_340/${frontCover}`
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

	return (
		<Layout>
			<PageLayout>
				<PlaylistInfo>
					<Flipped stagger="reverse" flipId={`playlistImage-${slug}`}>
						<figure>{imageUrl && <img src={imageUrl} alt="" />}</figure>
					</Flipped>
					<Flipped stagger="reverse" flipId={`playlistTitle-${slug}`}>
						<TitleLabel as="h1" color={color}>
							{title}
						</TitleLabel>
					</Flipped>
					<Flipped stagger="reverse" flipId={`playlistInfo-${slug}`}>
						<Metadata>
							<strong>{artists.join(' und ')}</strong>
							<br />
							{year}
							<br />
							{tracks.length} tracks
						</Metadata>
					</Flipped>
				</PlaylistInfo>
				<PlaylistWrapper>
					{playlist.tracks.map((track, index) => {
						const isPlaying = currentTrack && currentTrack.title === track.title
						return (
							<PlaylistRow key={track.title}>
								<PlaylistTrack
									isPlaying={isPlaying}
									href={audioLinkPrefix + track.filename}
									onClick={e => playTrack(e, index)}
								>
									{track.title}
								</PlaylistTrack>
							</PlaylistRow>
						)
					})}
				</PlaylistWrapper>
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
