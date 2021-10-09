import { Controller } from "@hotwired/stimulus"
import detectFormat from "../lib/detect_format"
import ChordSheetFormatter  from "../lib/chord_sheet_formatter"

export default class extends Controller {
  static targets = ["source", "output", "chords"]

  connect() {
    this.render()
  }

  initialize() {
    this.chordTemplate = this.chordsTarget.querySelector('template')
  }

  render() {
    this.song = this.format.parse(this.source)
    this.outputTarget.innerHTML = new ChordSheetFormatter().format(this.song)

    // Set column width to width of rendered output
    document.documentElement.style.setProperty('--column-width', this.outputTarget.clientWidth + "px")

    this.chords.forEach(chord => {
      const template = this.chordTemplate.content.cloneNode(true).firstElementChild
      template.dataset.name = chord

      this.chordsTargets.forEach(chords => {
        const chord = template.cloneNode(true)
        chord.dataset.instrument = chords.dataset.instrument
        chords.appendChild(chord)
      })
    })
  }

  get source() {
    return this.sourceTarget.value || this.sourceTarget.innerHTML
  }

  get format() {
    return detectFormat(this.source)
  }

  // Return names of chords used
  get chords() {
    let chords = []
    this.song.lines.forEach(line => {
      line.items.forEach(item => {
        if(item.chords && chords.indexOf(item.chords) == -1) {
          chords.push(item.chords)
        }
      })
    })
    return chords
  }
}
