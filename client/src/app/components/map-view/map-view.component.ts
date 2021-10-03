import { AlertModalComponent } from './../alert-modal/alert-modal.component';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SocketIoService } from 'src/app/shared/services/socket-io.service';

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

  constructor(
    public dialog: MatDialog,
    private socketService: SocketIoService
  ) {}

  ngOnInit(): void {
    this.socketService.setupConnection();
    // Subscribe to Data Stream
    // this.renderGraphs();

    this.socketService.getKarenStream().subscribe((val: any) => {
      this.socketService.setMessage(val.message);
      this.openDialog(val);
    });
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
    navigator.geolocation.getCurrentPosition(
      this.successLocation,
      errorLocation,
      {
        enableHighAccuracy: true,
      }
    );
    function errorLocation() {}
  }

  renderGraphs() {
    this.socketService.getDataStream().subscribe((val) => {
      console.log(val);
    });
  }

  successLocation = () => {
    this.setupMap([136.7, 37.5]);
  };

  setMarkerOnMap(map: any, data: any) {
    this.diasterFormCtrl.value.forEach((value: any) => {
      if (value.includes('Earthquake')) {
        data.earthquake.forEach((disaster: any) => {
          const popup = new mapboxgl.Popup({ offset: 25 }).setText(
            `Date:${disaster.date}
            Magnitude:${disaster.magnitude}`
          );
          new mapboxgl.Marker({})
            .setLngLat([
              parseFloat(disaster.longitude),
              parseFloat(disaster.latitude),
            ])
            .setPopup(popup)
            .addTo(map);
        });
      }
      if (value.includes('Volcano')) {
        data.volcano.forEach((disaster: any) => {
          const popup = new mapboxgl.Popup({ offset: 25 }).setText(
            `Year:${disaster.year}
            Casualities:${disaster.casualties}
            VolcanoName:${disaster.volcanoName}
            Elevation:${disaster.elevation}
            VolcanoType:${disaster.volcanoType}`
          );
          new mapboxgl.Marker({ color: 'red' })
            .setLngLat([
              parseFloat(disaster.longitude),
              parseFloat(disaster.latitude),
            ])
            .setPopup(popup)
            .addTo(map);
        });
      }
      if (value.includes('Tsunami')) {
        data.tsunami.forEach((disaster: any) => {
          const popup = new mapboxgl.Popup({ offset: 25 }).setText(
            `Location:${disaster.location}
            Cause:${disaster.cause}`
          );
          new mapboxgl.Marker({ color: 'green' })
            .setLngLat([
              parseFloat(disaster.longitude),
              parseFloat(disaster.latitude),
            ])
            .setPopup(popup)
            .addTo(map);
        });
      }
      if (value.includes('Landslide')) {
        data.landslide.forEach((disaster: any) => {
          const popup = new mapboxgl.Popup({ offset: 25 }).setText(
            `Date:${disaster.date}
            Cause:${disaster.cause}`
          );
          new mapboxgl.Marker({ color: 'yellow' })
            .setLngLat([
              parseFloat(disaster.longitude),
              parseFloat(disaster.latitude),
            ])
            .setPopup(popup)
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
    fetch('https://guarded-atoll-48490.herokuapp.com/history')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.setMarkerOnMap(map, data);
      });
  }

  mapDisasterPoints() {
    this.setupMap([136.7, 37.5]);
  }

  openDialog(val: any) {
    const dialogRef = this.dialog.open(AlertModalComponent, {
      width: '450px',
      data: { type: val.disasterType, message: val.message },
    });
  }
}
