import { Injectable } from '@angular/core'

// rx
import { Subject } from 'rxjs/Subject'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/fromEvent'

@Injectable()
export class UIService {

  shortcutStream = new Subject<'m' | 'esc' | 'd' | 's' | '+' >()
  imageClickStream = new Subject<string>()

  materialDetailModal = {
    thumbCount: new Array(10),
  }

  contentWidthPX = 1200
  contentPaddingPX = 20
  modalWidthPX = 1000
  modalPaddingPX = 50
  modalGutterPX = this.modalPaddingPX
  modalLaneWidthPX = (this.modalWidthPX - (this.modalPaddingPX + this.modalPaddingPX - this.modalGutterPX)) / 2

  constructor() {
    this.registerShortcuts()
  }

  registerShortcuts() {
    Observable.fromEvent(window, 'keydown').subscribe((event: KeyboardEvent) => {
      // console.log(event.keyCode)

      // esc
      if (event.keyCode === 27) {
        this.shortcutStream.next('esc')
      }
      // cmd + m
      if ((event.metaKey || event.ctrlKey) && event.keyCode === 77) {
        this.shortcutStream.next('m')
        event.preventDefault()
      }
    })
  }

  boardcastImageClick(url: string) {
    this.imageClickStream.next(url)
  }

}
