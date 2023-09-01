export default function AudioPlayer ({ html, state }) {
  const { store } = state
  const { track } = store

  return html`
    <style scope='global'>
      /* Targets iframe's document */
      html,
      body {
        block-size: 100%;
      }
    </style>
    <style>
      :host {
        display: block;
        background: white;
        border-block-start: 1px solid gainsboro;
      }

      [aria-pressed='false'] .pause {
        display: none;
      }

      [aria-pressed='true'] .play {
        display: none;
      }

      [name='playback'] {
        aspect-ratio: 1 / 1;
        inline-size: 2em;
        background: var(--purple);
      }

      .play {
        inset-inline-start: 0.05em;
      }

      input {
        accent-color: var(--purple);
      }
    </style>
    <figure id='player' class='align-items-center justify-content-center gap-2 mb-2 hidden'>
      <button
        name='playback'
        aria-pressed='false'
        aria-label='Toggle playback'
        class='radius-100 flex align-items-center justify-content-center'
      >
        <img src='/_public/icons/play.svg' alt='play' class='play relative' />
        <img src='/_public/icons/pause.svg' alt='pause' class='pause' />
      </button>
      <span id='currentTime' class='numeric text-2'>00:00</span>
      <input type='range' name='timeline' min='0' max='100' step='1' value='0' />
      <span id='duration' class='numeric text-2'>00:00</span>
      <audio id='client-audio' src='${track}'></audio>
    </figure>

    <figure id='systemUi' class='flex justify-content-center align-items-center sb-100'>
      <audio autoplay controls src='${track}'></audio>
    </figure>

    <script type='module'>
      import formatTime from '/_public/browser/formatTime.mjs'

      class AudioPlayer extends HTMLElement {
        constructor() {
          super()

          // Properties
          this.player = document.getElementById('player')
          this.systemUi = document.getElementById('systemUi')
          this.audio = document.getElementById('client-audio')
          this.duration = this.audio.duration
          this.playback = this.querySelector('[name="playback"]')
          this.timeline = this.querySelector('[name="timeline"]')
          this.currentTimeDisplay = document.getElementById('currentTime')
          this.durationDisplay = document.getElementById('duration')
        }

        connectedCallback() {
          this.systemUi.remove()
          this.player.classList.replace('hidden', 'flex')

          // Event listeners
          this.audio.addEventListener('loadedmetadata', this.handleMetadata)
          this.playback.addEventListener('click', this.handlePlayback)
          this.audio.addEventListener('canplaythrough', this.handlePlayback)
          this.audio.addEventListener('timeupdate', this.handleTimeUpdate)
          this.audio.addEventListener('ended', this.handleEnded)
          this.timeline.addEventListener('input', this.handleTimelineInput)
          this.timeline.addEventListener('change', this.handleTimelineChange)
        }

        handleMetadata = () => {
          this.duration = this.audio.duration
          this.timeline.setAttribute('max', this.audio.duration)
          console.log(this.audio.duration)
          this.durationDisplay.innerText = formatTime(this.duration)
        }

        handlePlayback = () => {
          const state = this.playback.getAttribute('aria-pressed') === 'true'
          const nextState = !state
          this.playback.setAttribute('aria-pressed', nextState)
          nextState ? this.audio.play() : this.audio.pause()
        }

        handleTimeUpdate = () => {
          // console.log('updated time', this.audio.currentTime)
          this.timeline.value = this.audio.currentTime
          this.currentTimeDisplay.innerText = formatTime(this.audio.currentTime)
        }

        handleTimelineInput = (e) => {
          // Don't update timeline value when seeking
          // console.log('input time', e.target.value)
          this.audio.removeEventListener('timeupdate', this.handleTimeUpdate)
        }

        handleTimelineChange = (e) => {
          const newTime = Number(e.target.value)
          // console.log('changed time', newTime)
          this.timeline.value = newTime
          this.audio.currentTime = newTime
          // Start updating timeline value again
          this.audio.addEventListener('timeupdate', this.handleTimeUpdate)
        }

        handleEnded = () => {
          this.playback.setAttribute('aria-pressed', false)
        }
      }

      customElements.define('audio-player', AudioPlayer)
    </script>
  `
}
