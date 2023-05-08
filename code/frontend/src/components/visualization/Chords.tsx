import * as React from "react";
import Plotly, { Data, Layout } from 'plotly.js';
import { useEffect, useRef } from "react";
import Plot from 'react-plotly.js';

interface File {
  name: string;
  id: number;
  index: number;
  size: number;
  keywords: string[];
}

interface ChordsData {
  id: number;
  range: string;
  nodes: File[];
}

export interface ChordsProps {
  buckets: ChordsData[];
  filesCount: number;
}

interface PlotProps {
  data: Data[];
  layout: Layout;
}

function createMatrix(buckets: ChordsData[], filesCount: number) {
  const matrix = Array(buckets.length + filesCount).fill(0).map(() => Array(buckets.length + filesCount).fill(0));

  buckets.forEach((bucket, j) => {
    bucket.nodes.forEach((file) => {
      matrix[file.index][filesCount + j - 1] = 1;
      matrix[filesCount + j - 1][file.index] = 1;
    });
  });

  return matrix;
}

/*const Plot: React.FC<PlotProps> = ({ data, layout }) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (plotRef.current) {
      Plotly.newPlot(plotRef.current, data, layout);
    }
  }, [data, layout]);

  return <div ref={plotRef} style={{ width: "100%", height: "100%" }} />;
};*/

function formatName(name: string) {
  if (name.length > 30) {
    return name.slice(0, 30) + '...';
  }
  return name;
}

const ChordDiagram: React.FC<ChordsProps> = ({ buckets, filesCount }) => {
  buckets.forEach((bucket) => {
    bucket.nodes.sort((a, b) => a.name.localeCompare(b.name));
  });
  
  const matrix = createMatrix(buckets, filesCount);
  const labels = [...buckets.flatMap(b => b.nodes).map((file) => formatName(file.name)), ...buckets.map((bucket) => bucket.range)];
  const fullLabels = [...buckets.flatMap(b => b.nodes).map((file) => file.name), ...buckets.map((bucket) => bucket.range)];
  const source: number[] = [];
  const target: number[] = [];
  const value: number[] = [];

  matrix.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell > 0) {
        source.push(i);
        target.push(j);
        value.push(cell);
      }
    });
  });

  const data = [
    {
      type: "sankey",
      node: {
        pad: 12.5,
        thickness: 15,
        line: {
          color: "black",
          width: 0.5,
        },
        label: labels,
        customdata: fullLabels,
        hovertemplate: "%{customdata}<extra></extra>",
      },
      link: {
        source: source,
        target: target,
        value: value,
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
  ];

  const layout = {
    font: {
      size: 14,
    },
    height: 1000,
    autosize: true
  };

  return <Plot data={data as any} layout={layout as any} style={{ width: '100%', height: '100%' }} />;
};

export default ChordDiagram;