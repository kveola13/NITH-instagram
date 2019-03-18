import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFirestore, AngularFirestoreCollection} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";
import {Post} from "../../models/Post";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public collection: AngularFirestoreCollection<Post>;
  public posts: Observable<Post[]>;

  constructor(public navCtrl: NavController, private angularFireStore: AngularFirestore) {
    this.collection = this.angularFireStore.collection<any>("posts");
    this.posts = this.collection.snapshotChanges().map(actions => {
      return actions.map(action => {
        let data = action.payload.doc.data() as Post;
        let id = action.payload.doc.id;

        return {
          id,
          ...data,
        };
      })
    });
  }

  goToAddPostPage(){
    this.navCtrl.push("AddPostPage", {
      postCollection: this.collection
    });
  }

  goToDetailsPage(post: Post) {
    this.navCtrl.push("DetailPage", {
      post,
      postCollection: this.collection
    });
  }
  logOut(){
    this.angularFireStore.app.auth().signOut();
  }
}
