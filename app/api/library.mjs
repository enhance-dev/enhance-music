import albums from '../lib/albums.mjs'

export async function get (req) {
  const { session: prevSession } = req

  return {
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
