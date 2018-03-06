// ng
import { Component, OnInit, Input } from '@angular/core'
import {MatChipInputEvent} from '@angular/material'
import {ENTER, COMMA, TAB} from '@angular/cdk/keycodes'

// app
import { BackendService } from '../backend.service'
import { UIService } from '../ui.service'
import { Material } from '../interfaces'


@Component({
  selector: 'app-material-detail',
  templateUrl: './material-detail.component.html',
  styleUrls: ['./material-detail.component.css']
})
export class MaterialDetailComponent implements OnInit {

  @Input('material') material: Material

  // tags settings
  visible = true
  selectable = true
  removable = true
  addOnBlur = true
  separatorKeysCodes = [ENTER, COMMA, TAB]

  constructor(
    public backend: BackendService,
    public ui: UIService,
  ) { }

  ngOnInit() {
  }

  setAttribute(name: string, value: string) {
    this.material[name] = value
  }

  // tags
  add(event: MatChipInputEvent): void {
    const input = event.input
    const value = event.value

    // Add the tag
    if ((value || '').trim()) {
      this.material.tags.push(value.trim())
    }
    // Reset the input value
    if (input) {
      input.value = ''
    }
  }

  remove(tag: any): void {
    const index = this.material.tags.indexOf(tag)
    if (index >= 0) {
      this.material.tags.splice(index, 1)
    }
  }

}
