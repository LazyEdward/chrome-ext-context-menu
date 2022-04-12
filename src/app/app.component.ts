// https://stackoverflow.com/questions/47075437/cannot-find-namespace-name-chrome
/// <reference types="chrome"/>
import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, NgZone, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = 'Extended Context Menu';
  copyedEles: any = [];
  showInnerText: boolean = false;
  showHTML: boolean = false;

  constructor(private _ngZone: NgZone){}

  getCopyedEles(){
    chrome.storage.local.get("copies", (data) => {
      if (chrome.runtime.lastError) {
        console.log("runtime error: getCopyedEles")
        return;
      }

      if(data && data["copies"] && data["copies"].length > 0){
        console.log(data["copies"])
        this._ngZone.run(() => {
          this.copyedEles = data["copies"];
        })
      }
    })
  }

  ngOnInit() {
    this.getCopyedEles()
  }

  copy(text: string) {
		if (navigator && navigator.clipboard && navigator.clipboard.writeText){
			navigator.clipboard.writeText(text);
		}
  }

}
