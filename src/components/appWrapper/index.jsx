import React, {Component} from 'react'
import {StaticQuery, graphql} from 'gatsby'

export const TrackContext = React.createContext()

class AppWrapper extends Component {
	state = {
		currentTrack: {
			title: 'Walkman',
			filename: '/walkman/13-plus-4.mp3',
		},
	}

	changeTrack = trackData => {
		this.setState({currentTrack: trackData})
	}

	render() {
		const {children} = this.props
		const {currentTrack} = this.state

		return (
			<>
				<StaticQuery
					query={graphql`
						query {
							site {
								siteMetadata {
									audioCdnRoot
								}
							}
						}
					`}
					render={data => {
						const {audioCdnRoot} = data.site.siteMetadata
						return (
							<>
								<audio
									controls
									src={`https://${audioCdnRoot}${currentTrack.filename}`}
								/>
								({currentTrack.title})
							</>
						)
					}}
				/>
				<TrackContext.Provider
					value={{
						currentTrack,
						changeCurrentTrack: this.changeTrack,
					}}
				>
					{children}
				</TrackContext.Provider>
			</>
		)
	}
}

export default AppWrapper
