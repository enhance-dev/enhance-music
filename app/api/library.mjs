import albums from '../lib/albums.mjs'
import getCacheControl from '../lib/cacheControl.mjs'

export async function get (req) {
  const { session: prevSession } = req

  return {
    headers: {
      'cache-control': getCacheControl(),
    },
    json: {
      recent: albums,
    },
    session: {
      ...prevSession,
      album: null,
      track: prevSession.track || null,
    }
  }
}
