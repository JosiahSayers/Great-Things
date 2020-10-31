import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  @Output() fileSelected = new EventEmitter<File>();
  @Input() acceptFileType = '*';
  fileName = 'Select a file...';

  onFileSelect(event): void {
    if (event.target.files.length > 0) {
      const file = <File>event.target.files[0];
      this.fileName = file.name;
      this.fileSelected.emit(file);
    } else {
      this.fileName = 'Select a file...';
      this.fileSelected.emit(null);
    }
  }

}
