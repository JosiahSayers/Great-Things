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

  onFileSelect(e: Event): void {
    e.preventDefault();
    console.log(e.type);
    this.processFiles((<HTMLInputElement>e.target)?.files);
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.processFiles(e.dataTransfer?.files);
  }

  private processFiles(files: File[] | FileList): void {
    if (files?.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image')) {
        this.fileName = file.name;
        this.fileSelected.emit(file);
      }
    } else {
      this.fileName = 'Select a file...';
      this.fileSelected.emit(null);
    }
  }

}
