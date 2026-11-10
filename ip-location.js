exports.handler = async (event) => {
  // Use Netlify's trusted client-IP header; never accept an IP supplied by the browser.
  const ip = event.headers && event.headers["x-nf-client-connection-ip"];
  if (!ip) {
    return { statusCode: 400, headers: { "content-type": "application/json" },
      body: JSON.stringify({ success: false, error: "Client IP unavailable from hosting platform." }) };
  }

  try {
    const response = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      headers: { "accept": "application/json" }
    });
    if (!response.ok) throw new Error(`IP lookup returned ${response.status}`);
    const data = await response.json();
    const latitude = Number(data.latitude);
    const longitude = Number(data.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error("Approximate IP coordinates unavailable.");
    }
    return {
      statusCode: 200,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
      body: JSON.stringify({
        success: true,
        latitude,
        longitude,
        accuracy_km: 25,
        city: data.city || "",
        country: data.country_name || ""
      })
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
      body: JSON.stringify({ success: false, error: "Approximate IP location service unavailable." })
    };
  }
};
