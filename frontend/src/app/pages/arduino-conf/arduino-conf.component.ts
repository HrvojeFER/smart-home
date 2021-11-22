import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';

import { UserService } from 'src/app/services/user/user.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

@Component({
  selector: 'app-arduino-conf',
  templateUrl: './arduino-conf.component.html',
  styleUrls: ['./arduino-conf.component.css']
})
export class ArduinoConfComponent {
  private filterListChangeObservable: Observable<Array<string>>;
  private filterSubject: BehaviorSubject<string>;
  private selecting: boolean;

  public get Selecting(): boolean {
    return this.selecting;
  }

  public get FilterList(): Observable<Array<string>> {
    return this.filterListChangeObservable;
  }

  constructor(
    private user: UserService,
    private firestore: FirestoreService,
    private router: Router
  ) {
    this.filterSubject = new BehaviorSubject('');
    this.filterListChangeObservable = this.filterSubject.pipe(
      concatMap(filter =>
        from(this.firestore.GetArduinoList()).pipe(
          map(arduinos =>
            arduinos
              .filter(arduino =>
                arduino.name.toLowerCase().startsWith(filter.toLowerCase())
              )
              .map(arduino => arduino.name)
          )
        )
      )
    );
  }

  public async selectArduino(name: string) {
    this.selecting = true;
    await this.user.SetArduino(name);
    if (this.user.isAdmin) {
      await this.router.navigate(['admin']);
    } else {
      await this.router.navigate(['pending']);
    }
    this.selecting = false;
  }

  public filterArduinos(filter: string) {
    this.filterSubject.next(filter);
  }
}
