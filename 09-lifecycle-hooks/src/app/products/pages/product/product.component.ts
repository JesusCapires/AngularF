import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'products-product-page',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {

  public isProductVisible: boolean = false; // Variable para controlar la visibilidad del producto
  public currentPrice: number = 10; // Precio inicial del producto

  // Constructor - se ejecuta primero, inicializa el componente
  constructor() {
    console.log('Constructor');
  }

  // OnInit - se ejecuta después del constructor, ideal para inicializaciones
  ngOnInit(): void {
    console.log('ngOnInit');
  }

  // OnChanges - se ejecuta cuando hay cambios en las propiedades de entrada del componente
  ngOnChanges(changes: SimpleChanges): void {
    console.log({changes});
    console.log('ngOnChanges');
  }

  // DoCheck - se ejecuta durante cada detección de cambios en el componente
  ngDoCheck(): void {
    console.log('ngDoCheck');
  }

  // AfterContentInit - se ejecuta después de que el contenido del componente ha sido inicializado
  ngAfterContentInit(): void {
    console.log('ngAfterContentInit');
  }

  // AfterContentChecked - se ejecuta después de que el contenido del componente ha sido revisado
  ngAfterContentChecked(): void {
    console.log('ngAfterContentChecked');
  }

  // AfterViewInit - se ejecuta después de que la vista del componente ha sido inicializada
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
  }

  // AfterViewChecked - se ejecuta después de que la vista del componente ha sido revisada
  ngAfterViewChecked(): void {
    console.log('ngAfterViewChecked');
  }

  // OnDestroy - se ejecuta justo antes de destruir el componente
  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }

  // Método para aumentar el precio del producto
  increasePrice() {
    this.currentPrice++;
  }

}
