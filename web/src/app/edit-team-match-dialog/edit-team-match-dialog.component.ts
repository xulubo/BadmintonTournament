import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeamMatch } from '../models/team-match.model';

@Component({
  selector: 'app-edit-team-match-dialog',
  templateUrl: './edit-team-match-dialog.component.html'
})
export class EditTeamMatchDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditTeamMatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeamMatch
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this team match?')) {
      this.dialogRef.close({ delete: true, id: this.data.id });
    }
  }
}
