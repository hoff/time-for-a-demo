// ng
import { Component, OnInit, Output, EventEmitter } from '@angular/core'

// app
import { UIService } from '../ui.service'
import { animations } from '../animations'

@Component({
  selector: 'app-modal-overlay',
  templateUrl: './modal-overlay.component.html',
  styleUrls: ['./modal-overlay.component.css'],
  animations: [
    animations.fadeInOut,
  ]
})
export class ModalOverlayComponent implements OnInit {

  @Output('close') close = new EventEmitter()

  constructor(
    public ui: UIService,
  ) { }

  ngOnInit() {
  }

}
