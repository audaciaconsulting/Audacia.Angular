import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AudaciaBaseUrlModule } from '@audacia/base-url-interceptor';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AudaciaBaseUrlModule.forRoot({
      config: {
        baseUrl: "http://www.omdbapi.com"
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
