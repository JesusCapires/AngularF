import { Gif } from '../../interfaces/gifs.interfaces';
import { GifsService } from './../../services/gifs.service';
import { Component } from '@angular/core';

@Component({
  selector: 'gifs-home-page',
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {

  constructor ( private GifsService: GifsService) {}

  get gifs(): Gif[] {
    return this.GifsService.gifList;
  }

}
