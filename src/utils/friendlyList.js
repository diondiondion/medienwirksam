function friendlyList(items, {lastSeparator} = {}) {
	if (!items || items.length === 0) return null

	if (items.length === 1) return items[0]

	const lastItem = items[items.length - 1]
	const allButLastItems = items.slice(0, -1).join(', ')
	return [allButLastItems, lastItem].join(lastSeparator || ' und ')
}

export default friendlyList
