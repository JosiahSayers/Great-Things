import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  @Output() fileSelected = new EventEmitter<File>();
  @Input() acceptFileType = '*';

  onFileSelect(event): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileSelected.emit(file);
    } else {
      this.fileSelected.emit(null);
    }
  }

}
