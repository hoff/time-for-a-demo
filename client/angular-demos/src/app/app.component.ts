// ng
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'

// rx
import 'rxjs/add/operator/filter'

// app
import { environment } from '../environments/environment'
import { BackendService } from './backend.service'
import { UIService } from './ui.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  mediaBar = false
  environment

  constructor(
    public backend: BackendService,
    public ui: UIService,
  ) {
    this.environment = environment
    this.ui.shortcutStream.filter(val => val === 'm').subscribe(() => {
      this.mediaBar = !this.mediaBar
    })
  }

  ngOnInit() {
  }
}
