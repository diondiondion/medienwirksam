import React from 'react'
import {Link, graphql} from 'gatsby'

import Layout from '../components/layout'

function IndexPage({data: {site, allMarkdownRemark: playlists}}) {
	const {title, audioCdnRoot} = site.siteMetadata
	return (
		<Layout>
			<h1>{title}</h1>
			<p>Playlists: {playlists.totalCount}</p>
			<ul>
				{playlists.edges.map(({node: playlist}) => (
					<li key={playlist.id}>
						<Link to={`/playlist/${playlist.fields.slug}`}>
							{playlist.frontmatter.title}
						</Link>{' '}
						({playlist.frontmatter.tracks.length} tracks)
						{/* <blockquote>
							{playlist.frontmatter.tracks.map(track => (
								<p>
									{track.title} (prod. by {track.producers})
									<br />
									<audio
										controls
										src={linkPrefix + track.filename}
									/>
								</p>
							))}
						</blockquote> */}
					</li>
				))}
			</ul>
			<Link to="/page-2/">Go to page 2</Link>
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
