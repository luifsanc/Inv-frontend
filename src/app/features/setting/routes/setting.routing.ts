import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from '../pages/setting/setting.component';
import { UserComponent } from '../../users/pages/user/user.component';
import { RoleComponent } from '../../roles/pages/role/role.component';
import { PrivilegeComponent } from '../../privilege/pages/privilege/privilege.component';
import { MenuComponent } from '../../menu/pages/menu/menu.component';
import { UserDetailsComponent } from '../../users/pages/userDetails/userDetails.component';


export const setting_routes: Routes = [
  {
    path: '',
    component: SettingComponent,
    children: [
      { path: 'users', children: [
                { path: '', component: UserComponent },
                {
                  path: 'detail',
                  loadComponent: () =>
                    import(
                      '../../users/pages/userDetails/userDetails.component'
                    ).then((m) => m.UserDetailsComponent),
                },
              ],
            },
      { path: 'roles', component: RoleComponent },
      { path: 'permissions', component: PrivilegeComponent },
      { path: 'menus', component: MenuComponent },
    ],
  },
];
