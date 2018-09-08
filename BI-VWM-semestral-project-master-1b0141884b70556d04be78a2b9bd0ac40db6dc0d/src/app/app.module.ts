import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ApiService} from './api.service';
import {HttpModule} from '@angular/http';
import {SearchBarComponent} from './search-bar/search-bar.component';
import {SearchResultsComponent} from './search-bar/search-results/search-results.component';
import {SearchResultComponent} from './search-bar/search-results/search-result/search-result.component';
import {ArticleComponent} from './search-bar/search-results/search-result/article/article.component';
import {SpinnerComponent} from './spinner/spinner.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    SearchResultsComponent,
    SearchResultComponent,
    ArticleComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
