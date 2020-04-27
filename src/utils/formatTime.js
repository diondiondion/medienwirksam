function formatTime(totalSeconds) {
	if (!totalSeconds || totalSeconds === Infinity) return '0:00'

	const minutes = Math.floor(totalSeconds / 60)
	const seconds = Math.round(totalSeconds - minutes * 60)
	const leadingZero = seconds < 10 ? '0' : ''
	return `${minutes}:${leadingZero}${seconds}`
}

export default formatTime
