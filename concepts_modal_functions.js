// KCS Inspection Panel Functions
function openConceptsModal() {
  const panel = document.getElementById('div-kcs-inspection');
  panel.style.display = 'flex';
  createConceptsBarChart();
}

function closeConceptsInspection() {
  const panel = document.getElementById('div-kcs-inspection');
  panel.style.display = 'none';
}

function createConceptsBarChart() {
  const chartContainer = document.getElementById('concepts-bar-chart');
  chartContainer.innerHTML = '';

  if (!data || !data.kcs) {
    console.error('createConceptsBarChart: data.kcs is not available');
    return;
  }

  // Prepare data for the chart
  const chartData = data.kcs.map((concept, index) => {
    const uk = concept.uk || 0;
    const edition = concept.edition || 0;
    const finalValue = uk + edition;
    return {
      id: concept.id,
      name: concept.dn || `Concept ${index + 1}`,
      uk: uk,
      edition: edition,
      finalValue: finalValue,
      hasEdition: edition !== 0,
      selectedForRec: concept['selected-for-rec'] || false
    };
  });

  // Sort by final value (descending)
  chartData.sort((a, b) => b.finalValue - a.finalValue);

  // Find max value for scaling
  const maxValue = Math.max(1, ...chartData.map(d => d.finalValue));

  // Create chart
  const chart = document.createElement('div');
  chart.className = 'concepts-bar-chart-html';

  chartData.forEach(d => {
    const row = document.createElement('div');
    row.className = 'concept-bar-row';

    // Checkbox
    const checkbox = document.createElement('span');
    checkbox.className = 'concept-checkbox-html' + (d.selectedForRec ? ' checked' : '');
    checkbox.innerHTML = d.selectedForRec ? '✔' : '';
    checkbox.onclick = function() {
      d.selectedForRec = !d.selectedForRec;
      const kcsItem = data.kcs.find(k => k.id == d.id);
      if (kcsItem) kcsItem['selected-for-rec'] = d.selectedForRec;
      checkbox.className = 'concept-checkbox-html' + (d.selectedForRec ? ' checked' : '');
      checkbox.innerHTML = d.selectedForRec ? '✔' : '';
    };
    row.appendChild(checkbox);

    // Label
    const label = document.createElement('span');
    label.className = 'concept-label-html';
    label.title = d.name;
    label.innerText = d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name;
    label.onclick = function() {
      checkbox.onclick();
    };
    row.appendChild(label);

    // Bar container
    const barContainer = document.createElement('div');
    barContainer.className = 'bar-container-html';

    // Original value bar (if edition exists)
    if (d.hasEdition) {
      const origBar = document.createElement('div');
      origBar.className = 'bar-original-html';
      origBar.style.width = (d.uk / maxValue * 100) + '%';
      barContainer.appendChild(origBar);
    }

    // Main bar (final value)
    const mainBar = document.createElement('div');
    mainBar.className = 'bar-main-html';
    mainBar.style.width = (d.finalValue / maxValue * 100) + '%';
    barContainer.appendChild(mainBar);

    // Edition bar (positive)
    if (d.edition > 0) {
      const editionBar = document.createElement('div');
      editionBar.className = 'bar-edition-positive-html';
      editionBar.style.width = (d.edition / maxValue * 100) + '%';
      editionBar.style.left = (d.uk / maxValue * 100) + '%';
      barContainer.appendChild(editionBar);
    }

    // Edition bar (negative)
    if (d.edition < 0) {
      const editionBar = document.createElement('div');
      editionBar.className = 'bar-edition-negative-html';
      editionBar.style.width = (Math.abs(d.edition) / maxValue * 100) + '%';
      editionBar.style.left = (d.finalValue / maxValue * 100) + '%';
      barContainer.appendChild(editionBar);
    }

    // Value label
    const valueLabel = document.createElement('span');
    valueLabel.className = 'concept-value-html';
    valueLabel.innerText = `${Math.round(d.finalValue * 100)}%`;
    barContainer.appendChild(valueLabel);

    row.appendChild(barContainer);
    chart.appendChild(row);
  });

  // Legend
  const legend = document.createElement('div');
  legend.className = 'concepts-legend-html';
  legend.innerHTML = `
    <span class="legend-box bar-main-html"></span> Current
    <span class="legend-box bar-original-html"></span> Original
    <span class="legend-box bar-edition-positive-html"></span> +Edit
    <span class="legend-box bar-edition-negative-html"></span> -Edit
  `;
  chart.appendChild(legend);

  chartContainer.appendChild(chart);
}

