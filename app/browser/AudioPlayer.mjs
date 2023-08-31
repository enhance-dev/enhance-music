/* globals window document HTMLElement customElements */
class AudioPlayer extends HTMLElement {
  constructor() {
    super()

    // Properties
    this.player = document.getElementById('player')
    this.systemUi = document.getElementById('systemUi')
    this.audio = document.getElementById('client-audio')
    this.raf = null
    this.duration = this.audio.duration
    this.playback = this.querySelector('[name="playback"]')
    this.timeline = this.querySelector('[name="timeline"]')

    // Bindings
    this.handleMetadata = this.handleMetadata.bind(this)
    this.handlePlayback = this.handlePlayback.bind(this)
    this.handleTimelineInput = this.handleTimelineInput.bind(this)
    this.handleTimelineChange = this.handleTimelineChange.bind(this)
    this.whilePlaying = this.whilePlaying.bind(this)
  }

  whilePlaying() {
    this.timeline.value = this.audio.currentTime
    this.raf = window.requestAnimationFrame(this.whilePlaying)
  }

  connectedCallback() {
    this.systemUi.remove()
    this.player.classList.remove('hidden')
    this.player.classList.add('flex')

    // Event listeners
    this.audio.addEventListener('loadedmetadata', this.handleMetadata)
    this.playback.addEventListener('click', this.handlePlayback)
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
    if (nextState) {
      this.audio.play()
      window.requestAnimationFrame(this.whilePlaying)
    } else {
      this.audio.pause()
      window.cancelAnimationFrame(this.whilePlaying)
    }
  }

  handleTimelineInput(e) {
    // Don't update timeline value when seeking
    console.log('input time', e.target.value)
    !this.audio.paused && window.cancelAnimationFrame(this.raf)
  }

  handleTimelineChange(e) {
    const newTime = Number(e.target.value)
    console.log('changed time', newTime)
    this.audio.currentTime = newTime
    !this.audio.paused && window.requestAnimationFrame(this.whilePlaying)
  }
}

customElements.define('audio-player', AudioPlayer)
