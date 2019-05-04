import React, {useContext, useCallback} from 'react'
import {graphql} from 'gatsby'
import styled from 'styled-components'

import {TrackContext} from '@components/AppWrapper'
import Layout from '@components/Layout'
import TitleLabel from '@components/TitleLabel'

const AlbumInfo = styled.p`
	padding: 0 ${p => p.theme.spacing.s};
`

const PlaylistWrapper = styled.ol`
	margin: 0;
	padding: ${p => p.theme.spacing.m};

	background-color: ${p => p.theme.panel};
	box-shadow: 0 0 30px #ffffff2b;
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

	const imageUrl = frontCover ? `https://${imageCdnRoot}${frontCover}` : null

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
			<figure>{imageUrl && <img src={imageUrl} alt="" />}</figure>
			<TitleLabel as="h1" color={color}>
				{title}
			</TitleLabel>
			<AlbumInfo>
				<strong>{artists.join(' und ')}</strong>
				<br />
				{year}
				<br />
				{tracks.length} tracks
			</AlbumInfo>
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
					producers
					filename
				}
			}
		}
	}
`
