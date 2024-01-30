import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'curso_angular';
  public counter: number =10;
  increaseBY(value: string): void{
    value == 'inc'? this.counter +=1: this.counter -=1;
  }
}
