import albums from '../../lib/albums.mjs'
import getCacheControl from '../../lib/cacheControl.mjs'

export const get = [async function get (req) {
  const { session: prevSession } = req
  const { id } = req.pathParameters
  const album = albums.find(album => album.id === Number(id))

  return {
    headers: {
      'cache-control': getCacheControl(),
    },
    json: {
      album,
    },
    session: {
      ...prevSession,
      album: id
    }
  }
}]
