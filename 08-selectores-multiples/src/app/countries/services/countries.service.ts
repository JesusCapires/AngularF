import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Country, Region, SmallCountry } from '../interfaces/country.interfaces';
import { Observable, combineLatest, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v3.1';

  //Arreglo de regiones
  private _regions: Region[] = [ Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania ];

  constructor(
    private http: HttpClient
  ) { }

  //Geter para obtener las regiones del arreglo privado
  get regions(): Region[] {
    return [ ...this._regions ];
  }
  // Método para obtener países por región
  // Retorna un Observable que emite un arreglo de objetos SmallCountry
  getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
    // Verifica si la región es nula o indefinida, si lo es, retorna un observable con un arreglo vacío
    if (!region) return of([]);

    // Construye la URL para la solicitud HTTP, usando la base URL del servicio y la región proporcionada
    const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;

    // Realiza una solicitud HTTP GET al servidor con la URL construida
    return this.http.get<Country[]>(url)
      .pipe(
        // Utiliza el operador `map` para transformar los datos de la respuesta
        map(countries => countries.map(country => ({
          // Por cada país en la respuesta, mapea sus propiedades al formato SmallCountry
          name: country.name.common,  // Asigna el nombre común del país
          cca3: country.cca3,         // Asigna el código de país de tres letras (por ejemplo, USA)
          borders: country.borders ?? [] // Asigna los países fronterizos, si no hay ninguno, asigna un arreglo vacío
        }))),
      )
  }

  // Método para obtener información de un país por su código alfa
  // Retorna un Observable que emite un objeto SmallCountry
  getCountryByAlphaCode(alphaCode: string): Observable<SmallCountry> {
    // Construye la URL para la solicitud HTTP, usando el código alfa proporcionado
    const url = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;

    // Realiza una solicitud HTTP GET al servidor con la URL construida
    return this.http.get<Country>(url)
      .pipe(
        // Utiliza el operador `map` para transformar los datos de la respuesta
        map(country => ({
          // Transforma los datos del país en el formato de SmallCountry
          name: country.name.common,  // Asigna el nombre común del país
          cca3: country.cca3,         // Asigna el código de país de tres letras (por ejemplo, USA)
          borders: country.borders ?? [], // Asigna los países fronterizos, si no hay ninguno, asigna un arreglo vacío
        }))
      );
  }

  // Método para obtener información de países fronterizos por sus códigos alfa
  // Retorna un Observable que emite un arreglo de objetos SmallCountry
  getCountryBordersByCodes(borders: string[]): Observable<SmallCountry[]> {
    // Verifica si no hay códigos alfa o si el arreglo está vacío, en tal caso, retorna un observable con un arreglo vacío
    if (!borders || borders.length === 0) return of([]);

    // Arreglo que contendrá las solicitudes de información de países
    const countriesRequests: Observable<SmallCountry>[] = [];

    // Itera sobre cada código alfa proporcionado
    borders.forEach(code => {
      // Realiza una solicitud de información del país por su código alfa y agrega el Observable resultante al arreglo
      const request = this.getCountryByAlphaCode(code);
      countriesRequests.push(request);
    });

    // Combina todas las solicitudes en paralelo y retorna un único Observable que emite un arreglo con la información de los países
    return combineLatest(countriesRequests);
  }

}
