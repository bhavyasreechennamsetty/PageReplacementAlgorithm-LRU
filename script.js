document.getElementById('lru-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    // Clear previous output
    const visualDiv = document.getElementById('page-replacement-visual');
    const tableDiv = document.getElementById('page-replacement-table');
    const faultsDiv = document.getElementById('page-faults');
    visualDiv.innerHTML = '';
    tableDiv.innerHTML = '';
    faultsDiv.textContent = '';
  
    // Input values
    const numPages = parseInt(document.getElementById('num-pages').value);
    const referenceString = document.getElementById('reference-string').value.split(',').map(Number);
    const numFrames = parseInt(document.getElementById('num-frames').value);
  
    // Validate input
    if (referenceString.length !== numPages) {
      alert('The length of the reference string must match the number of pages.');
      return;
    }
  
    // Initialize simulation variables
    const frames = [];
    let pageFaults = 0;
  
    // Table Header
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Step</th><th>Reference</th><th>Frames</th><th>Page Fault</th>';
    table.appendChild(headerRow);
  
    // Simulate LRU Page Replacement
    referenceString.forEach((page, step) => {
      let pageFault = false;
  
      // Check if page is already in frames
      if (!frames.includes(page)) {
        pageFault = true;
        pageFaults++;
  
        // Replace using LRU if frames are full
        if (frames.length === numFrames) {
          const leastRecentlyUsed = referenceString.slice(0, step).reverse().findIndex(p => frames.includes(p));
          const lruIndex = frames.indexOf(referenceString[step - leastRecentlyUsed - 1]);
          frames[lruIndex] = page;
        } else {
          // Add page to frames if space is available
          frames.push(page);
        }
      }
  
      // Update the visualization
      const frameDiv = document.createElement('div');
      frameDiv.className = `page-frame ${pageFault ? 'fault' : 'loaded'}`;
      frameDiv.innerHTML = `
        <span>Page ${page}</span>
        <span>${pageFault ? 'Page Fault' : 'Loaded'}</span>
      `;
      visualDiv.appendChild(frameDiv);
  
      // Update the table
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${step + 1}</td>
        <td>${page}</td>
        <td>${frames.join(', ')}</td>
        <td>${pageFault ? 'Yes' : 'No'}</td>
      `;
      table.appendChild(row);
    });

    tableDiv.appendChild(table);
    faultsDiv.textContent = `Total Page Faults: ${pageFaults}`;
  });
  