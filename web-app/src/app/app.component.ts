import { Component } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { JsonService } from './service/json.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Param } from './class/Param';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'dev test';
  prevText = '<< Previous'
  nextText = 'Next >>'
  imgURL!: string;
  searchAllFormGroup!: FormGroup;
  showIaImage = false;
  showGeneratingImage = false;
  showLoadingAlbums = false;
  selectedImg!: any;
  showErrorMessage = false;

  _albums: any = [];

  currentPage = 1;

  constructor(private _lightbox: Lightbox,
    private jsonService: JsonService,
    private _snackBar: MatSnackBar) {

    this.searchAllFormGroup = new FormGroup({

      title: new FormControl(''),
      albumTitle: new FormControl(''),
      userEmail: new FormControl('', Validators.email),
      perPage: new FormControl(''),

    });




    /*for (let i = 1; i <= 12; i++) {
      const src = './assets/images/image' + i + '.jpg';
      const caption = 'Image ' + i + ' caption';
      const thumb = './assets/images/thumbs/image' + i + '.jpg';
      const album = {
        src: src,
        caption: caption,
        thumb: thumb
      };

      this._albums.push(album);
    }*/
  }

  open(index: number): void {
    this.showErrorMessage = false;
    this.showIaImage = true;
    this.showGeneratingImage = true;
    this.imgURL = "";
    // open lightbox
    //this._lightbox.open(this._albums, index, { fitImageInViewPort: true, showZoom: true });
    //console.log(this._albums[index].img);
    this.selectedImg = this._albums[index].img;

    this.jsonService.createImage(this._albums[index].img.album.title).toPromise().then(res => {
      //console.log(res)

      //this.imgURL =  res.
      this.imgURL = res.data[0].url;
      this.showGeneratingImage = false;

    }).catch(err => {
      this.showErrorMessage = true;
      console.error(err)
    });
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
    this.imgURL = "";
  }

  goBack() {

    this.showIaImage = false;
  }


  next() {
    this.currentPage++;

    this.blur();
  }
  previous() {
    if (this.currentPage > 1) {

      this.blur();
    }



  }


  blur() {

    this._albums = [];
    const params: Param[] = [];

    if (this.searchAllFormGroup.get('title')?.value || this.searchAllFormGroup.get('albumTitle')?.value || (this.searchAllFormGroup.get('userEmail')?.valid && this.searchAllFormGroup.get('userEmail')?.value)) {

      if (this.searchAllFormGroup.get('title')?.value) {

        params.push({ 'title': this.searchAllFormGroup.get('title')?.value });

      }

      if (this.searchAllFormGroup.get('albumTitle')?.value) {

        params.push({ 'album.title': this.searchAllFormGroup.get('albumTitle')?.value });
      }


      if (this.searchAllFormGroup.get('userEmail')?.valid) {

        params.push({ 'album.user.email': this.searchAllFormGroup.get('userEmail')?.value });
      }

      if (this.searchAllFormGroup.get('perPage')?.value && this.searchAllFormGroup.get('perPage')?.valid) {

        params.push({ offset: String((this.currentPage - 1) * this.searchAllFormGroup.get('perPage')?.value + 1) });
        params.push({ limit: String(this.searchAllFormGroup.get('perPage')?.value) });
      }
      else {
        params.push({ offset: String((this.currentPage - 1) * 25 + 1) });
        params.push({ limit: String(25) });
      }


      this.showLoadingAlbums = true;
      this.jsonService.getPhotos(params).toPromise().then(
        result => {

          if (result?.length == 0) {
            this._snackBar.open('No photos to show.', '', {
              duration: 3000
            });
          }
          //console.log(result);
          result?.forEach(img => {


            const src = img.thumbnailUrl;
            const caption = "Tittle: " + img.title
              + '</p> Album: ' + img.album.title
              + '</p> User name: ' + img.album.user.name;
            +'</p> Email: ' + img.album.user.email;
            const thumb = img.thumbnailUrl;
            const album = {
              src: src,
              caption: caption,
              thumb: thumb,
              img: img
            };

            this._albums.push(album);
          });
          this.showLoadingAlbums = false;
        }

      ).catch(err => {
        this.showErrorMessage = true;
        console.log(err);
      });
    }
  }
}
