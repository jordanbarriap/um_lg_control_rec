// ...existing code...
    // Set the concept name
    const conceptName = document.createElement('span');
    conceptName.className = 'concept-name';
    conceptName.style.display = 'block'; // Ensure the name is on its own line
    conceptName.innerText = concept;
    conceptBarRow.appendChild(conceptName);

    // Create the concept name cell
    const conceptNameCell = document.createElement('td');
    const conceptNameDiv = document.createElement('div');
    conceptNameDiv.style.whiteSpace = 'pre-line'; // Allow line breaks
    conceptNameDiv.style.wordBreak = 'break-word'; // Break long words
    conceptNameDiv.innerText = conceptName;
    conceptNameCell.appendChild(conceptNameDiv);
    row.appendChild(conceptNameCell);
// ...existing code...