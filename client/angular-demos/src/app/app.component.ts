// ng
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'

// rx
import 'rxjs/add/operator/filter'

// app
import { BackendService } from './backend.service'
import { UIService } from './ui.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  mediaBar = false

  constructor(
    public backend: BackendService,
    public ui: UIService,
  ) {
    this.ui.shortcutStream.filter(val => val === 'm').subscribe(() => {
      this.mediaBar = !this.mediaBar
    })
  }

  ngOnInit() {
  }
}