// Create D3.js bar chart for concepts
// function createConceptsBarChart() {
//   const chartContainer = document.getElementById('concepts-bar-chart');
//   chartContainer.innerHTML = '';
  
//   if (!data || !data.kcs) {
//     console.error('createConceptsBarChart: data.kcs is not available');
//     return;
//   }
  
//   // Prepare data for the chart
//   const chartData = data.kcs.map((concept, index) => {
//     const uk = concept.uk || 0;
//     const edition = concept.edition || 0;
//     const finalValue = uk + edition;
    
//     return {
//       id: concept.id,
//       name: concept.dn || `Concept ${index + 1}`,
//       uk: uk,
//       edition: edition,
//       finalValue: finalValue,
//       hasEdition: edition !== 0
//     };
//   });
  
//   // Sort by final value (descending)
//   chartData.sort((a, b) => b.finalValue - a.finalValue);
  
//   // Set up dimensions
//   const margin = { top: 20, right: 10, bottom: 40, left: 80 };
//   const width = chartContainer.offsetWidth - margin.left - margin.right;
//   const height = chartContainer.offsetHeight - margin.top - margin.bottom;
  
//   // Create SVG
//   const svg = d3.select('#concepts-bar-chart')
//     .append('svg')
//     .attr('width', width + margin.left + margin.right)
//     .attr('height', height + margin.top + margin.bottom)
//     .append('g')
//     .attr('transform', `translate(${margin.left},${margin.top})`);
  
//   // Create scales
//   const xScale = d3.scale.linear()
//     .domain([0, 1])
//     .range([0, width]);
  
//   const yScale = d3.scale.ordinal()
//     .domain(chartData.map(d => d.name))
//     .rangeBands([0, height], 0.1);
  
//   // Create bars
//   const bars = svg.selectAll('.concept-bar-group')
//     .data(chartData)
//     .enter()
//     .append('g')
//     .attr('class', 'concept-bar-group')
//     .attr('id', d=> `concept-bar-${d.id}`)
//     .attr('transform', d => `translate(0,${yScale(d.name)})`);
  
//   // Add original value bars (if there are editions)
//   bars.filter(d => d.hasEdition)
//     .append('rect')
//     .attr('class', 'concept-bar-original')
//     .attr('x', 0)
//     .attr('y', 0)
//     .attr('width', d => xScale(d.uk))
//     .attr('height', yScale.rangeBand())
//     .attr('rx', 2);
  
//   // Add main bars
//   bars.append('rect')
//     .attr('class', 'concept-bar')
//     .attr('x', 0)
//     .attr('y', 0)
//     .attr('width', d => xScale(d.finalValue))
//     .attr('height', yScale.rangeBand())
//     .attr('rx', 2);
  
//   // Add edition bars (positive)
//   bars.filter(d => d.edition > 0)
//     .append('rect')
//     .attr('class', 'concept-bar-edition-positive')
//     .attr('x', d => xScale(d.uk))
//     .attr('y', 0)
//     .attr('width', d => xScale(d.edition))
//     .attr('height', yScale.rangeBand())
//     .attr('rx', 2);
  
//   // Add edition bars (negative)
//   bars.filter(d => d.edition < 0)
//     .append('rect')
//     .attr('class', 'concept-bar-edition-negative')
//     .attr('x', d => xScale(d.finalValue))
//     .attr('y', 0)
//     .attr('width', d => xScale(Math.abs(d.edition)))
//     .attr('height', yScale.rangeBand())
//     .attr('rx', 2);
  
//   // Add original value lines
//   bars.filter(d => d.hasEdition)
//     .append('line')
//     .attr('class', 'concept-original-line')
//     .attr('x1', d => xScale(d.uk))
//     .attr('x2', d => xScale(d.uk))
//     .attr('y1', 0)
//     .attr('y2', yScale.rangeBand());
  
