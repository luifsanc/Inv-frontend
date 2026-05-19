import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { EquipmentDetailResponseDTO } from '../../../../core/models/ResponseDTO/inventory/EquipmentDetailResponseDTO';
import { WarrantTypeDetailResponseDTO } from '../../../../core/models/ResponseDTO/inventory/WarrantTypeDetailResponseDTO ';
import { WarrantTypeRequestDTO } from '../../../../core/models/RequestDTO/inventory/WarrantTypeRequestDTO';
import { InvoiceDetailResponseDTO } from '../../../../core/models/ResponseDTO/inventory/InvoiceDetailResponseDTO';

import { EquipmentService } from '../../services/equipment/equipment.service';
import { WarrantyService } from '../../services/warranty/warranty.service';
import { InvoiceService } from '../../services/invoice/invoice.service';

import { FormService } from '../../../../core/services/modals/form/form.service';
import { ModalDialogService } from '../../../../core/services/modals/modalDialog/modalDialog.service';
import { WarningService } from '../../../../core/services/modals/warning/warning.service';
import { LoadingService } from '../../../../core/services/modals/loading/loading.service';

import { WarrantyTypeFormComponent } from '../../components/warranty-type-form/warranty-type-form.component';
import { EquipmentInvoiceFormComponent } from '../../components/equipmentInvoiceForm/equipmentInvoiceForm.component';

@Component({
  selector: 'app-equipmentDetail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LayoutModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './equipmentDetail.component.html',
  styleUrls: ['./equipmentDetail.component.css'],
})
export class EquipmentDetailComponent implements OnInit {
  @Input() equipmentId?: number;
  @ViewChild(MatSort) sort!: MatSort;

  equipment?: EquipmentDetailResponseDTO;
  warrantyDetail?: WarrantTypeDetailResponseDTO;
  invoice?: InvoiceDetailResponseDTO;

  dataSource = new MatTableDataSource<InvoiceDetailResponseDTO>();
  loading = true;

  invoiceNumberSearch: string = '';
  serialNumberSearch: string = '';
  total: number = 0;

