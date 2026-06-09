export default async function handler(req, res) {
  const { dni } = req.query || {};
  const token = process.env.APISPERU_TOKEN || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImthcmxhZGFuaWVsYXJhbW9zYmVsdHJhbkBnbWFpbC5jb20ifQ.AwtUIIQhccj10ww50W2kluuETegUcxrqBjsn9TYNC3I";

  if (!dni || typeof dni !== "string") {
    return res.status(400).json({ error: "Falta el parámetro dni" });
  }

  const apiUrl = `https://dniruc.apisperu.com/api/v1/dni/${encodeURIComponent(dni)}?token=${encodeURIComponent(token)}`;

  try {
    const response = await fetch(apiUrl);
    const body = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({ error: body });
    }

    const data = JSON.parse(body);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error en /api/dni:", error);
    return res.status(502).json({ error: "No se pudo consultar la API de DNI" });
  }
}
