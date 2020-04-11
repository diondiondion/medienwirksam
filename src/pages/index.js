import React from 'react'
import {graphql} from 'gatsby'

import Layout from '@components/Layout'
import PlaylistTile, {PlaylistGrid} from '@components/PlaylistTile'
import Filter from '@components/Filter'
import Heading from '@components/Heading'

function IndexPage({data}) {
	const {playlists, artists, site} = data
	const {imageCdnRoot} = site.siteMetadata

	return (
		<Layout>
			<Filter artists={artists.nodes.filter(a => a.isMedienwirksam)} />
			<main>
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
			</main>
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
				isMedienwirksam
				fields {
					slug
				}
			}
		}
		playlists: allMarkdownRemark(
			filter: {frontmatter: {isFeatured: {eq: true}}}
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
