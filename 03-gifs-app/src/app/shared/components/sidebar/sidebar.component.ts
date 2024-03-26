import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../../../gifs/services/gifs.service';

@Component({
  selector: 'shared-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(private gifsServie: GifsService) { }

  get tags(): string[] {
    return this.gifsServie.tagsHistory;
  }

  searchTag(tag: string) {

    this.gifsServie.searchTag( tag );
  }

}
