import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapChartService {

  constructor(private _http: HttpClient) { }

  graphData() {
    return this._http.get("https://guarded-atoll-48490.herokuapp.com/weather")
  }
}
