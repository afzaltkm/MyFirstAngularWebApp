import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatTable } from '@angular/material';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { HttpClient } from '@angular/common/http';

export interface UsersData {
  name: string;
  id: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  displayedColumns: string[] = ['name', 'age', 'course', 'action'];
  dataSource: any;
  public student: Student;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(public dialog: MatDialog, public http: HttpClient, @Inject('BASE_URL') public baseUrl: string) {
    http.get<Student[]>(baseUrl + 'api/Students').subscribe(result => {
      this.dataSource = result;
    }, error => console.error(error));
  }

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '300px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.addRowData(result.data);
      } else if (result.event == 'Update') {
        this.updateRowData(result.data);
      } else if (result.event == 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(newRow) {
    this.dataSource.push({
      name: newRow.name,
      age: newRow.age,
      course: newRow.course,
    });

    this.student = {
      id: newRow.id,
      name: newRow.name,
      age: parseInt(newRow.age),
      course: newRow.course,
    };
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(this.student);
    this.http.post<Student>(this.baseUrl + 'api/Students', body, { 'headers': headers }).subscribe(data => {
    })

    this.table.renderRows();

  }
  updateRowData(newRow) {
    this.dataSource = this.dataSource.filter((value, key) => {
      if (value.id == newRow.id) {
        value.name = newRow.name;
        value.age = newRow.age;
        value.course = newRow.course;
      }

      this.student = {
        id: newRow.id,
        name: newRow.name,
        age: parseInt(newRow.age),
        course: newRow.course
      };
      const headers = { 'content-type': 'application/json' }
      const body = JSON.stringify(this.student);
      this.http.put<Student[]>(this.baseUrl + 'api/Students/' + newRow.id, body, { 'headers': headers }).subscribe(data => {
      })
      return true;
    });
  }
  deleteRowData(newRow) {
    this.dataSource = this.dataSource.filter((value, key) => {
      this.http.delete<Student>(this.baseUrl + 'api/Students/' + newRow.id).subscribe(data => {
      })
      return value.id != newRow.id;
    });
  }
}


interface Student {
  id: number;
  name: string;
  age: number;
  course: string;
}
