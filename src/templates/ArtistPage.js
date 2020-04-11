import React, {useContext} from 'react'
import {graphql} from 'gatsby'

import Layout from '@components/Layout'
import Filter from '@components/Filter'
import Heading from '@components/Heading'
import Playlist from '@components/Playlist'
import Stack from '@components/Stack'
import PlaylistTile, {PlaylistGrid} from '@components/PlaylistTile'
import {TrackContext} from '@components/AppWrapper'

function ArtistPlaylist({currentArtist, getMp3Link, title, tracks}) {
	const {currentTrack, changeTrack, playlist: currentPlaylist} = useContext(
		TrackContext
	)

	const {slug} = currentArtist.fields
	const artistPlaylist = {
		slug,
		title: `${title} von ${currentArtist.title}`,
		artist: currentArtist.title,
		color: '#09d0ab',
		tracks: tracks.edges.map(({node}) => node),
		path: `artists/${slug}`,
	}

	function playTrack(index) {
		changeTrack(artistPlaylist, index)
	}

	const isCurrentPlaylist =
		currentPlaylist && currentPlaylist.title === artistPlaylist.title

	return (
		<>
			<Heading as="h2">
				{title}
				{isCurrentPlaylist && '*'}
			</Heading>
			<Playlist
				id={title.replace(' ', '_').toLowerCase()}
				tracks={artistPlaylist.tracks}
				currentTrack={currentTrack}
				shouldExcludeArtist={artist => currentArtist.title === artist}
				maxTrackCount={5}
				color={artistPlaylist.color}
				getMp3Link={getMp3Link}
				onPlay={playTrack}
			/>
		</>
	)
}

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

	const getTrackMp3Link = filename => `https://${audioCdnRoot}${filename}`

	return (
		<Layout pageTitle={currentArtist.title}>
			<Filter
				artists={allArtists.nodes.filter(a => a.isMedienwirksam)}
				selectedArtist={currentArtist.title}
			/>
			<PlaylistGrid as="main">
				{!!playlists.edges.length && (
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
				)}
				<div>
					<Stack spacing="l">
						{!!tracks.edges.length && (
							<ArtistPlaylist
								title="Tracks"
								tracks={tracks}
								currentArtist={currentArtist}
								getMp3Link={getTrackMp3Link}
							/>
						)}
						{!!featureTracks.edges.length && (
							<ArtistPlaylist
								title="Features"
								tracks={featureTracks}
								currentArtist={currentArtist}
								getMp3Link={getTrackMp3Link}
							/>
						)}
						{!!producedTracks.edges.length && (
							<ArtistPlaylist
								title="Beats"
								tracks={producedTracks}
								currentArtist={currentArtist}
								getMp3Link={getTrackMp3Link}
							/>
						)}
					</Stack>
				</div>
			</PlaylistGrid>
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
