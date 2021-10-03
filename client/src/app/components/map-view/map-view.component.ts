import { AlertModalComponent } from './../alert-modal/alert-modal.component';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Chart, registerables } from 'chart.js';
import { MapChartService } from 'src/app/services/map-chart.service';
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
  chart: any = [];

  constructor(
    public dialog: MatDialog,
    private mapChartService: MapChartService,
    private socketService: SocketIoService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.socketService.setupConnection();
    // Subscribe to Data Stream
    // this.renderGraphs();

    this.socketService.getKarenStream().subscribe((val) => {
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
    this.loadTemperatureData();
    this.loadHumidityData();
    this.loadRainData();
    // this.openDialog();
  }

  renderGraphs() {
    this.socketService.getDataStream().subscribe((val) => {
      console.log(val);
    });
  }

  successLocation = () => {
    this.setupMap([145.5, 37.5]);
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
    this.setupMap([145.5, 37.5]);
  }

  loadTemperatureData() {
    this.mapChartService.graphData().subscribe((res: any) => {
      let temp_max = res['list'].map((res: any) => res.main.temp_max);
      let temp_min = res['list'].map((res: any) => res.main.temp_min);
      let alldates = res['list'].map((res: any) => res.dt);

      let weatherDates: any = [];
      alldates.forEach((res: any) => {
        let jsdate = new Date(res * 1000);
        weatherDates.push(
          jsdate.toLocaleTimeString('en', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        );
      });

      this.chart = new Chart('tempChart', {
        type: 'line',
        data: {
          labels: weatherDates,
          datasets: [
            {
              data: temp_max,
              borderColor: '#3cba9f',
              fill: false,
            },
            {
              data: temp_min,
              borderColor: '#ffcc00',
              fill: false,
            },
          ],
        },
        // options: {
        //   legend: {
        //     display: false
        //   },
        // scales: {
        //   xAxes: [{
        //     display: true
        //   }],
        //   yAxes: [{
        //     display: true
        //   }]
        // }
        // }
      });
    });
  }

  loadHumidityData() {}

  loadRainData() {}

  openDialog(val: any) {
    const dialogRef = this.dialog.open(AlertModalComponent, {
      width: '450px',
      data: { type: val.disasterType, message: val.message },
    });
  }
}
