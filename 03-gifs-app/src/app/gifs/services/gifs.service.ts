import { Gif, SearchResponse } from './../interfaces/gifs.interfaces';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey:       string = '6YcUlmlUe1qPpjtMabnysrJaY6HWCs1x';
  private serviceUrl:   string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    console.log('Gifs')
  }

  get tagsHistory(){
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    //Verificar si el tag ya está presente en el historial
    if(this._tagsHistory.includes(tag) ){
      //Si el tag existe, se elimina y se vuelve a reorganizar todo el historial
      this._tagsHistory = this._tagsHistory.filter(oldTag => oldTag !== tag);
    }
    //Agregar el nuevo tag al principio del istorial
    this._tagsHistory.unshift( tag );

    //Limite de busqueda a una longitud maxima de 10
    this._tagsHistory = this._tagsHistory.splice(0,10);
    //Llamada a localStorage
    this.saveLocalStorage();


  }

  //LocalStorage guardar busquedas
  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  //Cargar el localStorage
  private loadLocalStorage():void {
    //Si existe un historial
    if( !localStorage.getItem('history')) return;

    //Inversa al stringfy
    this._tagsHistory = JSON.parse(localStorage.getItem('history')! );

    //Obtener primer posición del historial
    const firstTag = this._tagsHistory[0];

    //Mandar a hacer la busqueda
    this.searchTag(firstTag);

  }

  //Busqueda
  searchTag(tag: string): void {

    if(tag.length === 0) return;

    this.organizeHistory(tag);

    // fetch('https://api.giphy.com/v1/gifs/search?api_key=6YcUlmlUe1qPpjtMabnysrJaY6HWCs1x&q=valorant&limit=10')
    //   .then( resp => resp.json() )
    //   .then( data => console.log(data) );

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag)

    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`, { params })
      .subscribe( resp => {

        this.gifList = resp.data;
        // console.log({gifs: this.gifList});

      })
  }



}
