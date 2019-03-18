function formatTime(totalSeconds) {
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = Math.floor(totalSeconds - minutes * 60)
	const leadingZero = seconds < 10 ? '0' : ''
	return `${minutes}:${leadingZero}${seconds}`
}

export default formatTime
