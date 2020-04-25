export function getArtistLink(artist) {
	if (!artist?.fields?.slug) return null

	return `/artist${artist.fields.slug}`
}

export function getPlaylistLink(playlist) {
	if (!playlist?.fields?.slug) return null

	return `/playlist${playlist.fields.slug}`
}

export function getTrackLink(track) {
	if (!track?.fields?.slug) return null

	return `/track${track.fields.slug}`
}
