import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlayerConfig } from './playerInterfaces';
import { ViewerService } from './services/viewer.service';

@Component({
  selector: 'sunbird-video-player',
  templateUrl: './sunbird-video-player.component.html',
  styleUrls: ['./sunbird-video-player.component.scss']
})
export class SunbirdVideoPlayerComponent implements OnInit {

  @Input() playerConfig: PlayerConfig;
  @Output() playerEvent: EventEmitter<object>;
  viewState = 'player';
  showControls = true;
  sideMenuConfig = {
    showShare: true,
    showDownload: true,
    showReplay: true,
    showExit: true
  };
  options;

  constructor( public viewerService: ViewerService, public cdr: ChangeDetectorRef) {
    this.playerEvent = this.viewerService.playerEvent;
    this.viewerService.playerEvent.subscribe(event => {
      if(event.type === 'ended') {
        this.viewState = 'end';
        this.showControls = true;
      }  
      if(event.type === 'pause') {
        this.showControls = true;
      } 
      if(event.type === 'playing') {
        this.showControls = false;
      }  
      this.cdr.detectChanges();
    })
   }

  ngOnInit() {
    this.viewerService.initialize(this.playerConfig);
    this.options = {
      sources: [
        {
          src: this.viewerService.src,
          type: this.viewerService.mimeType
        }
      ]
    }
  }
    
  sideBarEvents(event) {
    this.playerEvent.emit(event);
    if(event.type === "DOWNLOAD") {
      this.downloadVideo();
    }
  }

  replayContent(event) {
    this.playerEvent.emit(event);
    this.viewState = 'player';
  }


  downloadVideo() {
    var a = document.createElement("a");
    a.href = this.viewerService.src;
    a.download = this.viewerService.contentName;
    a.click();
  }
}
