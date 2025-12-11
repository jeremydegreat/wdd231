// scripts/data.js
export async function fetchOpportunities(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch opportunities:', err);
    return [];
  }
}
