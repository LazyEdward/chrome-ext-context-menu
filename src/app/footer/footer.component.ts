import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  @Input() showTextContent: boolean = false;
  @Input() showHTML: boolean = false;

  @Output() toogleShowTextContentEvent = new EventEmitter<boolean>();
  @Output() toogleShowHTMLEvent = new EventEmitter<boolean>();
  @Output() cleanHistoryEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  toogleShowTextContent(e: MatSlideToggleChange) {
    this.toogleShowTextContentEvent.emit(e.checked);
  }

  toogleShowHTML(e: MatSlideToggleChange) {
    this.toogleShowHTMLEvent.emit(e.checked);
  }

  cleanHistory() {
    this.cleanHistoryEvent.emit();
  }

}
