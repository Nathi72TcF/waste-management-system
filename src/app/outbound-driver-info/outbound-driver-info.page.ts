import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform } from '@ionic/angular';
import { Router, ActivatedRoute  } from '@angular/router';
import { ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { element } from 'protractor';
import { Location } from "@angular/common";
import { Chart} from 'chart.js';
import * as moment from 'moment'

@Component({
  selector: 'app-outbound-driver-info',
  templateUrl: './outbound-driver-info.page.html',
  styleUrls: ['./outbound-driver-info.page.scss'],
})
export class OutboundDriverInfoPage implements OnInit {

  @ViewChild('barChart', {static: false}) barChart;   
  
  db = firebase.firestore();

  //method to show and hide profile form
  come: boolean = true;
 
  colorArray: any;
  bars: any;

  DriverName;
  RegistarionNumberPlates;
  overallStorage;
  overallStoragez;
  TruckSourcess;
  Destination;
  numbers;
  companyaddress;

  id;
  Outbound;
  OutboundMass;
  ViewOutbound = [];
  ViewOutboundMasses = [];

  GH001storagemass;
  NFAL01storagemass;
  PAP005storagemass;
  PAP007storagemass;
  PAP001storagemass;
  PAP003storagemass;
  HD001storagemass;
  LD001storagemass;
  LD003storagemass;
  PET001storagemass;
  PET003storagemass;
  PET005storagemass;
  // substrings
  GH001storagemassz;
  NFAL01storagemassz;
  PAP005storagemassz;
  PAP007storagemassz;
  PAP001storagemassz;
  PAP003storagemassz;
  HD001storagemassz;
  LD001storagemassz;
  LD003storagemassz;
  PET001storagemassz;
  PET003storagemassz;
  PET005storagemassz;

  GH001storagemassgraph;
  NFAL01storagemassgraph;
  PAP005storagemassgraph;
  PAP007storagemassgraph;
  PAP001storagemassgraph;
  PAP003storagemassgraph;
  HD001storagemassgraph;
  LD001storagemassgraph;
  LD003storagemassgraph;
  PET001storagemassgraph;
  PET003storagemassgraph;
  PET005storagemassgraph;

  paperTotal = 0;
  plasticTotal = 0;
  alumTotal = 0;
  glassTotal = 0;
  // barChart: any;

  userArray = [];
  timeArray = [];

  januserArray = [];
  febuserArray = [];
  maruserArray = [];
  apruserArray = [];
  mayuserArray = [];
  junuserArray = [];
  juluserArray = [];
  auguserArray = [];
  sepuserArray = [];
  octuserArray = [];
  novuserArray = [];
  decuserArray = [];

  jantimeArray = [];
  febtimeArray = [];
  martimeArray = [];
  aprtimeArray = [];
  maytimeArray = [];
  juntimeArray = [];
  jultimeArray = [];
  augtimeArray = [];
  septimeArray = [];
  octtimeArray = [];
  novtimeArray = [];
  dectimeArray = [];

  jan = 0;
  feb = 0;
  mar = 0;
  apr = 0;
  may = 0;
  jun = 0;
  jul = 0;
  aug = 0;
  sep = 0;
  oct = 0;
  nov = 0;
  dec = 0;

  constructor(
    public toastController: ToastController,
    private modalcontroller: ModalController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public activatedRoute: ActivatedRoute,
    public menuCtrl: MenuController,
    private content: ElementRef,
    public rendered: Renderer2,
    private plt: Platform,
    public route: Router,
    private file: File,
    private location: Location,
    private fileOpener: FileOpener
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.id);

    this.pullDrive();
    this.pullMassz();
    this.pullHistoryData();
    
   }

  ngOnInit() {
  }
//method to show and hide profile
switch(){
  this.come = !this.come;
}

async presentAlertUpdate() {
  const alert = await this.alertController.create({
    header: 'Warning!',
    message: '<strong>Are you sure you want to update Driver Information?.</strong>!!!',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      },
      {
        text: 'Okay',
        handler: () => {
          this.SaveUpdates()
          this.route.navigateByUrl('/outbound-driver-info');
        }
      }
    ]
  });
  await alert.present();
}

getPhoneInput(ev: any) {
  this.numbers = ev.target.value;

  // calling firebase
  // this.contact[0] == '0'
  if (this.numbers[0] !== '0') {
    this.presentAlertPhoneValidation();
  } else {
    // this.showInputs()
    console.log('im working');
    this.numbers = this.numbers;
  }
    // console.log(this.phoneVal);
    console.log(this.numbers);
}

