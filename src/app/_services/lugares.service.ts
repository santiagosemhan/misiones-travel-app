import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { AutoCompleteService } from 'ionic4-auto-complete';

@Injectable({
  providedIn: 'root'
})
export class LugaresService implements AutoCompleteService {
  labelAttribute = 'name';

  private lugares: any[] = [];

  constructor(private apiService: ApiService) {

  }

  getResults(keyword: string): Observable<any[]> {
    let observable: Observable<any>;

    if (this.lugares.length === 0) {
      let param = {
        'nombre_contains': keyword,
        '_limit': 10
      }
      observable = this.apiService.get('lugares', param);
    } else {
      observable = of(this.lugares);
    }

    return observable.pipe(
      map(
        (result) => {
          return result.filter(
            (item) => {
              return item.nombre.toLowerCase().includes(
                keyword.toLowerCase()
              );
            }
          );
        }
      )
    );
  }
}