import React from 'react'
import {graphql} from 'gatsby'
import styled from 'styled-components'

import Layout from '@components/Layout'
import PlaylistItem from '@components/PlaylistItem'

const PlaylistGrid = styled.section`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min-content, 540px));
	grid-gap: ${p => p.theme.spacing.l};
	justify-content: center;
`

function IndexPage({data: {site, allMarkdownRemark: playlists}}) {
	const {imageCdnRoot} = site.siteMetadata
	return (
		<Layout>
			<PlaylistGrid>
				{playlists.edges.map(({node: playlist}) => (
					<PlaylistItem
						key={playlist.id}
						playlist={playlist}
						imageCdnRoot={imageCdnRoot}
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
