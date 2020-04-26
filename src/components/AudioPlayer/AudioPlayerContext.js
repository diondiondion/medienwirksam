import React, {useRef, createContext} from 'react'
import useAudioPlayer from './useAudioPlayer'

const AudioPlayerContext = createContext()

function AudioPlayerProvider({children}) {
	const audioRef = useRef(null)
	const player = useAudioPlayer(audioRef)
	return (
		<AudioPlayerContext.Provider value={{player, audioRef}}>
			{children}
		</AudioPlayerContext.Provider>
	)
}

export {AudioPlayerContext, AudioPlayerProvider}
