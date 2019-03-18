import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Post} from "../../models/Post";
import {HomePage} from "../home/home";
import {Camera} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {AngularFireStorage} from "angularfire2/storage";
import {PlacesProvider} from "../../providers/places/places";


@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {

  private previewImage: string = "";
  public postCollection: AngularFirestoreCollection<Post>;
  public postText: string = "";
  public coordinationText: string = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera,
              private location: Geolocation,
              private angularFire: AngularFirestore,
              private angularFireStorage: AngularFireStorage,
              private placesProvider: PlacesProvider) {
    this.postCollection = navParams.get("postCollection");
  }

  addPost() {
    let imageFileName = `${this.angularFire.app.auth().currentUser.email}_${new Date().getTime()}.png`;
    let task = this.angularFireStorage.ref(imageFileName).putString(this.previewImage, "base64", {contentType: "image/png"});

    let uploadEvent = task.downloadURL();

    uploadEvent.subscribe((uploadImageURL) => {
      this.postCollection.add(
        {
          body: this.postText,
          author: this.angularFire.app.auth().currentUser.email,
          location: this.coordinationText,
          imageURL: uploadImageURL
        } as Post);
    });

    this.postCollection.add({
      body: this.postText
    } as Post);
    this.postText = "";
    this.navCtrl.push(HomePage);
  }

  openCamera() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      cameraDirection: this.camera.Direction.BACK,
      correctOrientation: true
    }).then(imgBase64 => {
      this.previewImage = imgBase64;
    });
  }

  findGeolocation() {
    this.location.getCurrentPosition().then((pos) => {
      this.placesProvider.getAddressBasedOnLatLng(
        pos.coords.latitude,
        pos.coords.longitude
      ).then((place: any) => {
        this.coordinationText = place.results[1].formatted_address;
      }).catch((error) => {
        console.error(error);
      });
    })
  }
}
