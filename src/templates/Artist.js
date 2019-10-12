import React from 'react'
import {graphql} from 'gatsby'

import Layout from '@components/Layout'
import Filter from '@components/Filter'
import PlaylistItem, {PlaylistGrid} from '@components/PlaylistItem'

function Artist({data}) {
	// const {currentTrack, changeTrack} = useContext(TrackContext)
	const {imageCdnRoot} = data.site.siteMetadata
	const {title: artistName} = data.artistsYaml
	const playlists = data.allMarkdownRemark.edges
	const artists = data.allArtistsYaml.nodes
	const currentArtist = data.artistsYaml

	return (
		<Layout pageTitle={artistName}>
			<Filter artists={artists} selectedArtist={currentArtist.title} />
			<PlaylistGrid>
				{playlists.map(({node: playlist}) => (
					<PlaylistItem
						key={playlist.id}
						playlist={playlist}
						imageCdnRoot={imageCdnRoot}
						slug={playlist.fields.slug}
						link={`/playlist${playlist.fields.slug}`}
					/>
				))}
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
		artistsYaml(fields: {slug: {eq: $slug}}) {
			title
			fields {
				slug
			}
		}
		allArtistsYaml(sort: {fields: title, order: ASC}) {
			nodes {
				title
				isMedienwirksam
				fields {
					slug
				}
			}
		}
		allMarkdownRemark(
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
	}
`
