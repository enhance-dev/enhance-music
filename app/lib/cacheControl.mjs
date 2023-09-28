export default function getCacheControl () {
  return process.env.ARC_ENV === 'production'
    // 10 mins
    ? 'max-age=600'
    : 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
}
