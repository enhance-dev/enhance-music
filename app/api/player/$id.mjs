export async function get (req) {
  const { session: prevSession } = req
  const { id } = req.pathParameters

  return {
    json: {
      track: 'tracks/arttr.mp3',
    },
    session: {
      ...prevSession,
      track: id,
    }
  }
}
