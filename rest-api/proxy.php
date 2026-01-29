<?php
// proxy.php - Bypasses CORS by fetching data server-side
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow local development requests

$targetUrl = "https://stg-huntswood-staging.kinsta.cloud/wp-json/wp/v2/white-papers/?_embed";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
// Some servers require a User-Agent
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo json_encode(['error' => 'Proxy Error: ' . curl_error($ch)]);
} else if ($httpCode !== 200) {
    echo json_encode(['error' => 'API returned status ' . $httpCode]);
} else {
    echo $response;
}

curl_close($ch);
?>
