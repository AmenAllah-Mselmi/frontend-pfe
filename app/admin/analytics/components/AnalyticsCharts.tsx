'use client';
import { useEffect, useRef } from 'react';

interface ChartsProps {
  type: 'revenue' | 'pipeline' | 'deals' | 'funnel' | 'heatmap' | 'statusPie';
  data: any[];
  height?: number;
}

const COLORS = ['#6366f1','#8b5cf6','#a78bfa','#c4b5fd','#10b981','#f59e0b','#ef4444','#3b82f6','#ec4899','#14b8a6'];

export default function AnalyticsCharts({ type, data, height = 300 }: ChartsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (!data || data.length === 0) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Aucune donnée disponible', rect.width / 2, rect.height / 2);
      return;
    }

    const W = rect.width, H = rect.height, P = 40;
    if (type === 'revenue') drawLineChart(ctx, data, W, H, P);
    else if (type === 'pipeline') drawBarChart(ctx, data, W, H, P);
    else if (type === 'deals') drawGroupedBar(ctx, data, W, H, P);
    else if (type === 'funnel') drawFunnel(ctx, data, W, H, P);
    else if (type === 'heatmap') drawHeatmap(ctx, data, W, H, P);
    else if (type === 'statusPie') drawPieChart(ctx, data, W, H);
  }, [type, data, height]);

  return <canvas ref={canvasRef} className="w-full rounded-lg" style={{ width: '100%', height: height }} />;
}

function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number, P: number, steps = 4) {
  ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
  for (let i = 0; i <= steps; i++) {
    const y = P + (i * (H - 2 * P) / steps);
    ctx.beginPath(); ctx.moveTo(P, y); ctx.lineTo(W - P, y); ctx.stroke();
  }
}

function drawLineChart(ctx: CanvasRenderingContext2D, data: any[], W: number, H: number, P: number) {
  drawGrid(ctx, W, H, P);
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const pts = data.map((d, i) => ({
    x: P + (i * (W - 2 * P) / Math.max(data.length - 1, 1)),
    y: H - P - (d.value / maxVal) * (H - 2 * P)
  }));

  // Gradient fill
  const grad = ctx.createLinearGradient(0, P, 0, H - P);
  grad.addColorStop(0, 'rgba(99,102,241,0.2)'); grad.addColorStop(1, 'rgba(99,102,241,0)');
  ctx.beginPath(); ctx.moveTo(pts[0].x, H - P);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, H - P); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();

  // Line
  ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();

  // Points & labels
  pts.forEach((p, i) => {
    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#6366f1'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.font = '10px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(data[i].month, p.x, H - 12);
  });
}

function drawBarChart(ctx: CanvasRenderingContext2D, data: any[], W: number, H: number, P: number) {
  drawGrid(ctx, W, H, P);
  const maxVal = Math.max(...data.map(d => d.count || d.value || 0), 1);
  const bw = Math.min((W - 2 * P) / data.length - 16, 50);
  data.forEach((d, i) => {
    const val = d.count || d.value || 0;
    const x = P + i * ((W - 2 * P) / data.length) + ((W - 2 * P) / data.length - bw) / 2;
    const bh = (val / maxVal) * (H - 2 * P);
    const y = H - P - bh;
    const g = ctx.createLinearGradient(x, y, x, H - P);
    g.addColorStop(0, COLORS[i % COLORS.length]); g.addColorStop(1, COLORS[i % COLORS.length] + '60');
    ctx.fillStyle = g;
    roundRect(ctx, x, y, bw, bh, 4);
    ctx.fillStyle = '#1e293b'; ctx.font = 'bold 10px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(String(val), x + bw / 2, y - 6);
    ctx.fillStyle = '#94a3b8'; ctx.font = '9px Inter, sans-serif';
    ctx.fillText(d.stage || d.month || '', x + bw / 2, H - 12);
  });
}

