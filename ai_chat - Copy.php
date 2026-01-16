<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$message = trim($data['message'] ?? '');

if (empty($message)) {
    echo json_encode(['error' => 'Message cannot be empty']);
    exit;
}

$apiKey = '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'; // Replace with actual API key

$payload = [
    "model" => "llama-3.1-8b-instant",
    "messages" => [
        ["role" => "system", "content" => "You are a helpful AI assistant."],
        ["role" => "user", "content" => $message]
    ]
];

$ch = curl_init(""); # Insert the correct API endpoint URL here
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $apiKey"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo json_encode(["error" => curl_error($ch)]);
    curl_close($ch);
    exit;
}
curl_close($ch);

$resData = json_decode($response, true);

if (isset($resData['choices'][0]['message']['content'])) {
    // return AI response
    echo json_encode(['answer' => trim($resData['choices'][0]['message']['content'])]);
} else {
    echo json_encode(['error' => 'AI did not return a response.', 'debug' => $resData]);
}
