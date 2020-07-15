
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Product} from 'src/app/model/product';
import { Respack } from '../model/respack';
@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {
fgregister: FormGroup;
products: Product[];
product: Product; // we make product instance again to get id
state = 'default'; // used to enable and disable table and form

displayedColumns: string[] = ['id', 'name', 'email', 'password', 'action'];
dataSource: MatTableDataSource<Product>;

@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild(MatSort, {static: true}) sort: MatSort;
  obj: any;
// Following code is mandatory to paginator working up to --> tag
@ViewChild(MatSort) set matSort(ms: MatSort) {
  this.sort = ms;

}

@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
  this.paginator = mp;

}


// -->


  constructor(private fb: FormBuilder, private cs: CommonService) {
    this.fgregister = this.fb.group({
      name: ['', Validators.required],
      email: ['', [ Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]

    });
  }


// Method declared in ngOnInit used for show data in table
  ngOnInit(): void {
    this.cs.user_list().subscribe((products: Product[]) => {
      this.products = products;
      this.dataSource = new MatTableDataSource(this.products);   // Assign the data to the data source for the table to render
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



// All button used in template its logic is here
  add_newuser(){
this.state = 'add new user';
// here form used to clear form at template
this.fgregister = this.fb.group({
  name: ['', Validators.required],
  email: ['', [ Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]]

});

}
edit(row){
  this.state = 'edit row';
  this.product = row; // here actually fetching row with ID
  this.fgregister = this.fb.group({
    // id: [row.id],
    name: [row.name],
    email:  [row.email],
    password: [row.password]
  });
}
// save method used to add user data to database
save(){
  const obj = this.fgregister.value;
  this.cs.user_add(obj).subscribe((resp: Respack) => {
if ( resp.ack){
   obj.id = resp.id; // used to push newly generated row to table
   this.products.push(obj);
   this.reloadtable();
   this.cs.alert('success', 'Data save successfully', 'ok', 3000);
}
else{
  this.cs.alert('error', resp.description);
}
this.state = 'default';

  });
}
update(){
  const obj = this.fgregister.value;
  obj.id = this.product.id; // we are fetching id from product
  this.cs.user_update(obj).subscribe((resp: Respack) => {
    if (resp.ack){
      // following tow line used to update and reload table instantly
      this.products[this.products.indexOf(this.product)] = obj;
      this.reloadtable();

      this.cs.alert('success', 'Data Updated successfully', 'ok', 3000);
    }
    else{
      this.cs.alert('error',  'failed to update');
    }
    this.state = 'default';
  });
}
delete(){
this.cs.user_delete(this.product.id).subscribe((resp: Respack) => {
  if (resp.ack){
    this.products.splice(this.products.indexOf(this.product), 1); // this.product is nothing bu row of table
    this.reloadtable();
    this.cs.alert('success',  'Data deleted successfully');

  }
  else{
    this.cs.alert('error',  'Failed to delete data');
  }
  this.state = 'default';

});
}
back(){
  this.state = 'default';

}
reloadtable(){
  this.dataSource = new MatTableDataSource(this.products);   // Assign the data to the data source for the table to render
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

}
