import albums from '../../lib/albums.mjs'
import getCacheControl from '../../lib/cacheControl.mjs'

export const get = [async function get (req) {
  const { session: prevSession } = req
  const { id } = req.pathParameters

  // `id` formatted as 'N1-N2' where N1 is the numeric album ID,
  // and N2 is the numeric track number
  const [, albumId, trackId] = /([0-9]+)-([0-9]+)/.exec(id)
  if (!albumId || !trackId) {
    throw new Error(`Id '${id}' was not of the format <albumNum>-<trackNum>`)
  }

  const album = albums.find(album => album.id == albumId)
  const track = album?.tracklist[trackId - 1]

  return {
    headers: {
      'cache-control': getCacheControl(),
    },
    json: {
      track: `tracks/${id}.mp3`,
      trackArtist: album?.artist || '',
      trackTitle: track?.title || '',
      trackCover: album?.cover || '',
    },
    session: {
      ...prevSession,
      track: id,
    }
  }
}]
