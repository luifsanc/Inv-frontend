import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../core/services/modals/loading/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule,CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent implements OnInit {

  isLoading!: Observable<boolean>;
  
  constructor(private loadingService: LoadingService) {
    
  }

  ngOnInit() {
    this.isLoading = this.loadingService.loading$;
  }
}
