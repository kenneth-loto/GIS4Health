// utils/map-controls/LegendControl.ts
import maplibregl from 'maplibre-gl';

const legendHTML = `
<div style="font-size: 15px; color: black; font-weight: normal; padding: 5px; background-color: white; border-radius: 5px; overflow: hidden; margin-left: 10px; margin-bottom: 10px; max-width: 240px;">
  <div class='my-legend'>
    <div class='legend-title'>Heatmap Intensity (Weight)</div>
    <div class='legend-scale'>
      <ul class='legend-labels'>
        <li><span style='background:rgba(103,169,207,0.3);'></span>0.1 – 0.2</li>
        <li><span style='background:rgba(209,229,240,0.6);'></span>0.2 – 0.4</li>
        <li><span style='background:rgba(253,219,199,0.7);'></span>0.4 – 0.6</li>
        <li><span style='background:rgba(239,138,98,0.9);'></span>0.6 – 0.8</li>
        <li><span style='background:rgba(178,24,43,1);'></span>0.8 – 1.0</li>
      </ul>
    </div>
  </div>
</div>
<style>
  .my-legend .legend-title {
    text-align: left;
    margin-bottom: 4px;
    margin-left: 4px;
    font-weight: bold;
    font-size: 90%;
  }
  .my-legend .legend-scale ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .my-legend .legend-scale ul li {
    font-size: 85%;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
  }
  .my-legend ul.legend-labels li span {
    display: inline-block;
    height: 16px;
    width: 30px;
    margin-right: 8px;
    border: 1px solid #999;
  }
</style>
`;

// const legendStyle = `
//   padding: 8px;
//   background: white;
//   border-radius: 6px;
//   font-size: 13px;
//   box-shadow: 0 1px 4px rgba(0,0,0,0.3);
// `;

export class LegendControl implements maplibregl.IControl {
    private container!: HTMLElement;

    constructor(private content: string = legendHTML) {}

    onAdd(map: maplibregl.Map): HTMLElement {
        this.container = document.createElement('div');
        this.container.className = 'mapboxgl-ctrl';
        this.container.innerHTML = this.content;
        return this.container;
    }

    onRemove(): void {
        this.container.remove();
    }
}
