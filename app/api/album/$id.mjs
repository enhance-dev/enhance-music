import albums from '../../lib/albums.mjs'

export async function get (req) {
  const { session: prevSession } = req
  const { id } = req.pathParameters
  const album = albums.find(album => album.id === Number(id))

  return {
    json: {
      album,
    },
    session: {
      ...prevSession,
      album: id
    }
  }
}
