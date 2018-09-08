import {Component, OnInit} from '@angular/core';

import {ApiService} from '../api.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  data: Array<any> = [];
  files: Array<any> = [];
  searched: boolean;
  gotResults: boolean;
  color: string;
  loading: boolean;
  time: number;

  constructor(private _api: ApiService) {
  }

  ngOnInit() {
  }

  search(inputValue: string): number {
    if (inputValue === '') {
      this.searched = true;
      this.loading = false;
      this.gotResults = false;
      return 0;
    }
    this.loading = true;
    this.files = [];
    inputValue = inputValue.toLowerCase();

    this._api.getInvertedListForTitle(inputValue).subscribe(res => {
      console.log(res);
      this.files = res.data;
      this.loading = false;
      this.gotResults = this.files.length !== 0;
      this.searched = true;
      this.time = res.time;
      this.color = '3498db8f';
    });

    return this.time;
  }

  findSequentially(inputValue: string): number {
    if (inputValue === '') {
      this.searched = true;
      this.loading = false;
      this.gotResults = false;
      return 0;
    }
    this.loading = true;
    this.files = [];
    inputValue = inputValue.toLowerCase();

    this._api.findSequentially(inputValue).subscribe(res => {
      this.files = res.data;
      this.loading = false;
      this.gotResults = this.files.length !== 0;
      this.searched = true;
      this.time = res.time;
      this.color = '00c176';
    });

    return this.time;
  }

}
