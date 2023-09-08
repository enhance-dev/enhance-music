export default function AlbumData ({ html, state }) {
  const { store } = state
  const { album, nav } = store

  const { track: selectedTrack = '' } = nav
  console.log({ selectedTrack })

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

      [aria-current="false"] .playing,
      [aria-current="true"] .index {
        display: none;
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
    </style>
    <article>
      <div class='meta flex flex-wrap align-items-center gap0 gap2-lg mb2'>
        <album-cover cover='${album.cover}'></album-cover>
        <header>
          <h2 class='text3 font-medium tracking-1 leading1'>${album.title}</h2>
          <p class='muted text1 mbe2'>${album.artist}</p>
          <p class='muted text-1'>${album.label || 'Self released'}, ${album.year}</p>
          ${bandcamp}
        </header>
      </div>

      <ol class='mb0 list-none'>
        ${album.tracklist.map((track, index) => `<li aria-current='${selectedTrack === `${album.id}-${index + 1}`}'>
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

    <script type='module'>
      // Show a play icon on the clicked track in a tracklist
      const tracks = document.querySelectorAll('li')
      const links = document.querySelectorAll('a[target="player"]')
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          const selectedTrack = e.target.closest('li')
          tracks.forEach(li => li.setAttribute('aria-current', 'false'))
          selectedTrack.setAttribute('aria-current', 'true')
        })
      })
    </script>
  `
}
