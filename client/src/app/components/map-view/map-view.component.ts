import { AlertModalComponent } from './../alert-modal/alert-modal.component';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit {
  public diasterFormCtrl = new FormControl(['Earthquake']);
  public disasterList: string[] = [
    'Earthquake',
    'Volcano',
    'Tsunami',
    'Landslide',
  ];

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
    navigator.geolocation.getCurrentPosition(
      this.successLocation,
      errorLocation,
      {
        enableHighAccuracy: true,
      }
    );
    function errorLocation() {}
    // this.openDialog();
  }

  successLocation = () => {
    this.setupMap([136.7, 37.5]);
  };

  setMarkerOnMap(map: any, data: any) {
    this.diasterFormCtrl.value.forEach((value: any) => {
      if (value.includes('Earthquake')) {
        data.earthquake.forEach((disaster: any) => {
          new mapboxgl.Marker({})
            .setLngLat([disaster.long, disaster.lat])
            .addTo(map);
        });
      }
      if (value.includes('Volcano')) {
        data.volcano.forEach((disaster: any) => {
          new mapboxgl.Marker({})
            .setLngLat([disaster.long, disaster.lat])
            .addTo(map);
        });
      }
    });
  }

  setupMap(center: any) {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: center,
      zoom: 4.5,
    });

    //Navigator control
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    //Logic to place markers on map
    fetch('../../../assets/disasterdata.json')
      .then((res) => res.json())
      .then((data) => {
        this.setMarkerOnMap(map, data);
      });
  }
  openDialog() {
    const dialogRef = this.dialog.open(AlertModalComponent, {
      width: '450px',
      data: { type: 'Tsunami', message: 'coming from backend' },
    });
  }
}
