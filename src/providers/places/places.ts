import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';


@Injectable()
export class PlacesProvider {
  private GOOGLE_API_KEY = "AIzaSyC_RjdY3pvPn_STsoW2bKfPMAJZsQWCP9s";

  constructor(public http: HttpClient) {

  }

  getAddressBasedOnLatLng(lat: number, lng: number) {
    return new Promise((resolve, reject) => {
      this.http.get
      (`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=${this.GOOGLE_API_KEY}`)
        .subscribe(
          (data) => {
            resolve(data);
          }, error => {
            reject(error);
          });
    });
  }
}
