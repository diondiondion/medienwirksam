import React from 'react'
import {Flipper} from 'react-flip-toolkit'
import {Location} from '@reach/router'
import {ThemeProvider} from 'styled-components'
import theme from '@style/theme'

import AudioPlayer from '@components/AudioPlayer'
import {AudioPlayerProvider} from '@components/AudioPlayer/AudioPlayerContext'
import {BackLinkProvider} from '@components/BackLink/useBackLink'
import {PlaylistStateProvider} from '@components/PlaylistState'

const flipperStaggerConfig = {
	default: {
		speed: 0.5,
	},
	reverse: {
		reverse: true,
		speed: 0.5,
	},
}

function AppWrapper({children}) {
	return (
		<ThemeProvider theme={theme}>
			<PlaylistStateProvider>
				<AudioPlayerProvider>
					<Location>
						{({location}) => (
							<BackLinkProvider pathname={location.pathname}>
								<Flipper
									flipKey={location.key}
									staggerConfig={flipperStaggerConfig}
								>
									{children}
								</Flipper>
							</BackLinkProvider>
						)}
					</Location>
					<AudioPlayer />
				</AudioPlayerProvider>
			</PlaylistStateProvider>
		</ThemeProvider>
	)
}

export default AppWrapper
