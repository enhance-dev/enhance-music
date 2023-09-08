export async function get (req) {
  const { session: prevSession } = req
  const { id } = req.pathParameters

  return {
    json: {
      track: `tracks/${id}.mp3`,
    },
    session: {
      ...prevSession,
      track: id,
    }
  }
}
