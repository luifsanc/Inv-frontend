import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from "./shared/components/loading/loading.component";
import { FormComponent } from "./shared/components/form/form.component";
import { MessageDialogComponent } from "./shared/components/message-dialog/message-dialog.component";
import { WarningComponentComponent } from "./shared/components/warningComponent/warningComponent.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, FormComponent, MessageDialogComponent, WarningComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'isc-inventory-front';
}
