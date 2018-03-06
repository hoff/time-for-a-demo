// ng
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { MatSnackBar } from '@angular/material'

// rx
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import { delay } from 'rxjs/operators/delay'

// app
import { environment } from '../environments/environment'


@Injectable()
export class BackendService {

  environment
  assetsURL = environment.assetsURL

  backendHost = environment.backendHost
  apiURL = this.backendHost + '/api/'
  backendDelay = environment.backendDelay

  materials = []
  images = []
  moreMaterials = false
  materialsLoading = false
  nextMaterialsCursor: string
  firstPageLoaded = false

  flags = {
    infinityScroll: true
  }

  materialOptions = {
    // current filter
    filter: 'All',
    states: [
      'All',
      'New',
      'Scanning',
      'Image Processing',
      'Shading',
      'Completed',
    ],
    customers: [
      'JOOP!',
      'Rolf Benz',
    ],
    allowAdding: false
  }

  constructor(
    public http: HttpClient,
    public snackBar: MatSnackBar,
  ) {
    this.environment = environment
  }

  // move to ui
  placeholderImg() {
    return this.assetsURL + 'black_placeholder.jpg'
  }

  loadMaterialsPage(filter: string) {
    if (this.materialsLoading || (!this.moreMaterials && this.firstPageLoaded )) { return }
    this.materialsLoading = true
    this.http.get(this.apiURL + 'materials', {params: {filter: filter, cursor: this.nextMaterialsCursor ? this.nextMaterialsCursor : '' }})
      .pipe(delay(this.backendDelay))
      .subscribe((reply: any) => {
        this.materials = this.materials.concat(reply.data)
        this.moreMaterials = reply.more
        this.nextMaterialsCursor = reply.next_cursor
        this.materialsLoading = false
        this.firstPageLoaded = true
      })
  }

  loadMaterialById(id) {
    return this.http.get(this.apiURL + 'material?id=' + id)
      .pipe(delay(this.backendDelay))
  }

  saveMaterial(material) {
    const materialData = this.materialToObject(material)
    this.http.post(this.apiURL + 'materials', materialData)
    .pipe(delay(this.backendDelay))
    .subscribe(reply => {
      this.snackBar.open('The material has been saved.', '', {duration: 2000})
    })
  }

  createMaterial(material) {
    const materialData = this.materialToObject(material)
    this.http.put(this.apiURL + 'materials', materialData)
    .pipe(delay(this.backendDelay))
    .subscribe((reply: any) => {
      this.snackBar.open('The material has been created.', '', {duration: 2000})
    })
  }

  // load images
  loadImages() {
    this.http.get(this.apiURL + 'images')
      .pipe(delay(this.backendDelay))
      .subscribe((reply: any) => {
        this.images = reply
      })
  }

  materialToObject(material) {
    return {
      id: material.id,
      name: material.name,
      description: material.description,
      imageURL: material.imageURL,
      state: material.state,
      articleID: material.articleID,
      customer: material.customer,
      tags: material.tags,
    }
  }

  // image upload
  uploadFile(file: File): Observable<any> {
    return Observable.create(progressStream => {

      const formData: FormData = new FormData()
      const xhr: XMLHttpRequest = new XMLHttpRequest()

      // uploads[] is how we pick things up in the backend
      formData.append('uploads[]', file, file.name)

      // listen to server response
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const imageInfo = JSON.parse(xhr.response)
            progressStream.next(100)
            progressStream.complete()
          } else {
            progressStream.error(xhr.response)
          }
        }
      }
      // request an upload URL, then kick off upload
      this.http.get(this.backendHost + '/api/image/upload-url').subscribe((data: any) => {
        xhr.open('POST', data.url, true)
        xhr.send(formData)
      })
    })
  }
}
