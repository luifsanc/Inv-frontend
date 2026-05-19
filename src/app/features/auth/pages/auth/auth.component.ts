import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1}))
      ]),
      transition(':decrement', [
        style({ opacity: 0}),
        animate('500ms ease-in', style({ opacity: 1}))
      ])
    ])
  ]
})

export class AuthComponent implements OnInit {
  currentIndex = 0;
  private intervalId: any;

  images = [
    { url: 'assets/fabrica.jpeg', alt: 'Imagen 1' },
    { url: 'assets/it.jpeg', alt: 'Imagen 2' },
    { url: 'assets/riesgo.jpeg', alt: 'Imagen 3' }
  ];

  constructor() { }

  startAutoPlay() {
    this.intervalId =setInterval(() => this.next(), 3000);
  }

  ngOnInit() {
    this.startAutoPlay();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  goTo(index: number) {
    this.currentIndex = index;
  }
}
