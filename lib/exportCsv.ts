import toast from 'react-hot-toast';

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    toast.error('No data available to export');
    return;
  }

  // Extract primitive fields
  const fields = Object.keys(data[0]).filter(key => typeof data[0][key] !== 'object' && typeof data[0][key] !== 'function');
  
  const csvContent = [
    fields.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(','),
    ...data.map(row => 
      fields.map(field => {
        let val = row[field];
        if (val === null || val === undefined) val = '';
        val = String(val).replace(/"/g, '""'); // escape quotes
        // Handle commas or newlines by enclosing in quotes
        if (val.includes(',') || val.includes('\n')) {
          return `"${val}"`;
        }
        return `"${val}"`; // Default quote everything to avoid CSV injection problems
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Use createObjectURL to trigger download programmatically
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success(`${filename} exported successfully!`);
}
