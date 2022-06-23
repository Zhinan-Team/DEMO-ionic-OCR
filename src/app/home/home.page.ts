import { Component } from '@angular/core';
import { createWorker } from 'tesseract.js'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {
    this.loadWorker();
  }

  worker: Tesseract.Worker;
  workerReady = false;
  image = 'assets/t1.png';
  ocrResult ="";
  captureProgress = 0;
  
  async loadWorker()
  {
    this.worker = createWorker({
      workerPath: 'assets/worker.min.js',
      corePath: 'assets/tesseract-core.wasm.js',
      langPath: 'assets/traineddata',
      logger: progress => {
        console.log(progress);
        if(progress.status == 'recognizing text')
        {
          this.captureProgress = parseInt('' + progress.progress * 100);
        }
      }
    });
    await this.worker.load();
    await this.worker.loadLanguage('eng');
    await this.worker.initialize('eng');
    this.workerReady = true;
  }
  
  async captureImage(){
    const image = await Camera.getPhoto({
        quality:90,
        allowEditing:true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
    });

    this.image = image.dataUrl;

  }

  async recognizeImage(){
    // this.workerReady = false;
    const result = await this.worker.recognize(this.image);
    // this.workerReady = true;
    this.ocrResult = result.data.text;
    console.log(this.ocrResult);
  }

}
