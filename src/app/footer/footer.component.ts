import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  @Input() selectMode: boolean = false;
  @Input() highlightTargetEle: boolean = false;
  @Input() alwaysShowContextMenu: boolean = false;
  @Input() showTextContent: boolean = false;
  @Input() showHTML: boolean = false;
  @Input() showPopUp: boolean = false;
  @Input() stopClipboardRecording: boolean = false;

  @Output() toogleHighlightTargetEleEvent = new EventEmitter<boolean>();
  @Output() toogleAlwaysShowContextMenuEvent = new EventEmitter<boolean>();
  @Output() toogleShowTextContentEvent = new EventEmitter<boolean>();
  @Output() toogleShowHTMLEvent = new EventEmitter<boolean>();
  @Output() toogleShowPopUpEvent = new EventEmitter<boolean>();
  @Output() toogleStopClipboardRecordingEvent = new EventEmitter<boolean>();
  @Output() cleanHistoryEvent = new EventEmitter<void>();
  @Output() cancelCleanHistoryEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  toogleHighlightTargetEle(e: MatSlideToggleChange) {
    this.toogleHighlightTargetEleEvent.emit(e.checked);
  }

  toogleAlwaysShowContextMenu(e: MatSlideToggleChange) {
    this.toogleAlwaysShowContextMenuEvent.emit(e.checked);
  }

  toogleShowTextContent(e: MatSlideToggleChange) {
    this.toogleShowTextContentEvent.emit(e.checked);
  }

  toogleShowHTML(e: MatSlideToggleChange) {
    this.toogleShowHTMLEvent.emit(e.checked);
  }

  toogleShowPopUp(e: MatSlideToggleChange) {
    this.toogleShowPopUpEvent.emit(e.checked);
  }

  toogleStopClipboardRecording(e: MatSlideToggleChange) {
    this.toogleStopClipboardRecordingEvent.emit(e.checked);
  }

  cleanHistory() {
    this.cleanHistoryEvent.emit();
  }

  cancelCleanHistory() {
    this.cancelCleanHistoryEvent.emit();
  }

}
