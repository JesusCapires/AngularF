import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, map, switchMap, tap } from 'rxjs';

import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {
  // Arreglo para almacenar los países por región
  public countriesByRegion: SmallCountry[] = [];
  // Arreglo para almacenar las fronteras de un país seleccionado
  public borders: SmallCountry[] = [];
  // Formulario reactivo para el selector de países
  public myForm: FormGroup = this.fb.group({
    region : ['', Validators.required ],
    country: ['', Validators.required ],
    border : ['', Validators.required ],
  });

  // Constructor donde se inyectan los servicios necesarios
  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Llama a los métodos para detectar cambios en la región y país seleccionados
    this.onRegionChanged();
    this.onCountryChanged();
  }

  // Getter que devuelve el arreglo de regiones provenientes del servicio CountriesService
  get regions(): Region[] {
    return this.countriesService.regions;
  }

  // Método para detectar cambios en la selección de la región
  onRegionChanged(): void {
    // Escucha los cambios en el campo 'region' del formulario
    this.myForm.get('region')!.valueChanges
      .pipe(
        // Limpia el campo 'country' cuando se cambia la región
        tap(() => this.myForm.get('country')!.setValue('')),
        // Limpia el arreglo de fronteras cuando se cambia la región
        tap(() => this.borders = []),
        // Realiza una solicitud para obtener los países de la región seleccionada
        switchMap((region) => this.countriesService.getCountriesByRegion(region)),
        //Ordenar países alfabéticamente ascendente
        map(countries => countries.sort((a,b) => a.name.localeCompare(b.name)))
      )
      .subscribe(countries => {
        // Almacena los países obtenidos en el arreglo 'countriesByRegion'
        this.countriesByRegion = countries;
      });
  }

  // Método para detectar cambios en la selección del país
  onCountryChanged(): void {
    // Escucha los cambios en el campo 'country' del formulario
    this.myForm.get('country')!.valueChanges
    .pipe(
      // Limpia el campo 'border' cuando se cambia el país
      tap(() => this.myForm.get('border')!.setValue('')),
      // Filtra valores para evitar realizar solicitudes innecesarias
      filter((value: string) => value.length > 0),
      // Realiza una solicitud para obtener el país seleccionado por su código alfa
      switchMap((alphaCode) => this.countriesService.getCountryByAlphaCode(alphaCode)),
      // Realiza una solicitud para obtener las fronteras del país seleccionado
      switchMap((country) => this.countriesService.getCountryBordersByCodes(country.borders)),
    )
    .subscribe(countries => {
      // Almacena las fronteras obtenidas en el arreglo 'borders'
      this.borders = countries;
    });
  }
}