//   // Add concept labels (truncated for smaller panel)
//   bars.append('text')
//     .attr('class', 'concept-label')
//     .attr('x', -3)
//     .attr('y', yScale.rangeBand() / 2)
//     .attr('dy', '0.35em')
//     .attr('text-anchor', 'end')
//     .style('font-size', '10px')
//     .text(d => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name);
  
//   // Add value labels
//   bars.append('text')
//     .attr('class', 'concept-value')
//     .attr('x', d => xScale(d.finalValue) + 3)
//     .attr('y', yScale.rangeBand() / 2)
//     .attr('dy', '0.35em')
//     .style('font-size', '9px')
//     .text(d => `${Math.round(d.finalValue * 100)}%`);
  
//   // Add X axis
//   const xAxis = d3.svg.axis()
//     .scale(xScale)
//     .orient('bottom')
//     .tickFormat(d3.format('%'));
  
//   svg.append('g')
//     .attr('class', 'x-axis')
//     .attr('transform', `translate(0,${height})`)
//     .call(xAxis);
  
//   // Add legend (simplified for smaller panel)
//   const legend = svg.append('g')
//     .attr('class', 'legend')
//     .attr('transform', `translate(${width - 120}, -10)`);
  
//   // Legend items (shortened labels)
//   const legendItems = [
//     { class: 'concept-bar', label: 'Current' },
//     { class: 'concept-bar-original', label: 'Original' },
//     { class: 'concept-bar-edition-positive', label: '+Edit' },
//     { class: 'concept-bar-edition-negative', label: '-Edit' }
//   ];
  
//   legendItems.forEach((item, i) => {
//     const legendItem = legend.append('g')
//       .attr('transform', `translate(0,${i * 16})`);
    
//     legendItem.append('rect')
//       .attr('class', item.class)
//       .attr('x', 0)
//       .attr('y', 0)
//       .attr('width', 12)
//       .attr('height', 12)
//       .attr('rx', 2);
    
//     legendItem.append('text')
//       .attr('x', 16)
//       .attr('y', 10)
//       .attr('class', 'concept-label')
//       .style('font-size', '9px')
//       .text(item.label);
//   });

//   // Add concept labels (truncated for smaller panel) and checkboxes
// bars.each(function(d, i) {
//   const group = d3.select(this);

//   // Add checkbox rect
//   group.append('rect')
//     .attr('class', 'concept-checkbox')
//     .attr('x', -22)
//     .attr('y', yScale.rangeBand() / 2 - 7)
//     .attr('width', 14)
//     .attr('height', 14)
//     .attr('rx', 3)
//     .style('fill', d.selectedForRec ? '#4caf50' : '#fff')
//     .style('stroke', '#888')
//     .style('cursor', 'pointer');

//   // Add checkmark (hidden if not selected)
//   group.append('text')
//     .attr('class', 'concept-checkbox-check')
//     .attr('x', -15)
//     .attr('y', yScale.rangeBand() / 2 + 3)
//     .attr('text-anchor', 'middle')
//     .style('font-size', '13px')
//     .style('pointer-events', 'none')
//     .text(d.selectedForRec ? '✔' : '');

//   // Add label
//   group.append('text')
//     .attr('class', 'concept-label')
//     .attr('x', -3)
//     .attr('y', yScale.rangeBand() / 2)
//     .attr('dy', '0.35em')
//     .attr('text-anchor', 'end')
//     .style('font-size', '10px')
//     .style('cursor', 'pointer')
//     .text(d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name)
//     .on('click', function(_, i) {
//       toggleCheckbox(d, group);
//     });

//   // Also allow clicking the checkbox rect
//   group.select('.concept-checkbox')
//     .on('click', function(_, i) {
//       toggleCheckbox(d, group);
//     });
// });

// // Helper to toggle checkbox and update data.kcs
// function toggleCheckbox(d, group) {
//   // Find the kcs element by id
//   const kcsItem = data.kcs.find(k => k.id == d.id);
//   if (!kcsItem) return;

//   // Toggle selectedForRec
//   d.selectedForRec = !d.selectedForRec;
//   kcsItem['selected-for-rec'] = d.selectedForRec;

//   // Update checkbox fill and checkmark
//   group.select('.concept-checkbox')
//     .style('fill', d.selectedForRec ? '#4caf50' : '#fff');
//   group.select('.concept-checkbox-check')
//     .text(d.selectedForRec ? '✔' : '');
// }
// } 