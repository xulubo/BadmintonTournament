import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-single-match-dialog',
  templateUrl: './edit-single-match-dialog.component.html'
})
export class EditSingleMatchDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditSingleMatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize comment if it doesn't exist
    if (!this.data.comment) {
      this.data.comment = '';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }
}
