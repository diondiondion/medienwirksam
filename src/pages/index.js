import React from 'react'
import {graphql} from 'gatsby'

import Layout from '@components/Layout'
import PlaylistItem, {PlaylistGrid} from '@components/PlaylistItem'
import Filter from '@components/Filter'

function IndexPage({data}) {
	const {playlists, artists, site} = data
	const {imageCdnRoot} = site.siteMetadata

	return (
		<Layout>
			<Filter artists={artists.nodes} />
			<PlaylistGrid>
				{playlists.edges.map(({node: playlist}) => (
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

export default IndexPage

export const query = graphql`
	query {
		site {
			siteMetadata {
				title
				audioCdnRoot
				imageCdnRoot
			}
		}
		artists: allArtistsYaml(sort: {fields: title, order: ASC}) {
			nodes {
				title
				fields {
					slug
				}
			}
		}
		playlists: allMarkdownRemark(
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
