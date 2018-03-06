// ng
import { Injectable } from '@angular/core'

// rx
import { Subject } from 'rxjs/Subject'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/fromEvent'

/**
 * This service holds UI related information,
 * and provides a keyboard-shortcut stream.
 */
@Injectable()
export class UIService {

  // shortcut and image-click stream
  shortcutStream = new Subject<'m' | 'esc' | 'd' | 's' | '+' >()
  imageClickStream = new Subject<string>()

  // layout dimensions
  contentWidthPX = 1200
  contentPaddingPX = 20
  modalWidthPX = 1000
  modalPaddingPX = 50
  modalGutterPX = this.modalPaddingPX
  modalLaneWidthPX = (this.modalWidthPX - (this.modalPaddingPX + this.modalPaddingPX - this.modalGutterPX)) / 2
  mediaBarShown = false

  constructor() {
    this.registerShortcuts()
  }

  /**
   * creates a stream of a small set of keyboard shortcuts
   */
  registerShortcuts() {

    Observable.fromEvent(window, 'keydown').subscribe((event: KeyboardEvent) => {
      // esc
      if (event.keyCode === 27) {
        this.shortcutStream.next('esc')
      }
      // cmd + m
      if ((event.metaKey || event.ctrlKey) && event.keyCode === 77) {
        this.shortcutStream.next('m')
        this.mediaBarShown = !this.mediaBarShown
        event.preventDefault()
      }
    })
  }

  /**
   * Passes an image url down the imageClickStream
   */
  boardcastImageClick(url: string) {
    this.imageClickStream.next(url)
  }

}
