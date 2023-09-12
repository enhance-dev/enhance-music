import albums from '../../lib/albums.mjs'

export async function get (req) {
  const { session: prevSession } = req
  const { id } = req.pathParameters

  // `id` formatted as 'N1-N2' where N1 is the single digit album ID,
  // and N2 is the single digit track number
  const [albumId, , trackId] = id

  const album = albums.find(album => album.id == albumId)
  const track = album.tracklist[trackId - 1]

  return {
    json: {
      track: `tracks/${id}.mp3`,
      trackArtist: album.artist,
      trackTitle: track.title,
      trackCover: album.cover,
    },
    session: {
      ...prevSession,
      track: id,
    }
  }
}
