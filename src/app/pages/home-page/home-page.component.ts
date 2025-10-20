import { Component, inject, OnInit } from '@angular/core';
import { NameService } from '../../services/name.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  /* Injections */
  private readonly _nameService = inject(NameService);

  /* Signals */
  name = this._nameService.name;

  ngOnInit(): void {
    this._nameService.getNameById("Adrian").subscribe({
      next: (resp) => console.log("Respuesta get by name: ", resp)
    })
  }
}