function drawGroupedBar(ctx: CanvasRenderingContext2D, data: any[], W: number, H: number, P: number) {
  drawGrid(ctx, W, H, P);
  const maxVal = Math.max(...data.flatMap(d => [d.won || 0, d.lost || 0, d.proposal || 0]), 1);
  const groupW = (W - 2 * P) / data.length;
  const bw = Math.min(groupW / 4, 18);
  const colors = ['#10b981', '#ef4444', '#8b5cf6'];
  data.forEach((d, i) => {
    const bx = P + i * groupW + (groupW - bw * 3 - 10) / 2;
    [d.won, d.lost, d.proposal].forEach((v, j) => {
      const bh = ((v || 0) / maxVal) * (H - 2 * P);
      ctx.fillStyle = colors[j];
      roundRect(ctx, bx + j * (bw + 5), H - P - bh, bw, bh, 3);
    });
    ctx.fillStyle = '#94a3b8'; ctx.font = '9px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(d.month, P + i * groupW + groupW / 2, H - 12);
  });
  // Legend
  ['Won', 'Lost', 'Proposal'].forEach((l, i) => {
    ctx.fillStyle = colors[i]; ctx.fillRect(W - 110, 14 + i * 18, 10, 10);
    ctx.fillStyle = '#475569'; ctx.font = '10px Inter, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(l, W - 95, 23 + i * 18);
  });
}

function drawFunnel(ctx: CanvasRenderingContext2D, data: any[], W: number, H: number, P: number) {
  const total = Math.max(data.reduce((s: number, d: any) => s + (d.count || 0), 0), 1);
  const fW = W - 2 * P;
  const stepH = (H - 2 * P) / data.length;
  const colors = ['#6366f1', '#8b5cf6', '#10b981', '#ef4444'];
  data.forEach((d: any, i: number) => {
    const ratio = Math.max((d.count || 0) / total, 0.15);
    const nextRatio = i < data.length - 1 ? Math.max((data[i + 1].count || 0) / total, 0.15) : ratio * 0.6;
    const y = P + i * stepH;
    const tw = fW * ratio, bw = fW * nextRatio;
    const tx = (W - tw) / 2, bx = (W - bw) / 2;
    ctx.beginPath();
    ctx.moveTo(tx, y); ctx.lineTo(tx + tw, y);
    ctx.lineTo(bx + bw, y + stepH); ctx.lineTo(bx, y + stepH);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length] + 'cc'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`${d.stage}: ${d.count}`, W / 2, y + stepH / 2 + 4);
  });
}

function drawPieChart(ctx: CanvasRenderingContext2D, data: any[], W: number, H: number) {
  const cx = W / 2 - 40, cy = H / 2, r = Math.min(W, H) / 2 - 40;
  const total = Math.max(data.reduce((s: number, d: any) => s + (d.value || 0), 0), 1);
  let startAngle = -Math.PI / 2;
  data.forEach((d: any, i: number) => {
    const slice = ((d.value || 0) / total) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + slice);
    ctx.closePath(); ctx.fillStyle = COLORS[i % COLORS.length]; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    startAngle += slice;
  });
  // Center hole (donut)
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = '#fff'; ctx.fill();
  // Legend
  data.forEach((d: any, i: number) => {
    const ly = 20 + i * 22;
    ctx.fillStyle = COLORS[i % COLORS.length]; ctx.fillRect(W - 120, ly, 10, 10);
    ctx.fillStyle = '#475569'; ctx.font = '10px Inter, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(`${d.label}: ${d.value}`, W - 105, ly + 9);
  });
}

function drawHeatmap(ctx: CanvasRenderingContext2D, data: any[], W: number, H: number, P: number) {
  if (!data || data.length < 7) return;
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const hours = 24;
  const cw = (W - P - 50) / hours, ch = (H - P - 30) / 7;
  const max = Math.max(...data.flat(), 1);
  data.forEach((row: number[], d: number) => {
    row.forEach((v: number, h: number) => {
      const intensity = v / max;
      const r = Math.round(99 + (1 - intensity) * 156);
      const g = Math.round(102 + (1 - intensity) * 153);
      const b = Math.round(241);
      ctx.fillStyle = intensity > 0 ? `rgba(${r},${g},${b},${Math.max(intensity, 0.08)})` : '#f8fafc';
      ctx.fillRect(50 + h * cw, 20 + d * ch, cw - 2, ch - 2);
    });
    ctx.fillStyle = '#94a3b8'; ctx.font = '9px Inter, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(days[d], 45, 20 + d * ch + ch / 2 + 3);
  });
  for (let h = 0; h < hours; h += 3) {
    ctx.fillStyle = '#94a3b8'; ctx.font = '8px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`${h}h`, 50 + h * cw + cw / 2, H - 8);
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); ctx.fill();
}