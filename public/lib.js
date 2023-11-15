export async function fetchTemplate(path) {
  const response = await fetch(path);
  const responseText = await response.text();
  return responseText;
}

export async function fetchJson(path) {
  const response = await fetch(path);
  const responseJson = await response.json();
  return responseJson;
}

export function sort(data) {
  // sort fields for better display on page
  const customSortOrder = ['firstname', 'lastname', 'age'];

  data.sort((a, b) => {
    const indexA = customSortOrder.indexOf(a.name);
    const indexB = customSortOrder.indexOf(b.name);
    return indexA - indexB;
  });

  return data;
}
