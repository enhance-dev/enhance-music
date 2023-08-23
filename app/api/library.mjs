import albums from '../lib/albums.mjs'

export async function get () {
  return {
    json: {
      recent: albums,
    }
  }
}
