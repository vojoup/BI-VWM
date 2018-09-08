import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  @Input() file;
  @Input() color: string;
  toggle = false;

  constructor(private _api: ApiService) {
  }

  loadArticle(): void {
    if (!this.file.article) {
      this._api.getAllDataForID(this.file.index).subscribe(res => this.file.article = res[0].content);
    }
  }

  toggleArticle(): void {
    this.loadArticle();
    this.toggle = !this.toggle;
  }

  ngOnInit() {
    console.log(this.file.id);
  }

}
