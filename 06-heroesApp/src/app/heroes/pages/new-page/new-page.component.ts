import { filter, map, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { HeroesService } from './../../services/heroes.service';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { validateHorizontalPosition } from '@angular/cdk/overlay';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit{

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego:  new FormControl(''),
    first_appearance: new FormControl(''),
    characters:  new FormControl(''),
    alt_image: new FormControl(''),
  })

  public publishers = [
    {id: 'DC Comics', desc: 'DC - Comics'},
    {id: 'Marvel Comics', desc: 'Marvel - Comics'},
  ];

  constructor(private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  //GETTERS PARA OBTENER EL VALOR ACTUAL DEL FORMULARIO
  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;

    return hero;
  }


  //METODO QUE SE EJECUTA UNA VEZ QUE EL COMPONENTE SE HAYA CARGADO POR COMPLETO, SIMILAR A LA CARGA DEL DOM EN JS
  ngOnInit(): void {
    if(!this.router.url.includes('edit') ) return;

    this.activatedRoute.params
    //TUBERIA PARA TRANSOFRMAR/MANIPULAR DATOS
      .pipe(
        //EMITIR VALORES / DISPARAR EFECTOS SECUNDARIOS
        tap( valores => console.log(valores) ),
        // MANIPULA Y MODIFICA DATOS CON FACILIDAD
        // map( ({id}) => {
        //   console.log(id*10)
        // } ),
        // OBTIENE EL VALOR DE UN OBSERVABLE Y LANZA OTRO OBSERVABLE
        switchMap(({id}) => this.heroesService.getHeroById(id)),
      ).subscribe( hero => {
        if(!hero) {
          //NAVIGATEBYURL PERMITE transportar a los usuarios a diferentes urls
          return this.router.navigateByUrl('/');
        }
        //RESET DEVUELVE EL FORMULARIO A SU ESTADO INICIAL
        this.heroForm.reset(hero);
        return;
      })
  }

  onSubmit():void{

    if(this.heroForm.invalid) return;

    if(this.currentHero.id){
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackbar(`${hero.superhero} updated!`);
        });

        return;
    }

    this.heroesService.addHero( this.currentHero)
      .subscribe( hero => {
        this.router.navigate(['/heroes/edit', hero.id])
        this.showSnackbar(`${hero.superhero} created!`);
      });
    }

    onDeleteHero() {
      if (!this.currentHero.id) {
        throw Error('Hero id is required');
      }
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: this.heroForm.value,
      });

      dialogRef.afterClosed()
        .pipe(
          //FILTRO QUE PERMITE PASAR SOLO LO QUE CUMPLE LA CONDICIÓN AGREGADA
          filter( (result: boolean) => result),
          switchMap( () => this.heroesService.deleteHero(this.currentHero.id)),
          filter((wasDeleted: boolean) => wasDeleted),
        )
        .subscribe(() =>{
          this.router.navigate(['/heroes']);
      })

      // dialogRef.afterClosed().subscribe(result => {
      //   if(!result) return;

      //   this.heroesService.deleteHero( this.currentHero.id)
      //     .subscribe( wasDeleted => {
      //       if( wasDeleted)
      //         this.router.navigate(['/heroes']);
      //     });
      // });
    }

    showSnackbar(message: string): void {
      this.snackbar.open(message, 'done', {
        duration: 2500,
      })
    }

}
