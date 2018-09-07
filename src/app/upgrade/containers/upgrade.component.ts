import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import * as math from 'mathjs';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css'],
})
export class UpgradeComponent implements OnInit {
  formGroup = new FormGroup({
    upgradePercentage: new FormControl(0.39, Validators.required),
    upgradeLimit: new FormControl(8, Validators.required),
    innocentPercentage: new FormControl(0.45, Validators.required),
    whitePercentage: new FormControl(0.1, Validators.required),
    hammerPercentage: new FormControl(0.5, Validators.required),
    innocentLimit: new FormControl(4, Validators.required),
  });

  innocentMean: number;
  innocentChart = {
    color: ['#FF4081'],
    grid: {
      left: 50,
      top: 20,
      right: 0,
      bottom: 60,
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: { type: 'value' },
    series: [{ name: 'bar', type: 'bar', data: [], markLine: {} }],
    tooltip: {},
  };

  whiteMean: number;
  whiteChart = {
    color: ['#FF4081'],
    grid: {
      left: 50,
      top: 20,
      right: 0,
      bottom: 30,
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: { type: 'value' },
    series: [{ name: 'bar', type: 'bar', data: [], markLine: {} }],
    tooltip: {},
  };

  constructor() {}

  ngOnInit() {}

  calculate() {
    const data = {
      ...this.init({
        upgradeLimit: +this.formGroup.value.upgradeLimit,
        upgradePercentage: +this.formGroup.value.upgradePercentage,
      }),
      innocentPercentage: +this.formGroup.value.innocentPercentage,
      whitePercentage: +this.formGroup.value.whitePercentage,
      innocentLimit: +this.formGroup.value.innocentLimit,
      hammerPercentage: +this.formGroup.value.hammerPercentage,
    };
    this.innocentMean = this.getInnocentMean(data);
    this.whiteMean = this.getWhiteMean(data);
    this.updateInnocentChart(data);
    this.updateWhiteChart(data);
  }

  updateInnocentChart(data) {
    let sum = 0;
    const xAxis = [];
    const series = [];
    let innocent90 = 0;
    let innocent95 = 0;
    for (let i = 0; sum < 0.999; i++) {
      xAxis[i] = i;
      series[i] = this.getInnocentProb(i, data);
      sum += series[i];
      if (!innocent90 && sum >= 0.9) {
        innocent90 = i;
      }
      if (!innocent95 && sum >= 0.95) {
        innocent95 = i;
      }
    }
    this.innocentChart = {
      color: ['#FF4081'],
      grid: {
        left: 50,
        top: 20,
        right: 0,
        bottom: 60,
      },
      xAxis: {
        type: 'category',
        data: xAxis,
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'Innocent',
          type: 'bar',
          data: series,
          markLine: {
            lineStyle: {
              color: '#3f51b5',
            },
            data: [
              {
                label: {
                  formatter: 'Avg',
                },
                xAxis: this.innocentMean,
              },
              {
                label: {
                  formatter: '90%',
                },
                xAxis: innocent90,
              },
              {
                label: {
                  formatter: '95%',
                },
                xAxis: innocent95,
              },
            ],
          },
        },
      ],
      tooltip: {},
    };
  }

  updateWhiteChart(data) {
    let sum = 0;
    const xAxis = [];
    const series = [];
    let white90 = 0;
    let white95 = 0;
    for (let i = 0; sum < 0.999; i++) {
      xAxis[i] = i;
      series[i] = this.getWhiteProb(i, data);
      sum += series[i];
      if (!white90 && sum >= 0.9) {
        white90 = i;
      }
      if (!white95 && sum >= 0.95) {
        white95 = i;
      }
    }
    this.whiteChart = {
      color: ['#FF4081'],
      grid: {
        left: 50,
        top: 20,
        right: 0,
        bottom: 60,
      },
      xAxis: {
        type: 'category',
        data: xAxis,
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'White',
          type: 'bar',
          data: series,
          markLine: {
            lineStyle: {
              color: '#3f51b5',
            },
            data: [
              {
                label: {
                  formatter: 'Avg',
                },
                xAxis: this.whiteMean,
              },
              {
                label: {
                  formatter: '90%',
                },
                xAxis: white90,
              },
              {
                label: {
                  formatter: '95%',
                },
                xAxis: white95,
              },
            ],
          },
        },
      ],
      tooltip: {},
    };
  }

  init({ upgradeLimit, upgradePercentage }) {
    const upgradeBinom = [];
    const upgradeBinomCum = [];
    for (let i = 0; i <= upgradeLimit; i++) {
      upgradeBinom[i] =
        math.pow(1 - upgradePercentage, upgradeLimit - i) *
        math.pow(upgradePercentage, i) *
        math.combinations(upgradeLimit, i);
    }
    for (let i = 0; i <= upgradeLimit; i++) {
      upgradeBinomCum[i] = 0;
      for (let j = i; j <= upgradeLimit; j++) {
        upgradeBinomCum[i] += upgradeBinom[j];
      }
    }
    return {
      upgradeLimit,
      upgradePercentage,
      upgradeBinomCum,
      upgradeBinom,
    };
  }

  getInnocentProb(i, { upgradeBinomCum, innocentLimit, innocentPercentage }) {
    const p = upgradeBinomCum[innocentLimit];
    if (i === 0) {
      return p;
    }
    const q = 1 - p;
    const k = innocentPercentage;
    return p * q * k * math.pow(1 - p * k, i - 1);
  }

  getInnocentMean({ upgradeBinomCum, innocentLimit, innocentPercentage }) {
    const p = upgradeBinomCum[innocentLimit];
    const q = 1 - p;
    const k = innocentPercentage;
    return q / (p * k);
  }

  getWhiteProb(
    i,
    {
      upgradeBinom,
      upgradeBinomCum,
      upgradePercentage,
      upgradeLimit,
      innocentLimit,
      whitePercentage,
      hammerPercentage,
    },
  ) {
    const p = upgradePercentage * hammerPercentage;
    const q = 1 - p;
    const rate = upgradePercentage * whitePercentage;
    if (i === 0) {
      return (upgradeBinom[upgradeLimit] / upgradeBinomCum[innocentLimit]) * p;
    }
    let sum = 0;
    for (let j = 1; j <= upgradeLimit - innocentLimit + 1; j++) {
      const prob =
        upgradeBinom[upgradeLimit - j + 1] / upgradeBinomCum[innocentLimit];
      if (i >= j) {
        sum +=
          q *
          prob *
          math.combinations(i - 1, j - 1) *
          math.pow(rate, j) *
          math.pow(1 - rate, i - j);
      }
      if (j >= 2 && i >= j - 1) {
        sum +=
          p *
          prob *
          math.combinations(i - 1, j - 2) *
          math.pow(rate, j - 1) *
          math.pow(1 - rate, i - j + 1);
      }
    }
    return sum;
  }

  getWhiteMean({
    upgradeBinom,
    upgradeBinomCum,
    upgradePercentage,
    upgradeLimit,
    innocentLimit,
    whitePercentage,
    hammerPercentage,
  }) {
    let sum = 0;
    for (let j = 1; j <= upgradeLimit - innocentLimit + 1; j++) {
      sum +=
        (upgradeBinom[upgradeLimit - j + 1] / upgradeBinomCum[innocentLimit]) *
        j;
    }
    sum /= upgradePercentage * whitePercentage;
    sum -= hammerPercentage / whitePercentage;
    return sum;
  }
}