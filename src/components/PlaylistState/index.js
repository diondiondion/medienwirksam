import React, {createContext} from 'react'
import usePlaylistState from './usePlaylistState'

const PlaylistContext = createContext()

function PlaylistStateProvider({children}) {
	const playlistState = usePlaylistState()

	return (
		<PlaylistContext.Provider value={playlistState}>
			{children}
		</PlaylistContext.Provider>
	)
}

export {PlaylistStateProvider, PlaylistContext}
