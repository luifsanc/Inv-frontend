import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { SessionService } from '../../../core/services/session/session.service';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { MenuResponseDTO } from '../../../core/models/ResponseDTO/MenuResponseDTO';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [MatSidenavModule,MatListModule,MatIconModule,RouterLink,MatExpansionModule,CommonModule,RouterLinkActive],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  @Output() itemSelected = new EventEmitter<void>();

  menus: MenuResponseDTO[] = [];

  constructor(private sessionService: SessionService) { }

  ngOnInit() {
     this.menus = this.sessionService.getUserMenus().filter(m => !m.parentId);
  }

  getChildren(menu: MenuResponseDTO): MenuResponseDTO[] {
    return (menu.children ?? []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  onItemClick() {
    this.itemSelected.emit(); // Emitimos evento al hacer clic en un ítem
  }

}
