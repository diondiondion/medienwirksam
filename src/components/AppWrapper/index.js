import React from 'react'
import {Location} from '@reach/router'
import {ThemeProvider} from 'styled-components'
import theme from '@style/theme'
import {AnimateSharedLayout} from 'framer-motion'

import AudioPlayer from '@components/AudioPlayer'
import {AudioPlayerProvider} from '@components/AudioPlayer/AudioPlayerContext'
import {BackLinkProvider} from '@components/BackLink/useBackLink'
import {PlaylistStateProvider} from '@components/PlaylistState'

function AppWrapper({children}) {
	return (
		<ThemeProvider theme={theme}>
			<PlaylistStateProvider>
				<AudioPlayerProvider>
					<Location>
						{({location}) => (
							<BackLinkProvider pathname={location.pathname}>
								<AnimateSharedLayout>{children}</AnimateSharedLayout>
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
