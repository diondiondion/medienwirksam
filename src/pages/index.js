import React from 'react'
import {graphql} from 'gatsby'

import Layout from '@components/Layout'
import PlaylistItem from '@components/PlaylistItem'

function IndexPage({data: {site, allMarkdownRemark: playlists}}) {
	const {title} = site.siteMetadata
	return (
		<Layout>
			<h1>{title}</h1>
			<p>Playlists: {playlists.totalCount}</p>
			<ul>
				{playlists.edges.map(({node: playlist}) => (
					<li key={playlist.id}>
						<PlaylistItem
							playlist={playlist}
							link={`/playlist/${playlist.fields.slug}`}
						/>
					</li>
				))}
			</ul>
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
			}
		}
		allMarkdownRemark {
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
						tracks {
							title
						}
					}
				}
			}
		}
	}
`
