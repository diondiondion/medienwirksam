import React, {useState, createContext} from 'react'
import useAudioPlayer from './useAudioPlayer'

const AudioPlayerContext = createContext()

function AudioPlayerProvider({children}) {
	const [audioRef, setAudioRef] = useState(null)
	const player = useAudioPlayer(audioRef)
	return (
		<AudioPlayerContext.Provider value={{player, audioRef: setAudioRef}}>
			{children}
		</AudioPlayerContext.Provider>
	)
}

export {AudioPlayerContext, AudioPlayerProvider}
