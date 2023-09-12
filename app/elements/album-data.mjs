export default function AlbumData ({ html, state }) {
  const { store } = state
  const { album, nav = {} } = store

  const { track = '' } = nav

  const bandcamp = album.bandcamp
    ? `<p class='muted text-1'><a href='${album.bandcamp}' class='underline' target='_blank'>Stream & purchase on Bandcamp</a></p>`
    : ''

  return html`
    <style>
      :host {
        display: block;
        padding-block-end: var(--playerHeight);
      }

      li {
        border-bottom: 1px solid gainsboro;
      }

      li:first-of-type {
        border-top: 1px solid gainsboro;
      }

      .playing,
      [aria-current="true"] .index {
        display: none;
      }

      [aria-current="true"] .playing {
        display: inline;
      }

      .playing {
        color: var(--purple);
      }

      a {
        grid-template-columns: 4ch 1fr 10ch;
        transition: color 0.3s var(--easeOutQuint);
      }

      a:hover {
        color: var(--purple);
      }

      a:focus-visible {
        outline-offset: 2px;
      }

      album-cover {
        flex: 1 0 150px;
      }

      header {
        min-inline-size: 66%;
      }

      .playButton {
        background-color: #eee;
        border-radius: 0.25em;
        color: var(--purple);
        transition: color 0.5s var(--easeOutQuint);
      }

      .playButton:hover {
        color: var(--dark);
      }

    </style>
    <article>
      <div class='meta flex flex-wrap align-items-center gap0 gap2-lg mb2'>
        <album-cover cover='${album.cover}' id='${album.id}'></album-cover>
        <header>
          <h2 class='text3 font-medium tracking-1 leading1'>${album.title}</h2>
          <p class='muted text1 mbe2'>${album.artist}</p>
          <p class='muted text-1'>${album.label || 'Self released'}, ${album.year}</p>
          ${bandcamp}
          <div class='mbs2'>
            <a href='/player/${album.id}-1' target='player' class='playButton font-medium p-2 js-playButton'>
              <span class='pie-8'>&#9654;</span> Play
            </a>
          </div>
        </header>
      </div>

      <ol class='mb0 list-none'>
        ${album.tracklist.map((track, index) => `<li data-track='${album.id}-${index + 1}'>
          <a class='pb-4 grid flow-col align-items-baseline' href='/player/${album.id}-${index + 1}' target='player'>
            <span class='text-1 muted numeric index'>${index + 1}</span>
            <span class='playing'>&#9654;</span>
            <span>
              ${track.title}
            </span>
            <span class='muted numeric text-1 text-end'>
              ${track.duration}
            </span>
          </a>
        </li>`).join('')}
      </ol>
    </article>

    <script id='initial-state' type='application/json'>
      { "track": "${track}" }
    </script>

    <script type='module'>
      const tracks = document.querySelectorAll('li')
      const { track: initialTrack = '' } = JSON.parse(document.getElementById('initial-state').textContent)

      function setCurrent (items, current) {
        items.forEach(item => item.setAttribute('aria-current', item.dataset.track === current))
      }

      // Set initial current track based on initial state
      setCurrent(tracks, initialTrack)

      // Update current track when the play button is clicked
      document.querySelector('.js-playButton').addEventListener('click', () => {
        setCurrent(tracks, tracks[0].dataset.track)
      })

      // Update current track when a new track is selected
      const trackLinks = document.querySelectorAll('[data-track]')
      trackLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const clickedTrack = e.target.closest('li').dataset.track
          setCurrent(tracks, clickedTrack)
        })
      })
    </script>
  `
}
