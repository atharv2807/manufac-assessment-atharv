// GammaStatsComponent.tsx

import React from 'react';
import { wineDataArray } from '../Data/Wine-Data';
import '../stylesheets/CalculateGamma.css';

interface Wine {
  Alcohol: number;
  "Malic Acid": number;
  Ash: string | number;
  "Alcalinity of ash": number;
  Magnesium: number;
  "Total phenols": number;
  Flavanoids: number | string;
  "Nonflavanoid phenols": number | string;
  Proanthocyanins: string | number;
  "Color intensity": number | string;
  Hue: number;
  "OD280/OD315 of diluted wines": string | number;
  Unknown: number;
}

const calculateGamma = (wine: Wine): number => {
  const { Ash, Hue, Magnesium } = wine;
  const ash = typeof Ash === 'string' ? parseFloat(Ash) : Ash;
  const hue = Hue;
  const magnesium = Magnesium;
  return (ash * hue) / magnesium;
};

const calculateClassStats = (data: Wine[], className: number): { mean: number, median: number, mode: number } => {
  const classData = data.filter(wine => wine.Alcohol === className);
  const gammaValues = classData.map(calculateGamma);

  // Calculate mean
  const mean = gammaValues.reduce((sum, val) => sum + val, 0) / gammaValues.length;

  // Calculate median
  const sortedValues = gammaValues.slice().sort((a, b) => a - b);
  const middle = Math.floor(sortedValues.length / 2);
  const median = sortedValues.length % 2 === 0 ? 
                 (sortedValues[middle - 1] + sortedValues[middle]) / 2 : 
                 sortedValues[middle];

  // Calculate mode
  const frequencyMap = new Map<number, number>();
  gammaValues.forEach((value) => {
    frequencyMap.set(value, (frequencyMap.get(value) || 0) + 1);
  });
  let mode = gammaValues[0];
  let maxFrequency = 0;
  frequencyMap.forEach((frequency, value) => {
    if (frequency > maxFrequency) {
      mode = value;
      maxFrequency = frequency;
    }
  });

  return { mean, median, mode };
};

const GammaStatsComponent: React.FC = () => {
  const classes = Array.from(new Set(wineDataArray.map(wine => wine.Alcohol)));

  return (
        <div className="gamma-stats-container">
        <h2>Gamma Calculation Table</h2>
        <table className="gamma-stats-table">
            <thead>
            <tr>
                <th className="header">Measure</th>
                {classes.map(className => (
                <th key={className} className="class-header">Class {className}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            <tr>
                <td className="measure">Gamma Mean</td>
                {classes.map(className => (
                <td key={className} className="class-value">{calculateClassStats(wineDataArray, className).mean.toFixed(2)}</td>
                ))}
            </tr>
            <tr>
                <td className="measure">Gamma Median</td>
                {classes.map(className => (
                <td key={className} className="class-value">{calculateClassStats(wineDataArray, className).median.toFixed(2)}</td>
                ))}
            </tr>
            <tr>
                <td className="measure">Gamma Mode</td>
                {classes.map(className => (
                <td key={className} className="class-value">{calculateClassStats(wineDataArray, className).mode.toFixed(2)}</td>
                ))}
            </tr>
            </tbody>
        </table>
        </div>
  );
};

export default GammaStatsComponent;
