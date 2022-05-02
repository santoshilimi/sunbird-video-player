import { Component } from '@angular/core';
import { PlayerConfig } from '@project-sunbird/sunbird-video-player-v9';
import { samplePlayerConfig } from './data';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  playerConfig: PlayerConfig;
  contentId = 'do_21310353244132147214643';
  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.getContent(this.contentId).subscribe(res => {
      this.initializePlayer(res);
    });
  }

  initializePlayer(metaData) {
    let videoConfigMetadata: any = localStorage.getItem('config') || '{}';
    let config;
    if (videoConfigMetadata) {
      videoConfigMetadata = JSON.parse(videoConfigMetadata);
      config = { ...samplePlayerConfig.config, ...videoConfigMetadata };
    }
    this.playerConfig = {
      context: samplePlayerConfig.context,
      config: config ? config : samplePlayerConfig.config,
      metadata: metaData,
      data: {}
    };
  }

  playerEvent(event) {
    if (event.eid === 'END') {
      let videoMetaDataConfig = event.metaData;
      localStorage.setItem('config', JSON.stringify(videoMetaDataConfig));
      videoMetaDataConfig = JSON.parse(localStorage.getItem('config')) || {};
      const config = { ...samplePlayerConfig.config, ...videoMetaDataConfig };
      this.playerConfig.config = config;
    }
  }

  telemetryEvent(event) {
    // console.log('in app: ', JSON.stringify(event));
  }
}
