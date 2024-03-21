// WineStats.tsx

import React from 'react';
import { wineDataArray } from '../Data/Wine-Data';
import '../stylesheets/WineStats.css';

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

const WineStats: React.FC = () => {
  // Utility function to calculate mean
  const calculateMean = (data: Wine[], className: number) => {
    const classData = data.filter(wine => wine.Alcohol === className);
    const flavanoidsValues = classData.map(wine => typeof wine.Flavanoids === 'string' ? parseFloat(wine.Flavanoids) : wine.Flavanoids);
    const mean = flavanoidsValues.reduce((acc, val) => acc + val, 0) / flavanoidsValues.length;
    return mean.toFixed(2); // Round to 2 decimal places
  };

  // Utility function to calculate median
  const calculateMedian = (data: Wine[], className: number) => {
    const classData = data.filter(wine => wine.Alcohol === className);
    const sortedFlavanoids = classData.map(wine => typeof wine.Flavanoids === 'string' ? parseFloat(wine.Flavanoids) : wine.Flavanoids).sort((a, b) => a - b);
    const mid = Math.floor(sortedFlavanoids.length / 2);
    if (sortedFlavanoids.length % 2 === 0) {
      return ((sortedFlavanoids[mid - 1] + sortedFlavanoids[mid]) / 2).toFixed(2);
    } else {
      return sortedFlavanoids[mid].toFixed(2);
    }
  };

  // Utility function to calculate mode
  const calculateMode = (data: Wine[], className: number) => {
    const classData = data.filter(wine => wine.Alcohol === className);
    const flavanoidsMap = new Map<number, number>();
    classData.forEach(wine => {
      const value = typeof wine.Flavanoids === 'string' ? parseFloat(wine.Flavanoids) : wine.Flavanoids;
      const count = flavanoidsMap.get(value) || 0;
      flavanoidsMap.set(value, count + 1);
    });
    const mode = Array.from(flavanoidsMap.entries()).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    return mode.toFixed(2);
  };

  // Define classes
  const classes = Array.from(new Set(wineDataArray.map(wine => wine.Alcohol)));

  return (
      <div className="wine-stats-container">
      <h2>Wine Stats Table</h2>
        <table className="wine-stats-table">
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
              <td className="measure">Flavanoids Mean</td>
              {classes.map(className => (
                <td key={className} className="class-value">{calculateMean(wineDataArray, className)}</td>
              ))}
            </tr>
            <tr>
              <td className="measure">Flavanoids Median</td>
              {classes.map(className => (
                <td key={className} className="class-value">{calculateMedian(wineDataArray, className)}</td>
              ))}
            </tr>
            <tr>
              <td className="measure">Flavanoids Mode</td>
              {classes.map(className => (
                <td key={className} className="class-value">{calculateMode(wineDataArray, className)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
  );
};

export default WineStats;
