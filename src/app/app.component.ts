// https://stackoverflow.com/questions/47075437/cannot-find-namespace-name-chrome
/// <reference types="chrome"/>
import {Component, OnInit,  NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = 'Extended Context Menu';
  onload: boolean = true;
  copyedEles: any = [];
  showTextContent: boolean = false;
  showHTML: boolean = false;

  constructor(private _ngZone: NgZone){}


  ngOnInit() {
    this._ngZone.run(() => {
      this.onload = true;
    })

    this.getCopyedEles()
  }

  getCopyedEles(){
    // for local test
    // this.copyedEles = [
    //     {
    //       html: "<div>For test</div>",
    //       text: "For test",
    //       textContent: "For test"
    //     },
    //     {
    //       html: `<img alt="圖片" draggable="true" src="https://pbs.twimg.com/media/FQTn6bnVgAMdOZY?format=jpg&amp;name=small" class="css-9pa8cd">`,
    //       text: "For test Local",
    //       textContent: "For test Local"
    //     }
    // ]

    // setTimeout(() => {
    //     this._ngZone.run(() => {
    //       this.onload = false;
    //     })
    // }, 500);

    // for extension
    chrome.storage.local.get(["copies", "showTextContent", "showHTML"], (data) => {
      if (chrome.runtime.lastError) {
        console.log("runtime error: getCopyedEles")
        this._ngZone.run(() => {
          this.onload = false;
        })
        return;
      }

      if(data){
        var copyedEles: any = []
        var showTextContent: boolean = false;
        var showHTML: boolean = false;

        if(data["showTextContent"])
          showTextContent = data["showTextContent"];

        if(data["showHTML"])
          showHTML = data["showHTML"];

        if(data["copies"] && data["copies"].length > 0){
          console.log(data["copies"])
          copyedEles = data["copies"];
        }

        this._ngZone.run(() => {
          this.showTextContent = showTextContent;
          this.showHTML = showHTML;
          this.copyedEles = copyedEles;
          this.onload = false;
        })
      }
      else{
        this._ngZone.run(() => {
          this.onload = false;
        })
      }
    })
  }

  cleanHistory() {
    // for local test
    // console.log('clean')

    // for extension
    this.onload = true;

    chrome.storage.local.set({copies: []}, () => {
      if (chrome.runtime.lastError) {
        console.log("runtime error: clean history")
        
        this._ngZone.run(() => {
          this.onload = false;
        })
        return;
      }

      this._ngZone.run(() => {
        this.copyedEles = []
        this.onload = false;
      })

    })
  }

  copy(text: string) {
		if (navigator && navigator.clipboard && navigator.clipboard.writeText){
			navigator.clipboard.writeText(text);
		}
  }

  toogleShowTextContent(checked: boolean) {
    this.showTextContent = checked;
    this.setShowTextContent(checked)
  }

  toogleShowHTML(checked: boolean) {
    this.showHTML = checked;
    this.setShowHTML(checked)
  }

  setShowTextContent(checked: boolean) {
    this.setPreferences("showTextContent", checked);
  }

  setShowHTML(checked: boolean) {
    this.setPreferences("showHTML", checked);
  }

  setPreferences(name: string, checked: boolean) {
    chrome.storage.local.set({[name]: checked}, () => {
      if (chrome.runtime.lastError) {
        console.log("runtime error: set preference")
      }

      this._ngZone.run(() => {
        this.onload = false;
      })

    })
  }

}
