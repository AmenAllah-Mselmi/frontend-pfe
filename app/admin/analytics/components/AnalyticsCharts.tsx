'use client';
import { useEffect, useRef } from 'react';

interface ChartsProps {
  type: 'revenue' | 'pipeline' | 'deals';
  data: any[];
}

export default function AnalyticsCharts({ type, data }: ChartsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Set dimensions
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const padding = 40;

    if (type === 'revenue') {
      // Line chart for revenue
      const maxValue = Math.max(...data.map(d => d.value));
      const points = data.map((d, i) => ({
        x: padding + (i * (width - 2 * padding) / (data.length - 1)),
        y: height - padding - (d.value / maxValue) * (height - 2 * padding)
      }));

      // Draw grid
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padding + (i * (height - 2 * padding) / 4);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.strokeStyle = '#e5e7eb';
        ctx.stroke();
      }

      // Draw line
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw points
      points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#8b5cf6';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Inter';
      data.forEach((d, i) => {
        ctx.fillText(d.month, points[i].x - 15, height - 15);
      });

    } else if (type === 'pipeline') {
      // Bar chart for pipeline
      const maxValue = Math.max(...data.map(d => d.value));
      const barWidth = (width - 2 * padding - 20 * (data.length - 1)) / data.length;

      data.forEach((d, i) => {
        const x = padding + i * (barWidth + 20);
        const barHeight = (d.value / maxValue) * (height - 2 * padding);
        const y = height - padding - barHeight;

        // Draw bar
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw value
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 10px Inter';
        ctx.fillText(`${(d.value / 1000000).toFixed(1)}M`, x + 5, y - 5);

        // Draw label
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Inter';
        ctx.fillText(d.stage, x, height - 15);
      });

    } else if (type === 'deals') {
      // Grouped bar chart for deals
      const maxValue = Math.max(...data.flatMap(d => [d.won, d.lost, d.proposal]));
      const barWidth = (width - 2 * padding - 30 * (data.length - 1)) / (data.length * 3);

      data.forEach((d, i) => {
        const baseX = padding + i * (barWidth * 3 + 30);

        // Won bars
        const wonHeight = (d.won / maxValue) * (height - 2 * padding);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(baseX, height - padding - wonHeight, barWidth, wonHeight);

        // Lost bars
        const lostHeight = (d.lost / maxValue) * (height - 2 * padding);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(baseX + barWidth + 5, height - padding - lostHeight, barWidth, lostHeight);

        // Proposal bars
        const propHeight = (d.proposal / maxValue) * (height - 2 * padding);
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(baseX + 2 * (barWidth + 5), height - padding - propHeight, barWidth, propHeight);

        // Month label
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Inter';
        ctx.fillText(d.month, baseX + barWidth, height - 15);
      });

      // Legend
      ctx.fillStyle = '#10b981';
      ctx.fillRect(width - 120, 20, 12, 12);
      ctx.fillStyle = '#1f2937';
      ctx.font = '10px Inter';
      ctx.fillText('Won', width - 100, 30);

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(width - 120, 40, 12, 12);
      ctx.fillStyle = '#1f2937';
      ctx.fillText('Lost', width - 100, 50);

      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(width - 120, 60, 12, 12);
      ctx.fillStyle = '#1f2937';
      ctx.fillText('Proposal', width - 100, 70);
    }
  }, [type, data]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={300}
      className="w-full h-[300px]"
    />
  );
}