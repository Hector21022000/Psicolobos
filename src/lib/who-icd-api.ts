/**
 *  aparece el e
 * Nombre del archivo: src/lib/who-icd-api.ts
 * Descripción: Servicio de integración con la API oficial de la CIE-11 de la OMS.
 * Fecha de última modificación: 2026-10-02
 * Autor: Psicolobos Development Team
 */

// Se necesitan las credenciales obtenidas al registrarse en https://icd.who.int/icdapi
const CLIENT_ID = process.env.WHO_ICD_CLIENT_ID || '';
const CLIENT_SECRET = process.env.WHO_ICD_CLIENT_SECRET || '';

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getIcdToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Las credenciales WHO_ICD_CLIENT_ID y WHO_ICD_CLIENT_SECRET no están configuradas en el entorno.');
  }

  const tokenEndpoint = 'https://icdaccessmanagement.who.int/connect/token';
  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('scope', 'icdapi_access');
  params.append('grant_type', 'client_credentials');

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Error al obtener token de la OMS: ${response.statusText} - ${errText}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  // El token expira (generalmente en 3600 segundos). Dejamos 1 minuto de margen de seguridad.
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; 

  return cachedToken;
}

export async function searchIcd11(query: string) {
  const token = await getIcdToken();
  // El endpoint 'mms' busca sobre la linealización de Mortalidad y Morbilidad
  const searchUrl = `https://id.who.int/icd/release/11/2024-01/mms/search?q=${encodeURIComponent(query)}&useFlexisearch=true`;

  const response = await fetch(searchUrl, {
    method: 'GET', // o POST dependiendo del uso, pero GET es el estándar para esta query
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'API-Version': 'v2',
      'Accept-Language': 'es' // Resultados en español
    }
  });

  if (!response.ok) {
    throw new Error(`Error buscando en la API de la CIE-11: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Transformar la respuesta al mismo formato que usábamos en catalog-data.ts
  return data.destinationEntities.map((item: any) => ({
    code: item.theCode,
    name: item.title?.replace(/<[^>]+>/g, ''), // Limpiar tags HTML (ej. <em>) que devuelve la API
    system: 'CIE_11',
    category: 'API_OMS_LIVE', 
    whoUrl: item.id
  }));
}
