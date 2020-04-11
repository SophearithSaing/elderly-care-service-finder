import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-services',
  templateUrl: './admin-services.component.html',
  styleUrls: ['./admin-services.component.css']
})
export class AdminServicesComponent implements OnInit {

  dailyCare = [];
  specialCare = [];

  additionalHeight: number;

  // dailyCare = [
  //   {
  //     name: 'Bathroom Assistance',
  //     checked: false
  //   },
  //   {
  //     name: 'Dressing Assitance',
  //     checked: false
  //   },
  //   {
  //     name: 'Meals',
  //     checked: false
  //   },
  //   {
  //     name: 'Joyful Companionship',
  //     checked: false
  //   }
  // ];

  // specialCare = [
  //   {
  //     name: 'Rehabilitation',
  //     checked: false
  //   },
  //   {
  //     name: 'Medicine',
  //     checked: false
  //   }
  // ];

  dc: Array<any> = [];
  sc: Array<any> = [];

  newDailyCare: any;
  newSpecialCare: any;

  dailyCareItem: string;
  specialCareItem: string;

  undoDC = false;
  undoSC = false;

  removedDC = [];
  removedSC = [];

  constructor(private admin: AdminService) { }

  ngOnInit() {
    this.admin.GetServices().subscribe((data) => {
      this.dc = data.dailyCare;
      this.sc = data.specialCare;
      console.log(this.dc);
      console.log(this.sc);
      this.dc.forEach(element => {
        const item = {
          name: element,
          checked: false
        };
        this.dailyCare.push(item);
      });
      this.sc.forEach(element => {
        const item = {
          name: element,
          checked: false
        };
        this.specialCare.push(item);
      });
    });
    console.log(this.dailyCare);
    console.log(this.specialCare);
  }

  getCheckboxes() {
    console.log(this.dailyCare.filter(x => x.checked === true).map(x => x.name));
    this.newDailyCare = this.dailyCare.filter(x => x.checked === true).map(x => x.name);

    console.log(this.specialCare.filter(x => x.checked === true).map(x => x.name));
    this.newSpecialCare = this.specialCare.filter(x => x.checked === true).map(x => x.name);
  }

  addDailyCareItem() {
    const newItem = {
      name: this.dailyCareItem,
      checked: false
    };
    this.dailyCare.push(newItem);
    console.log(this.dailyCare);

    this.dailyCareItem = null;
  }

  addSpecialCareItem() {
    const newItem = {
      name: this.specialCareItem,
      checked: false
    };
    this.specialCare.push(newItem);
    console.log(this.specialCare);

    this.specialCareItem = null;
  }

  removeDCItem() {
    this.newDailyCare.forEach(element => {
      const index = this.dc.indexOf(element);
      console.log(index);
      const item = this.dailyCare[index];
      // item.checked = false;
      this.removedDC.unshift(item);
      this.dailyCare.splice(index, 1);
    });
    console.log(this.dailyCare);

    this.undoDC = true;
  }

  removeSCItem() {
    this.newSpecialCare.forEach(element => {
      const index = this.sc.indexOf(element);
      this.specialCare.splice(index, 1);
    });
    console.log(this.specialCare);

    this.undoSC = true;
  }

  undoDCItem() {
    // this.undoDC = false;
    console.log(this.newDailyCare);
    // this.newDailyCare.forEach(element => {
    //   const item = {
    //     name: element,
    //     checked: false
    //   };
    //   this.dailyCare.push(item);
    // });
    // const item = {
    //   name: this.removedDC[0],
    //   checked: false
    // };
    const item = this.removedDC[0];

    this.removedDC.splice(0, 1);
    this.dailyCare.push(item);

    if (this.removedDC.length === 0) {
      this.undoDC = false;
    }
  }

  undoSCItem() {
    this.undoSC = false;
    console.log(this.newSpecialCare);
    this.newSpecialCare.forEach(element => {
      const item = {
        name: element,
        checked: false
      };
      this.specialCare.push(item);
    });
    console.log(this.specialCare);
  }

  saveChanges() {
    this.admin.UpdateServices(this.dailyCare, this.specialCare);
  }

}
