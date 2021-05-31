import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { AutoCompleteService } from 'ionic4-auto-complete';

@Injectable({
  providedIn: 'root'
})
export class LugaresService implements AutoCompleteService {
  labelAttribute = 'name';

  private countries: any[] = [];

  constructor(private http: HttpClient, private apiService: ApiService) {

  }

  getResults(keyword: string): Observable<any[]> {
    let observable: Observable<any>;

    if (this.countries.length === 0) {
      // observable = this.http.get('https://restcountries.eu/rest/v2/all');
      observable = this.apiService.get('lugares');
    } else {
      observable = of(this.countries);
    }

    return observable.pipe(
      map(
        (result) => {
          return result.filter(
            (item) => {
              return item.nombre.toLowerCase().startsWith(
                keyword.toLowerCase()
              );
            }
          );
        }
      )
    );
  }
}