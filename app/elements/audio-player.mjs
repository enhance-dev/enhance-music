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

      [aria-pressed='false'] .pause {
        display: none;
      }

      [aria-pressed='true'] .play {
        display: none;
      }
    </style>
    <figure id='player' class='justify-content-center align-items-center hidden'>
      <button name='playback' aria-pressed='false' aria-label='Toggle playback'>
        <img src='/_public/icons/play.svg' alt='play' class='play' />
        <img src='/_public/icons/pause.svg' alt='pause' class='pause' />
      </button>
      <input type='range' name='timeline' min='0' max='100' step='1' value='0' />
      <audio id='client-audio' src='${track}'></audio>
    </figure>

    <figure id='systemUi' class='flex justify-content-center align-items-center sb-100'>
      <audio autoplay controls src='${track}'></audio>
    </figure>

    <script type='module'>
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

          // Bindings
          this.handleMetadata = this.handleMetadata.bind(this)
          this.handlePlayback = this.handlePlayback.bind(this)
          this.handleTimeUpdate = this.handleTimeUpdate.bind(this)
          this.handleTimelineInput = this.handleTimelineInput.bind(this)
          this.handleTimelineChange = this.handleTimelineChange.bind(this)
        }

        connectedCallback() {
          this.systemUi.remove()
          this.player.classList.replace('hidden', 'flex')

          // Event listeners
          this.audio.addEventListener('loadedmetadata', this.handleMetadata)
          this.playback.addEventListener('click', this.handlePlayback)
          this.audio.addEventListener('timeupdate', this.handleTimeUpdate)
          this.timeline.addEventListener('input', this.handleTimelineInput)
          this.timeline.addEventListener('change', this.handleTimelineChange)
        }

        handleMetadata() {
          this.duration = this.audio.duration
          this.timeline.setAttribute('max', this.audio.duration)
        }

        handlePlayback() {
          const state = this.playback.getAttribute('aria-pressed') === 'true'
          const nextState = !state
          this.playback.setAttribute('aria-pressed', nextState)
          nextState ? this.audio.play() : this.audio.pause()
        }

        handleTimeUpdate() {
          // console.log('updated time', this.audio.currentTime)
          this.timeline.value = this.audio.currentTime
        }

        handleTimelineInput(e) {
          // Don't update timeline value when seeking
          // console.log('input time', e.target.value)
          this.audio.removeEventListener('timeupdate', this.handleTimeUpdate)
        }

        handleTimelineChange(e) {
          const newTime = Number(e.target.value)
          // console.log('changed time', newTime)
          this.timeline.value = newTime
          this.audio.currentTime = newTime
          // Start updating timeline value again
          this.audio.addEventListener('timeupdate', this.handleTimeUpdate)
        }
      }

      customElements.define('audio-player', AudioPlayer)
    </script>
  `
}
