// ng
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

// rx
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import { delay } from 'rxjs/operators/delay'

// app
import { environment } from '../environments/environment'


@Injectable()
export class BackendService {

  backendHost = environment.backendHost
  apiURL = this.backendHost + '/api/'
  backendDelay = environment.backendDelay

  materials = []
  images = []
  moreMaterials = false
  materialsLoading = false
  nextMaterialsCursor: string
  firstPageLoaded = false

  constructor(
    public http: HttpClient
  ) { }

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

  // quick and dirty way of creating a material
  createMaterial(options) {
    this.http.put(this.apiURL + 'materials', {
      name: options.name
    })
    .pipe(delay(this.backendDelay))
    .subscribe((reply: any) => {
      // nothing here:)
    })
  }

  saveMaterial(material) {
    console.log('save!')
    this.http.post(this.apiURL + 'materials', {
      id: material.id,
      name: material.name,
      description: material.description,
      imageURL: material.imageURL,
      state: material.state,
      articleID: material.articleID,
      customer: material.customer,
      tags: material.tags,
    })
    .pipe(delay(this.backendDelay))
    .subscribe(reply => {
      // material has been saved
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

  // image upload
  uploadFile(file: File): Observable<any> {
    return Observable.create(progressStream => {

      const formData: FormData = new FormData()
      const xhr: XMLHttpRequest = new XMLHttpRequest()

      // uploads[] is how we pick things up in the backend
      formData.append('uploads[]', file, file.name)

      // on progress
      xhr.addEventListener('progress', event => {
        const percent = Math.ceil((event.loaded / event.total) * 100)
        progressStream.next(percent)
      })

      // listen to a success message from the server
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
