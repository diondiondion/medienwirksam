import React from 'react'
import {graphql} from 'gatsby'
import styled from 'styled-components'

import Layout from '@components/Layout'
import PlaylistTile, {PlaylistGrid} from '@components/PlaylistTile'
import Filter from '@components/Filter'
import Heading from '@components/Heading'

const HomepageHeading = styled(Heading)`
	grid-column: 1 / -1;
	margin-bottom: -2rem;
`

function IndexPage({data}) {
	const {playlists, artists} = data

	return (
		<Layout>
			<Filter artists={artists.nodes} />
			<PlaylistGrid as="main">
				<HomepageHeading as="h2">Alben</HomepageHeading>
				{playlists.edges.map(({node: playlist}) => (
					<PlaylistTile key={playlist.id} playlist={playlist} />
				))}
			</PlaylistGrid>
		</Layout>
	)
}

export default IndexPage

export const query = graphql`
	query {
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
