/** This file must be served from the root of the site in order to cache files in the root.
 * @type {import('@enhance/types').EnhanceApiFn} */
export async function get() {
  return {
    body: `importScripts(
          'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
        );

        const {registerRoute} = workbox.routing;
        const {CacheFirst} = workbox.strategies;
        const {CacheableResponse} = workbox.cacheableResponse;

        registerRoute(
          ({request}) => {
            const {destination} = request;
            return destination === 'video' || destination === 'audio'
          },
          new CacheFirst({
            plugins: [new workbox.cacheableResponse.CacheableResponsePlugin({statuses: [0, 200]})],
          })
        );`,
    headers: { 'content-type': 'text/javascript' },
  };
}
