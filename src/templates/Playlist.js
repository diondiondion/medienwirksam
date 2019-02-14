import React from 'react'
import {Link, graphql} from 'gatsby'

import Layout from '@components/Layout'
import {TrackContext} from '@components/AppWrapper'

function Playlist({data}) {
	const {audioCdnRoot} = data.site.siteMetadata
	const playlist = data.markdownRemark.frontmatter
	const linkPrefix = `https://${audioCdnRoot}`

	return (
		<TrackContext.Consumer>
			{({currentTrack, changeTrack}) => (
				<Layout>
					<Link to="/">Back</Link>
					<h1>{playlist.title}</h1>
					<ul>
						{playlist.tracks.map((track, index) => (
							<li>
								<a
									href={linkPrefix + track.filename}
									style={
										currentTrack && currentTrack.title === track.title
											? {fontWeight: 'bold'}
											: undefined
									}
								>
									{track.title}
								</a>
								<button
									type="button"
									onClick={() => changeTrack(playlist, index)}
								>
									Play
								</button>
							</li>
						))}
					</ul>
				</Layout>
			)}
		</TrackContext.Consumer>
	)
}

export default Playlist

export const query = graphql`
	query($slug: String!) {
		site {
			siteMetadata {
				audioCdnRoot
			}
		}
		markdownRemark(fields: {slug: {eq: $slug}}) {
			html
			frontmatter {
				title
				artists
				year
				frontCover
				backCover
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