  constructor(
    private route: ActivatedRoute,
    private equipmentService: EquipmentService,
    private warrantyService: WarrantyService,
    private invoiceService: InvoiceService,
    private modalDialogService: ModalDialogService,
    private formService: FormService,
    private warningService: WarningService,
    private load: LoadingService,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const id =
      this.equipmentId ?? Number(this.route.snapshot.queryParamMap.get('id'));
    if (id) {
      this.equipmentService.getDetailById(id).subscribe({
        next: (resp) => {
          this.equipment = resp.data;
          if (this.equipment?.warranty && this.equipment.warranty > 0) {
            this.loadWarranty(this.equipment.warranty);
          }
          if (this.equipment?.invoice) {
            this.loadInvoicesBySerialNumber(this.equipment.serialNumber);
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar el detalle', err);
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
    }
  }

  goBack() {
    this.location.back();
  }

  // --------- GARANTÍA ----------
  loadWarranty(equipmentId: number) {
    this.warrantyService.findById(equipmentId).subscribe({
      next: (resp) => {
        this.warrantyDetail = resp.data;
        this.isWarrantyActive();
      },
      error: () => {
        this.warrantyDetail = undefined;
      },
    });
  }

  isWarrantyActive(): void {
    if (this.warrantyDetail) {
      const now = new Date();
      const endDate = new Date(this.warrantyDetail.warrantyEndDate);
      if (endDate < now) {
        this.warrantyDetail.warrantyStatus = false;
      }
    }
  }

  openWarrantyForm(): void {
    if (!this.equipment?.id) return;

    const newWarrantyData = { idEquipment: this.equipment.id };

    this.formService.open(
      'Registrar detalle de garantía',
      'add_circle',
      WarrantyTypeFormComponent,
      newWarrantyData,
      (result: WarrantTypeDetailResponseDTO) => {
        if (result) {
          this.warrantyDetail = result;
          this.equipment!.warranty = result.id;
          this.modalDialogService.open(
            'success',
            'Garantía registrada',
            'La garantía fue registrada correctamente.'
          );
        }
      },
      () => {
        this.modalDialogService.open(
          'error',
          'Error al registrar',
          'No se pudo registrar la garantía.'
        );
      }
    );
  }

  editWarranty(): void {
    if (!this.warrantyDetail || !this.equipment?.id) return;

    const dataWithEquipmentId = {
      ...this.warrantyDetail,
      idEquipment: this.equipment.id,
    };

    this.formService.open(
      'Editar Garantía',
      'edit',
      WarrantyTypeFormComponent,
      dataWithEquipmentId,
      (result: WarrantTypeDetailResponseDTO) => {
        if (result) {
          console.log(result);
          this.warrantyDetail = result;
          this.modalDialogService.open(
            'success',
            'Garantía actualizada',
            'La garantía fue modificada correctamente.'
          );
        }
      },
      (error) => {
        console.error('Error al actualizar la garantía', error);
        this.modalDialogService.open(
          'error',
          'Error al editar',
          'No se pudo actualizar la garantía.'
        );
      }
    );
  }

  // --------- FACTURAS ----------
  openInvoiceForm() {
    const invoice = {
      equipmentId: this.equipment?.id,
      invoiceDetail: this.invoice,
    };

    this.formService.open(
      'Registrar detalle de factura',
      'edit',
      EquipmentInvoiceFormComponent,
      invoice,
      (result: InvoiceDetailResponseDTO) => {
        if (result && this.equipment?.id) {
          this.invoice = result;
          this.equipmentService.getDetailById(this.equipment.id).subscribe({
            next: (resp) => {
              console.log(resp);
              this.equipment = resp.data;
              this.modalDialogService.open(
                'success',
                'Factura creada',
                'La factura fue creada correctamente.'
              );
            },
          });
        }
      },
      () => {
        this.modalDialogService.open(
          'error',
          'Error al crear',
          'Ocurrió un error al crear la factura.'
        );
      }
    );
  }

  searchInvoices(): void {
    if (this.invoiceNumberSearch?.trim()) {
      this.loadInvoicesByInvoiceNumber(this.invoiceNumberSearch.trim());
    } else if (this.serialNumberSearch?.trim()) {
      this.loadInvoicesBySerialNumber(this.serialNumberSearch.trim());
    } else {
      this.modalDialogService.open(
        'error',
        'Búsqueda vacía',
        'Por favor ingrese un número de factura o de serie.'
      );
    }
  }

  loadInvoicesBySerialNumber(serialNumber: string): void {
    this.loading = true;
    this.invoiceService.getBySerialNumber(serialNumber).subscribe({
      next: (resp) => {
        this.invoice = resp.data ?? null;
        if (!this.invoice) {
          this.modalDialogService.open(
            'error',
            'No encontrado',
            'No se encontró una factura para ese número de serie.'
          );
        }
      },
      error: (err) => {
        console.error('Error al buscar por serial number', err);
        this.modalDialogService.open(
          'error',
          'Error',
          'No se pudo cargar la factura.'
        );
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  loadInvoicesByInvoiceNumber(invoiceNumber: string): void {
    this.loading = true;
    this.invoiceService.getByInvoiceNumber(invoiceNumber).subscribe({
      next: (resp) => {
        this.invoice = resp.data ?? null;
      },
      error: (err) => {
        console.error('Error al buscar por número de factura', err);
        this.modalDialogService.open(
          'error',
          'Factura no encontrada',
          'No se encontró una factura con ese número.'
        );
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  warningDelete(invoice: InvoiceDetailResponseDTO): void {
    this.warningService.open(
      'Eliminar factura',
      '¿Estás seguro de que deseas eliminar esta factura? Esta acción no se puede deshacer.',
      () => this.deleteInvoice(invoice)
    );
  }

  deleteInvoice(invoice: InvoiceDetailResponseDTO): void {
    this.invoiceService.delete(invoice.id).subscribe({
      next: () => {
        this.modalDialogService.open(
          'success',
          'Factura eliminada',
          'La factura fue eliminada correctamente.'
        );
      },
      error: (err) => {
        console.error('Error al eliminar factura', err);
        this.modalDialogService.open(
          'error',
          'Error al eliminar',
          'No se pudo eliminar la factura.'
        );
      },
    });
  }

  calculateRemainingDays(endDate: string | Date): number {
    const today = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