async presentAlertPhoneValidation() {
  const alert = await this.alertController.create({
    header: 'Confirm!',
    message: '<strong>Phone Numbers must start with a number: 0.</strong>!!!',
    buttons: [
      {
        text: 'Okay',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          this.erasedToContact();
          console.log('Confirm Cancel: blah');
        }
      }
    ]
  });
  await alert.present();
}

erasedToContact() {
  this.numbers = '';
}

  SaveUpdates() {
    this.db.collection('outbound').doc(this.id).update({
      DriverName: this.DriverName,
      RegistarionNumberPlates: this.RegistarionNumberPlates,
      numbers: this.numbers,
      TruckSourcess: this.TruckSourcess,
      companyaddress: this.companyaddress
    })
  }

  pullDrive() {
    this.Outbound = this.db.collection('outbound').doc(this.id);
    this.Outbound.get().then((element) => {
      this.ViewOutbound = [];
      // console.log(documentSnapshot.data());
      this.ViewOutbound.push(element.data());
      // console.log(this.ViewOutbound);

      // console.log(element.data);
      let DriverName = {};
      let RegistarionNumberPlates = {};
      let overallStorage = {};
      let TruckSourcess = {};
      let Destination = {};
      let time = {};

      DriverName = this.DriverName = element.data().DriverName;
      RegistarionNumberPlates = this.RegistarionNumberPlates = element.data().RegistarionNumberPlates;
      TruckSourcess = this.TruckSourcess = element.data().TruckSourcess;
      this.companyaddress = element.data().companyaddress;
      this.numbers = element.data().numbers;
      // console.log(this.DriverName);
      // console.log(this.RegistarionNumberPlates);
      // // console.log(this.overallStorage);
      // console.log(this.TruckSourcess);
      // // console.log(this.Destination);
      // // console.log(this.overallStoragez);
    });
  }

  pullMassz() {
    this.db.collection('outboundMass').where('driverID', '==', this.id).onSnapshot(snapshot => {
      snapshot.forEach(element => {
        // console.log(element.data());
        this.ViewOutboundMasses.push(element.data());
        console.log(this.ViewOutboundMasses);

        this.GH001storagemass = element.data().GH001;
        this.GH001storagemassz = (String(this.GH001storagemass).substring(0, 6));
        this.NFAL01storagemass = element.data().NFAL01;
        this.NFAL01storagemassz = (String(this.NFAL01storagemass).substring(0, 6));
        this.PAP005storagemass = element.data().PAP005;
        this.PAP005storagemassz = (String(this.PAP005storagemass).substring(0, 6));
        this.PAP007storagemass = element.data().PAP007;
        this.PAP007storagemassz = (String(this.PAP007storagemass).substring(0, 6));
        this.PAP001storagemass = element.data().PAP001;
        this.PAP001storagemassz = (String(this.PAP001storagemass).substring(0, 6));
        this.PAP003storagemass = element.data().PAP003;
        this.PAP003storagemassz = (String(this.PAP003storagemass).substring(0, 6));
        this.HD001storagemass = element.data().HD001;
        this.HD001storagemassz = (String(this.HD001storagemass).substring(0, 6));
        this.LD001storagemass = element.data().LD001;
        this.LD001storagemassz = (String(this.LD001storagemass).substring(0, 6));
        this.LD003storagemass = element.data().LD003;
        this.LD003storagemassz = (String(this.LD003storagemass).substring(0, 6));
        this.PET001storagemass = element.data().PET00;
        this.PET001storagemassz = (String(this.PET001storagemass).substring(0, 6));
        this.PET003storagemass = element.data().PET003;
        this.PET003storagemassz = (String(this.PET003storagemass).substring(0, 6));
        this.PET005storagemass = element.data().PET005;
        this.PET005storagemassz = (String(this.PET005storagemass).substring(0, 6));

        // console.log(this.GH001storagemass);
        // console.log(this.NFAL01storagemass);

        // console.log(this.PAP005storagemass);
        // console.log(this.PAP007storagemass);
        // console.log(this.PAP001storagemass);
        // console.log(this.PAP003storagemass);

        // console.log(this.HD001storagemass);
        // console.log(this.LD001storagemass);
        // console.log(this.LD003storagemass);
        // console.log(this.PET001storagemass);
        // console.log(this.PET003storagemass);
        // console.log(this.PET005storagemass);

        this.paperTotal = this.paperTotal 
          +parseFloat(element.data().PAP001) +
          +parseFloat(element.data().PAP003) +
          +parseFloat(element.data().PAP005) +
          +parseFloat(element.data().PAP007);
        
          this.plasticTotal = this.paperTotal 
          +parseFloat(element.data().HD001) +
          +parseFloat(element.data().LD001) +
          +parseFloat(element.data().LD003) +
          +parseFloat(element.data().PET00) +
          +parseFloat(element.data().PET003) +
          +parseFloat(element.data().PET005);

        this.alumTotal = this.alumTotal +parseFloat(element.data().NFAL01);

        this.glassTotal = this.glassTotal +parseFloat(element.data().GH001);

      });
    })

   }
  ionViewDidEnter() {
    this.createLineChart();
  }
   //graph by fifi
