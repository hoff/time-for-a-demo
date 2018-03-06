// ng
import { Component, OnInit, AfterViewInit, AfterContentInit, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { MatSnackBar } from '@angular/material'

// rx
import 'rxjs/add/operator/filter'

// app
import { BackendService } from '../backend.service'
import { StateService } from '../state.service'
import { UIService } from '../ui.service'
import { animations } from '../animations'
import { Material } from '../interfaces'


@Component({
  selector: 'app-materials-page',
  templateUrl: './materials-page.component.html',
  styleUrls: ['./materials-page.component.css'],
  animations: [
    animations.fadeInOut,
  ]
})
export class MaterialsPageComponent implements OnInit, AfterViewInit, AfterContentInit {

  @ViewChild('nextButton') nextButton: ElementRef

  mediaBar = false
  selectedMaterial: Material

  constructor(
    // ng
    public router: Router,
    public route: ActivatedRoute,
    public snackBar: MatSnackBar,
    // app
    public backend: BackendService,
    public state: StateService,
    public ui: UIService,
  ) {
    // infinity scroll mechanism
    window.onscroll = () => {
      if (!state.flags.infinityScroll) { return }
      const buttonFromTop = this.nextButton.nativeElement.getBoundingClientRect().top
      const eagerness = window.innerHeight * 2
      if (buttonFromTop < eagerness) {
        this.backend.loadMaterialsPage(this.state.materials.filter)
      }
    }
    this.ui.shortcutStream.filter(val => val === 'esc').subscribe(() => {
      this.closeModal()
    })
    this.ui.shortcutStream.filter(val => val === 'm').subscribe(() => {
      this.mediaBar = !this.mediaBar
    })
    this.ui.imageClickStream.subscribe(url => {
      this.selectedMaterial.imageURL = url
    })
  }

  ngOnInit() {
    // open material in modal if ID is present in current route
    this.route.params.take(1).subscribe(params => {
      const param = params.param
      if (param === 'list') { return }
      this.backend.loadMaterialById(param)
        .subscribe((reply: Material) => {
          this.selectMaterial(reply)
        })
   })
  }

  ngAfterViewInit() {
  }

  ngAfterContentInit() {
    setTimeout(() => {
      // initial loading
      this.backend.loadMaterialsPage(this.state.materials.filter)
      this.backend.loadImages()
    }, 0)
  }

  selectMaterial(material: Material) {
    this.selectedMaterial = material
    this.router.navigate(['/materials', material.id])
  }

  startMaterial() {
    this.selectedMaterial = {
      name: '',
      description: '',
      imageURL: '',
      articleID: '',
      customer: '',
      state: '',
      tags: [],
    }
  }

  closeModal() {
    this.selectedMaterial = undefined
    this.router.navigate(['/materials', 'list'])
  }

  applyFilter(filter: string) {
    this.backend.materials = []
    this.backend.nextMaterialsCursor = ''
    this.backend.firstPageLoaded = false
    this.state.materials.filter = filter
    this.backend.loadMaterialsPage(this.state.materials.filter)
  }

}
