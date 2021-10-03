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
  earhtquakeData: any = [];

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
    this.renderGraphs();

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
    this.loadTemperatureData();
    this.loadRainData();
    this.loadEarthquakeData();
        // this.openDialog();
  }

  renderGraphs() {
    this.socketService.getDataStream().subscribe((val) => {
      this.earhtquakeData = val;
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
    this.mapChartService.graphData().subscribe((data: any) => {
      let temperature: any = [];
      let humidity: any = [];
      let rain: any = [];
      let alldates: any = [];

      for (let i = 0; i < data.weatherData.length; i++) {
        if ((i >= 0 && i<=2) || (i >= 20 && i<=23) || (i >= 65 && i<=data.weatherData.length-1)) {
          temperature.push(data.weatherData[i].temperature);
          humidity.push(data.weatherData[i].humidity);
          rain.push(data.weatherData[i].rain);
          alldates.push(data.weatherData[i].dateTime);
        }
      }
      this.chart = new Chart('tempChart', {
        type: 'line',
        data: {
          labels: alldates,
          datasets: [
            {
              label: 'Temperature',
              data: temperature,
              borderColor: '#3cba9f',
              fill: false,
            },
            {
              label: 'Humidity',
              data: humidity,
              borderColor: '#ffcc00',
              fill: false,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            }
          },
        },
      });
    });
  }

  loadRainData() {
    this.mapChartService.graphData().subscribe((data: any) => {
      let rain: any = [];
      let alldates: any = [];

      for (let i = 0; i < data.weatherData.length; i++) {
        if ((i >= 0 && i<=2) || (i >= 20 && i<=23) || (i >= 65 && i<=data.weatherData.length-1)) {
          rain.push(data.weatherData[i].chanceOfRain);
          alldates.push(data.weatherData[i].dateTime);
        }
      }
      this.chart = new Chart('rainChart', {
        type: 'line',
        data: {
          labels: alldates,
          datasets: [
            {
              label: 'Chance Of Rain',
              data: rain,
              borderColor: '#3cba9f',
              fill: false,
            }
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            }
          },
        },
      });
    });
  }

  loadEarthquakeData(){
    this.mapChartService.graphData().subscribe((data: any) => {
      let rain: any = [3.7, 3.8, 3.9, 3.3, 3.2, 3.5, 4.2, 4.1, 4.3, 4.5, 4.7, 4.8, 4.7];
      let alldates: any = [];

      for (let i = 0; i < data.weatherData.length; i++) {
        if ((i >= 0 && i<=2) || (i >= 20 && i<=23) || (i >= 65 && i<=data.weatherData.length-1)) {
          alldates.push(data.weatherData[i].dateTime);
        }
      }
      this.chart = new Chart('sesmicChart', {
        type: 'line',
        data: {
          labels: alldates,
          datasets: [
            {
              label: 'Earthquake',
              data: rain,
              borderColor: '#3cba9f',
              fill: false,
            }
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            }
          },
        },
      });
    });
  }

  openDialog(val: any) {
    const dialogRef = this.dialog.open(AlertModalComponent, {
      width: '450px',
      data: { type: val.disasterType, message: val.message },
    });
  }
}
