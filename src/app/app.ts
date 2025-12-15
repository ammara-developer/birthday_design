import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TeacherBirthdayComponent } from './teacher-birthday/teacher-birthday.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TeacherBirthdayComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('birthday');
}