//    var myLineChart = new Chart(ctx, {
//     type: 'line',
//     data: data,
//     options: options
// });

// createLineChart(){
//   Chart.defaults.global.defaultFontSize = 4;
//   Chart.defaults.global.defaultFontFamily = 'Roboto';

//   this.line = new Chart(this.createLineChart.nativeElement), {
//     type: 'line',
    
//   }
// }
// createLineChart() {
//   this.bars= new Chart(this.barChart.nativeElement, {
 
//     type: 'line',
//     data: {
//       labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//       datasets: [{
//         label: 'Material Delivered',
//         data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17, 8,10,2,89],
//         backgroundColor: '#ffd7e9', // array should have same number of elements as number of dataset
//         borderColor: '#ffd7e9',// array should have same number of elements as number of dataset
//         borderWidth: 1
//       }]
//     },
//     options: {
//       scales: {
//         yAxes: [{
//           ticks: {
//             beginAtZero: true
//           }
//         }]
//       }
//     }
//   });
// }

  pullHistoryData() {
    // January
    this.db.collection('outboundMass').where("driverID", "==", this.id).onSnapshot(snap => {
      // console.log(snap);
      snap.forEach(snap => {
        // console.log(snap.data());
        this.januserArray.push(snap.data());
        // console.log(this.januserArray);
        for (let keyjan in this.januserArray) {
          // console.log(this.januserArray[key].date);
          // console.log(this.januserArray[key].ovarallMass);
          if (this.januserArray[keyjan].date >= 'January 01 2020' && this.januserArray[keyjan].date <= 'January 31 2020') {
            // this.jantimeArray.push(this.januserArray[key])
            // console.log(this.jantimeArray);

            let janMass = 0;
            janMass = +janMass + +parseFloat(this.januserArray[keyjan].ovarallMass);
            this.jan = +this.jan + +janMass;
            console.log(this.jan);
          }
        }
      })
    })

    // February
    this.db.collection('outboundMass').where("driverID", "==", this.id).onSnapshot(snap => {
      // console.log(snap);
      snap.forEach(snap => {
        // console.log(snap.data());
        this.febuserArray.push(snap.data());
        // console.log(this.febuserArray);
        for (let keyfeb in this.febuserArray) {
          // console.log(this.febuserArray[key].date);
          // console.log(this.febuserArray[key].ovarallMass);
          if (this.febuserArray[keyfeb].date >= 'February 01 2020' && this.febuserArray[keyfeb].date <= 'February 28 2020') {
            // this.febtimeArray.push(this.febuserArray[key])
            // console.log(this.febtimeArray);

            let febMass = 0;
            febMass = +febMass + +parseFloat(this.febuserArray[keyfeb].ovarallMass);
            this.feb = +this.feb + +febMass
            console.log(this.feb);
          }
        }
      })
    })

    // March
    this.db.collection('outboundMass').where("driverID", "==", this.id).onSnapshot(snap => {
      // console.log(snap);

      let marMass = 0;

      snap.forEach(snap => {
        // console.log(snap.data());
        this.maruserArray.push(snap.data());
        // console.log(this.maruserArray);
        for (let keymar in this.maruserArray) {
          // console.log(this.maruserArray[key].date);
          // console.log(this.maruserArray[key].ovarallMass);
          if (this.maruserArray[keymar].date >= 'March 01 2020' && this.maruserArray[keymar].date <= 'March 31 2020') {
            marMass = +marMass + +parseFloat(this.maruserArray[keymar].ovarallMass);
          }
        }
        this.mar = +marMass;
        console.log(marMass);
        console.log(this.mar);
      })
    })

    // April
    this.db.collection('outboundMass').where("driverID", "==", this.id).onSnapshot(snap => {
      // console.log(snap);
      snap.forEach(snap => {
        // console.log(snap.data());
        this.apruserArray.push(snap.data());
        // console.log(this.apruserArray);
        for (let keyapr in this.apruserArray) {
          // console.log(this.apruserArray[key].date);
          // console.log(this.apruserArray[key].ovarallMass);
          if (this.apruserArray[keyapr].date >= 'April 01 2020' && this.apruserArray[keyapr].date <= 'April 30 2020') {
            // this.aprtimeArray.push(this.apruserArray[key])
            // console.log(this.aprtimeArray);

            let aprMass = 0;
            aprMass = +aprMass + +parseFloat(this.apruserArray[keyapr].ovarallMass);
            this.apr = +this.apr + +aprMass;
            console.log(this.apr);
          }
        }
      })
    })

    // May
    this.db.collection('outboundMass').where("driverID", "==", this.id).onSnapshot(snap => {
      // console.log(snap);
      snap.forEach(snap => {
        // console.log(snap.data());
        this.mayuserArray.push(snap.data());
        // console.log(this.mayuserArray);
        for (let keymay in this.mayuserArray) {
          // console.log(this.mayuserArray[key].date);
          // console.log(this.mayuserArray[key].ovarallMass);
          if (this.mayuserArray[keymay].date >= 'May 01 2020' && this.mayuserArray[keymay].date <= 'May 31 2020') {
            // this.maytimeArray.push(this.mayuserArray[key])
            // console.log(this.maytimeArray);

            let mayMass = 0;
            mayMass = +mayMass + +parseFloat(this.mayuserArray[keymay].ovarallMass);
            this.may = +this.may + +mayMass;
            console.log(this.may);
          }
        }
      })
    })

    // June
    this.db.collection('outboundMass').where("driverID", "==", this.id).onSnapshot(snap => {
      // console.log(snap);
      snap.forEach(snap => {
        // console.log(snap.data());
        this.junuserArray.push(snap.data());
        // console.log(this.junuserArray);
        for (let keyjun in this.junuserArray) {
          // console.log(this.junuserArray[key].date);
          // console.log(this.junuserArray[key].ovarallMass);
          if (this.junuserArray[keyjun].date >= 'June 01 2020' && this.junuserArray[keyjun].date <= 'June 30 2020') {
            // this.juntimeArray.push(this.junuserArray[key])
            // console.log(this.juntimeArray);

            let junMass = 0;
            junMass = +junMass + +parseFloat(this.junuserArray[keyjun].ovarallMass);
            this.jun = +this.jun + +junMass;
            console.log(this.jun);
          }
        }
      })
    })

    // July
    this.db.collection('outboundMass').where("driverID", "==", this.id).onSnapshot(snap => {
      // console.log(snap);
      snap.forEach(snap => {
        // console.log(snap.data());
        this.juluserArray.push(snap.data());
        // console.log(this.juluserArray);
        for (let keyjul in this.juluserArray) {
          // console.log(this.juluserArray[key].date);
          // console.log(this.juluserArray[key].ovarallMass);
          if (this.juluserArray[keyjul].date >= 'July 01 2020' && this.juluserArray[keyjul].date <= 'July 31 2020') {
            // this.jultimeArray.push(this.juluserArray[key])
            // console.log(this.jultimeArray);

            let julMass = 0;
            julMass = +julMass + +parseFloat(this.juluserArray[keyjul].ovarallMass);
            this.jul = +this.jul + +julMass;
            console.log(this.jul);
          }
        }
      })
    })

    // August
    this.db.collection('outboundMass').where("driverID", "==", this.id).onSnapshot(snap => {
      // console.log(snap);
      snap.forEach(snap => {
        // console.log(snap.data());
        this.auguserArray.push(snap.data());
        // console.log(this.auguserArray);
        for (let keyaug in this.auguserArray) {
          // console.log(this.auguserArray[key].date);
          // console.log(this.auguserArray[key].ovarallMass);
          if (this.auguserArray[keyaug].date >= 'August 01 2020' && this.auguserArray[keyaug].date <= 'August 30 2020') {
            // this.augtimeArray.push(this.auguserArray[key])
            // console.log(this.augtimeArray);

            let augMass = 0;
            augMass = +augMass + +parseFloat(this.auguserArray[keyaug].ovarallMass);
            this.aug = +this.aug + +augMass; 
            console.log(this.aug);
          }
        }
      })
    })

    // September
    this.db.collection('outboundMass').where("driverID", "==", this.id).onSnapshot(snap => {
      // console.log(snap);
      snap.forEach(snap => {
        // console.log(snap.data());
        this.sepuserArray.push(snap.data());
        // console.log(this.sepuserArray);
        for (let keysep in this.sepuserArray) {
          // console.log(this.sepuserArray[key].date);
          // console.log(this.sepuserArray[key].ovarallMass);
          if (this.sepuserArray[keysep].date >= 'September 01 2020' && this.sepuserArray[keysep].date <= 'September 31 2020') {
            // this.septimeArray.push(this.sepuserArray[key])
            // console.log(this.septimeArray);

            let sepMass = 0;
            sepMass = +sepMass + +parseFloat(this.sepuserArray[keysep].ovarallMass);
            this.sep = +this.sep + +sepMass;
            console.log(this.sep);
          }
        }
      })
    })

    // October
    this.db.collection('outboundMass').where("driverID", "==", this.id).onSnapshot(snap => {
      // console.log(snap);
      snap.forEach(snap => {
        // console.log(snap.data());
        this.octuserArray.push(snap.data());
        // console.log(this.octuserArray);
        for (let keyoct in this.octuserArray) {
          // console.log(this.octuserArray[key].date);
          // console.log(this.octuserArray[key].ovarallMass);
          if (this.octuserArray[keyoct].date >= 'October 01 2020' && this.octuserArray[keyoct].date <= 'October 30 2020') {
            // this.octtimeArray.push(this.octuserArray[key])
            // console.log(this.octtimeArray);

            let octMass = 0;
            octMass = +octMass + +parseFloat(this.octuserArray[keyoct].ovarallMass);
            this.oct = +this.oct + +octMass;
            console.log(this.oct);
          }
        }
      })
    })

    // November
    this.db.collection('outboundMass').where("driverID", "==", this.id).onSnapshot(snap => {
      // console.log(snap);
      snap.forEach(snap => {
        // console.log(snap.data());
        this.novuserArray.push(snap.data());
        // console.log(this.novuserArray);
        for (let keynov in this.novuserArray) {
          // console.log(this.novuserArray[key].date);
          // console.log(this.novuserArray[key].ovarallMass);
          if (this.novuserArray[keynov].date >= 'November 01 2020' && this.novuserArray[keynov].date <= 'November 30 2020') {
            // this.novtimeArray.push(this.novuserArray[key])
            // console.log(this.novtimeArray);

            let novMass = 0;
            novMass = +novMass + +parseFloat(this.novuserArray[keynov].ovarallMass);
            this.nov = +this.nov + +novMass;
            console.log(this.nov);
          }
        }
      })
    })

    // December
    this.db.collection('outboundMass').where("driverID", "==", this.id).onSnapshot(snap => {
      // console.log(snap);
      snap.forEach(snap => {
        // console.log(snap.data());
        this.decuserArray.push(snap.data());
        // console.log(this.decuserArray);
        for (let keydec in this.decuserArray) {
          // console.log(this.decuserArray[key].date);
          // console.log(this.decuserArray[key].ovarallMass);
          if (this.decuserArray[keydec].date >= 'December 01 2020' && this.decuserArray[keydec].date <= 'December 31 2020') {
            // this.dectimeArray.push(this.decuserArray[key])
            // console.log(this.dectimeArray);

            let decMass = 0;
            decMass = +decMass + +parseFloat(this.decuserArray[keydec].ovarallMass);
            this.dec = +this.dec + +decMass; 
            console.log(this.dec);
          }
        }
      })
    })

  }


  createLineChart() {
    Chart.defaults.global.defaultFontSize = 13;
    Chart.defaults.global.defaultFontFamily = 'Roboto';

    this.bars= new Chart(this.barChart.nativeElement, {
   
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Material Delivered',
          data: [this.jan, this.feb, this.mar, this.apr, this.may, 
                this.jun, this.jul, this.aug, this.sep, this.oct,
                this.nov, this.dec],
          backgroundColor: '#ffd7e9', // array should have same number of elements as number of dataset
          borderColor: '#ffd7e9',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

}
