// https://stackoverflow.com/questions/47075437/cannot-find-namespace-name-chrome
/// <reference types="chrome"/>
import {Component, OnInit,  NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WarningModalComponent } from './warning-modal/warning-modal.component';

import ChromeApi from '../app/api/chrome';

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
  alwaysShowPopUp: boolean = false;

  selectMode: boolean = false;
  triggerSelectMode: any = null;

  constructor(private _ngZone: NgZone, public dialog: MatDialog){}

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
    ChromeApi.fetchHistory(
      ["copies", "showTextContent", "showHTML", "alwaysShowPopUp"],
      (data: any) => {
        if(data){
          var copyedEles: any = []
          var showTextContent: boolean = false;
          var showHTML: boolean = false;
  
          if(data["showTextContent"])
            showTextContent = data["showTextContent"];
  
          if(data["showHTML"])
            showHTML = data["showHTML"];
  
          if(data["alwaysShowPopUp"])
            showHTML = data["alwaysShowPopUp"];
  
          if(data["copies"] && data["copies"].length > 0){
            console.log(data["copies"])
            copyedEles = data["copies"];
            copyedEles.forEach((val: any) => val.selected = false);
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
      },
      () => {
        this._ngZone.run(() => {
          this.onload = false;
        })
      }
    )

    // chrome.storage.local.get(["copies", "showTextContent", "showHTML"], (data) => {
    //   if (chrome.runtime.lastError) {
    //     console.log("runtime error: getCopyedEles")
    //     this._ngZone.run(() => {
    //       this.onload = false;
    //     })
    //     return;
    //   }

    //   if(data){
    //     var copyedEles: any = []
    //     var showTextContent: boolean = false;
    //     var showHTML: boolean = false;

    //     if(data["showTextContent"])
    //       showTextContent = data["showTextContent"];

    //     if(data["showHTML"])
    //       showHTML = data["showHTML"];

    //     if(data["copies"] && data["copies"].length > 0){
    //       console.log(data["copies"])
    //       copyedEles = data["copies"];
    //     }

    //     this._ngZone.run(() => {
    //       this.showTextContent = showTextContent;
    //       this.showHTML = showHTML;
    //       this.copyedEles = copyedEles;
    //       this.onload = false;
    //     })
    //   }
    //   else{
    //     this._ngZone.run(() => {
    //       this.onload = false;
    //     })
    //   }
    // })
  }

  confirmCleanHistory() {
    const warningRef = this.dialog.open(WarningModalComponent, {
      data: {
        selectMode: this.selectMode
      }
    });
    
    // https://github.com/angular/components/issues/3593
    warningRef.afterClosed().subscribe(res => {
      if(res === "submit")
        this.cleanHistory();
    })
  }

  cleanHistory() {
    // for local test
    // console.log('clean')

    // for extension
    this.onload = true;

    // chrome.storage.local.set({copies: []}, () => {
    //   if (chrome.runtime.lastError) {
    //     console.log("runtime error: clean history")
        
    //     this._ngZone.run(() => {
    //       this.onload = false;
    //     })
    //     return;
    //   }

    //   this._ngZone.run(() => {
    //     this.copyedEles = []
    //     this.onload = false;
    //   })

    // })

    ChromeApi.cleanHistory(
      this.selectMode ? this.copyedEles.filter((val: any) => val.selected === false) : [],
      () => {
        this._ngZone.run(() => {
          if(this.selectMode)
            this.copyedEles = this.copyedEles.filter((val: any) => val.selected === false);
          else
            this.copyedEles = []
          this.onload = false;
          this.selectMode = false;
        })
      },
      () => {
        this._ngZone.run(() => {
          this.onload = false;
        })        
      }
    )
  }

  cancelCleanHistory() {
    this.copyedEles.forEach((val: any) => val.selected = false);
    this.selectMode = false;
  }

  longPress(index: number){
    this._ngZone.run(() => {
      this.selectMode = true;
      var copyedEle = {...this.copyedEles[index]};
      copyedEle.selected = true;
      this.copyedEles[index] = copyedEle;
    })
  }

  focusElement(index: number) {    
    this.triggerSelectMode = setTimeout(() => {this.longPress(index)}, 500);
  }

  unfocusElement() {    
    clearTimeout(this.triggerSelectMode);
  }

  switchEleSelection(index: number) {
    var copyedEle = {...this.copyedEles[index]};
    copyedEle.selected = !copyedEle.selected;
    this.copyedEles[index] = copyedEle;
  }

  copy(text: string) {
    if(this.selectMode)
      return;

		if (navigator && navigator.clipboard && navigator.clipboard.writeText){
			navigator.clipboard.writeText(text);
		}
  }

  toogleShowTextContent(checked: boolean) {
    this.showTextContent = checked;
    // this.setShowTextContent(checked)
    ChromeApi.setPreferences("showTextContent", checked,
      () => {
        this._ngZone.run(() => {
          this.onload = false;
        })
      }
    );    
  }

  toogleShowHTML(checked: boolean) {
    this.showHTML = checked;
    // this.setShowHTML(checked)
    ChromeApi.setPreferences("showHTML", checked,
      () => {
        this._ngZone.run(() => {
          this.onload = false;
        })
      }
    );    
  }

  toogleAlwaysShowPopUp(checked: boolean) {
    this.alwaysShowPopUp = checked;
    // this.setAlwaysShowPopUp(checked)
    ChromeApi.setPreferences("alwaysShowPopUp", checked,
      () => {
        this._ngZone.run(() => {
          this.onload = false;
        })
      }
    );    
  }

  // setShowTextContent(checked: boolean) {
  //   // this.setPreferences("showTextContent", checked);
  //   ChromeApi.setPreferences("showTextContent", checked,
  //     () => {
  //       this._ngZone.run(() => {
  //         this.onload = false;
  //       })
  //     }
  //   );
  // }

  // setShowHTML(checked: boolean) {
  //   // this.setPreferences("showHTML", checked);
  //   ChromeApi.setPreferences("showHTML", checked,
  //     () => {
  //       this._ngZone.run(() => {
  //         this.onload = false;
  //       })
  //     }
  //   );
  // }

  // setAlwaysShowPopUp(checked: boolean) {
  //   // this.setPreferences("alwaysShowPopUp", checked);
  //   ChromeApi.setPreferences("alwaysShowPopUp", checked,
  //     () => {
  //       this._ngZone.run(() => {
  //         this.onload = false;
  //       })
  //     }
  //   );
  // }

  // setPreferences(name: string, checked: boolean) {
  //   chrome.storage.local.set({[name]: checked}, () => {
  //     if (chrome.runtime.lastError) {
  //       console.log("runtime error: set preference")
  //     }

  //     this._ngZone.run(() => {
  //       this.onload = false;
  //     })

  //   })
  // }

}
