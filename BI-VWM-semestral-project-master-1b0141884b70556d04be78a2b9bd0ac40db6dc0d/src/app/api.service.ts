import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class ApiService {

  constructor(private _http: Http) {
  }

  getAllDataForID(id: string) {
    return this._http.get('api/allData/' + id).map(result => result.json().data);
  }

  getInvertedListForTitle(title: string) {
    return this._http.get('api/invertedList/' + title).map(result => result.json());
  }

  findSequentially(title: string) {
    return this._http.get('api/sequentialSearch/' + title).map(result => result.json());
  }

}
