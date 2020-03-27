import React, {useContext} from 'react'
import {graphql} from 'gatsby'
import styled from 'styled-components'

import Layout from '@components/Layout'
import Filter from '@components/Filter'
import Heading from '@components/Heading'
import Playlist from '@components/Playlist'
import PlaylistTile, {PlaylistGrid} from '@components/PlaylistTile'
import {TrackContext} from '@components/AppWrapper'

const Columns = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
`

function Artist({data}) {
	const {
		currentArtist,
		allArtists,
		playlists,
		tracks,
		featureTracks,
		producedTracks,
		site,
	} = data
	const {audioCdnRoot, imageCdnRoot} = site.siteMetadata
	const {slug} = currentArtist.fields

	const {currentTrack, changeTrack, playlist: currentPlaylist} = useContext(
		TrackContext
	)

	const getTrackMp3Link = filename => `https://${audioCdnRoot}${filename}`

	const artistPlaylist = {
		slug,
		title: `${currentArtist.title} Playlist`,
		artist: currentArtist.title,
		color: '#09d0ab',
		tracks: tracks.edges.map(({node}) => node),
		path: `artists/${slug}`,
	}

	const isCurrentPlaylist =
		currentPlaylist && currentPlaylist.title === artistPlaylist.title

	function playTrack(index) {
		changeTrack(artistPlaylist, index)
	}

	return (
		<Layout pageTitle={currentArtist.title}>
			<Filter artists={allArtists.nodes} selectedArtist={currentArtist.title} />
			<Columns>
				<div>
					<Heading as="h2">Alben</Heading>
					<PlaylistGrid>
						{playlists.edges.map(({node: playlist}) => (
							<PlaylistTile
								key={playlist.id}
								playlist={playlist}
								imageCdnRoot={imageCdnRoot}
								slug={playlist.fields.slug}
								link={`/playlist${playlist.fields.slug}`}
							/>
						))}
					</PlaylistGrid>
				</div>
				<div>
					<Heading as="h2">
						Tracks
						{isCurrentPlaylist && '*'}
					</Heading>
					<Playlist
						tracks={artistPlaylist.tracks}
						currentTrack={currentTrack}
						shouldExcludeArtist={artist => currentArtist.title === artist}
						color={artistPlaylist.color}
						getMp3Link={getTrackMp3Link}
						onPlay={playTrack}
					/>
				</div>
			</Columns>
		</Layout>
	)
}

export default Artist

export const query = graphql`
	query($slug: String!, $artistFilter: [String!]) {
		site {
			siteMetadata {
				audioCdnRoot
				imageCdnRoot
				title
			}
		}
		currentArtist: artistsYaml(fields: {slug: {eq: $slug}}) {
			title
			fields {
				slug
			}
		}
		allArtists: allArtistsYaml(sort: {fields: title, order: ASC}) {
			nodes {
				title
				isMedienwirksam
				fields {
					slug
				}
			}
		}
		playlists: allMarkdownRemark(
			filter: {frontmatter: {artists: {in: $artistFilter}}}
			sort: {fields: [frontmatter___year], order: DESC}
		) {
			totalCount
			edges {
				node {
					id
					fields {
						slug
					}
					frontmatter {
						title
						artists
						frontCover
						backCover
						color
						year
						tracks {
							title
						}
					}
				}
			}
		}
		tracks: allTracksYaml(
			filter: {artists: {in: $artistFilter}}
			sort: {fields: title, order: ASC}
		) {
			edges {
				node {
					id
					title
					artists
					artistsAlias
					artistsFeat
					filename
					producers
				}
			}
		}
		featureTracks: allTracksYaml(
			filter: {artistsFeat: {in: $artistFilter}}
			sort: {fields: title, order: ASC}
		) {
			edges {
				node {
					id
					title
					artists
					artistsAlias
					artistsFeat
					filename
					producers
				}
			}
		}
		producedTracks: allTracksYaml(
			filter: {producers: {in: $artistFilter}}
			sort: {fields: title, order: ASC}
		) {
			edges {
				node {
					id
					title
					artists
					artistsAlias
					artistsFeat
					filename
					producers
				}
			}
		}
	}
`
