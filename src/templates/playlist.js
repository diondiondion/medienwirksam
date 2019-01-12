import React from 'react'
import {Link, graphql} from 'gatsby'

import Layout from '../components/layout'

import {TrackContext} from '../components/appWrapper'

function Playlist({data}) {
	const {audioCdnRoot} = data.site.siteMetadata
	const playlist = data.markdownRemark.frontmatter
	const linkPrefix = `https://${audioCdnRoot}`

	return (
		<TrackContext.Consumer>
			{({currentTrack, changeCurrentTrack}) => (
				<Layout>
					<h1>{playlist.title}</h1>
					{currentTrack.title}
					<ul>
						{playlist.tracks.map(track => (
							<li>
								<a href={linkPrefix + track.filename}>{track.title}</a>
								<button type="button" onClick={() => changeCurrentTrack(track)}>
									Play
								</button>
							</li>
						))}
					</ul>
					<Link to="/">Back</Link>
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
