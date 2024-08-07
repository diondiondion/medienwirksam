import {useEffect, useReducer, useRef} from 'react'
import {useLocalStorageReducer} from '@utils/useLocalStorage'

function useForceUpdate() {
	const [, forceUpdate] = useReducer(e => e + 1, 0)
	return forceUpdate
}

function useFullSecondTimeout(callback, currentTime) {
	const lastFullSecond = useRef(0)

	// The ontimeupdate event triggers at kind of random
	// sub-second intervals which can lead to an unevenly
	// updating time readout. The following makes sure to
	// update the time on every full second
	useEffect(() => {
		const currentFullSecond = Math.floor(currentTime)
		const shouldScheduleUpdate = currentFullSecond !== lastFullSecond.current

		if (shouldScheduleUpdate) {
			const delay = 1 - (currentTime % 1)
			lastFullSecond.current = currentFullSecond

			const timeout = setTimeout(callback, delay)

			return () => clearTimeout(timeout)
		}
	}, [currentTime, callback])
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

function useAudioPlayer(audio) {
	const [volume, dispatchVolume] = useLocalStorageReducer(
		'medienwirksam-volume',
		volumeReducer,
		initialVolume
	)
	const forceUpdate = useForceUpdate()

	useEffect(
		function syncVolume() {
			if (audio) {
				audio.volume = volume.current
			}
		},
		[audio, volume]
	)

	useEffect(
		function addListeners() {
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
		[audio, forceUpdate]
	)

	const isPlaying = audio && !(audio.paused || audio.ended)
	const isMuted = Number(volume.current) === 0
	const hasMetadata = audio && !isNaN(audio.duration)
	const currentTime = hasMetadata ? audio.currentTime : 0

	useFullSecondTimeout(forceUpdate, currentTime)

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
		hasLoaded: hasMetadata,
		isPlaying,
		isMuted,
		duration: hasMetadata ? audio.duration : 0,
		currentTime,
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
