import {useEffect, useReducer} from 'react'

function useForceUpdate() {
	const [, forceUpdate] = useReducer(e => e + 1, 0)
	return forceUpdate
}

const initialVolume = {
	current: 1,
	previous: 1,
}

function volumeReducer(volume, action) {
	if (action.type === 'toggleMute') {
		if (volume.current === 0) {
			return {
				...volume,
				current: Number(volume.previous),
			}
		} else
			return {
				current: 0,
				previous: Number(volume.current),
			}
	}
	if (action.type === 'setVolume') {
		return {
			...volume,
			current: Number(action.value),
		}
	}
	throw new Error()
}

function useAudioPlayer(ref) {
	const [volume, dispatchVolume] = useReducer(volumeReducer, initialVolume)
	const forceUpdate = useForceUpdate()

	useEffect(
		function syncVolume() {
			const audio = ref.current
			if (audio) {
				audio.volume = volume.current
			}
		},
		[ref, volume]
	)

	useEffect(
		function addListeners() {
			const audio = ref.current
			if (audio) {
				audio.addEventListener('play', forceUpdate)
				audio.addEventListener('pause', forceUpdate)
				audio.addEventListener('ended', forceUpdate)
				audio.addEventListener('loadstart', forceUpdate)
				audio.addEventListener('loadedmetadata', forceUpdate)
				audio.addEventListener('loadeddata', forceUpdate)
				audio.addEventListener('timeupdate', forceUpdate)
				audio.addEventListener('volumechange', forceUpdate)
			}

			return function cleanUpListeners() {
				if (audio) {
					audio.removeEventListener('play', forceUpdate)
					audio.removeEventListener('pause', forceUpdate)
					audio.removeEventListener('ended', forceUpdate)
					audio.removeEventListener('loadstart', forceUpdate)
					audio.removeEventListener('loadedmetadata', forceUpdate)
					audio.removeEventListener('loadeddata', forceUpdate)
					audio.removeEventListener('timeupdate', forceUpdate)
					audio.removeEventListener('volumechange', forceUpdate)
				}
			}
		},
		[ref, forceUpdate]
	)

	const audio = ref.current
	const isPlaying = audio && !(audio.paused || audio.ended)
	const isMuted = Number(volume.current) === 0
	const hasMetadata = audio && !isNaN(audio.duration)

	function seekTo(time) {
		if (!hasMetadata) return null

		const newTime = Math.min(audio.duration, Math.max(0, time))
		audio.currentTime = newTime
	}

	function skipBy(time) {
		seekTo(audio.currentTime + time)
	}

	function toggleMute() {
		dispatchVolume({type: 'toggleMute'})
	}

	function play() {
		if (!audio) return null
		audio.play()
	}

	function pause() {
		if (!audio) return null
		audio.pause()
	}

	function togglePlay() {
		isPlaying ? pause() : play()
	}

	function stop() {
		if (!audio) return null
		audio.pause()
		audio.currentTime = 0
	}

	function setVolume(volume) {
		dispatchVolume({
			type: 'setVolume',
			value: volume,
		})
	}

	const playerObject = {
		isPlaying,
		isMuted,
		duration: hasMetadata ? audio.duration : 0,
		currentTime: hasMetadata ? audio.currentTime : 0,
		volume: volume.current,
		seekTo,
		skipBy,
		play,
		pause,
		stop,
		togglePlay,
		toggleMute,
		setVolume,
	}

	return playerObject
}

export default useAudioPlayer
