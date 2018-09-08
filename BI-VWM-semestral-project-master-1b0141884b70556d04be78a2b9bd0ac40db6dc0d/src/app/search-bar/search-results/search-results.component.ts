import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  @Input() files: Array<any>;
  @Input() time: number;
  @Input() color: string;

  constructor() {
  }

  ngOnInit() {
    console.log(this.files);
  }

}
