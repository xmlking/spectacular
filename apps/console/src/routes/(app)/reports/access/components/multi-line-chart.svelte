<script lang='ts'>
import { VisAxis, VisBulletLegend, VisLine, VisXYContainer } from '@unovis/svelte';
import { Scale } from '@unovis/ts';
import { type CityTemps, data, labels } from './mlc.data';

const x = (d: CityTemps) => +new Date(d.date);
const y = [(d: CityTemps) => d.austin, (d: CityTemps) => d.ny, (d: CityTemps) => d.sf];
const items = ['austin', 'ny', 'sf'].map((city) => ({ name: labels[city] }));
const xScale = Scale.scaleTime();
</script>

<VisBulletLegend {items}/>
<VisXYContainer data={data} height={300} {xScale}>
  <VisLine {x} {y}/>
  <VisAxis type="x" label="Date" numTicks={6} tickFormat={(value) => Intl.DateTimeFormat().format(value)}/>
  <VisAxis type="y" label="Temperature (celsius)"/>
</VisXYContainer>
