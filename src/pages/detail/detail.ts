import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Post} from "../../models/Post";
import {AngularFirestoreCollection} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  public post: Post;
  public postCollection: AngularFirestoreCollection<Post>;
  public comments: Observable<any[]>;
  public commentInput: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.post = this.navParams.get("post");
    this.postCollection = this.navParams.get("postCollection");
    this.comments = this.postCollection
      .doc(this.post.id)
      .collection("subCollection")
      .valueChanges();
  }

  addComment() {
    this.postCollection
      .doc(this.post.id)
      .collection("subCollection")
      .add({
        body: this.commentInput
      });
    this.commentInput = "";
  }
}
