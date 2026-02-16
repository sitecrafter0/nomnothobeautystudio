<?php
/**
 * OZOW PAYMENT PROCESSOR
 * 
 * This file prepares an Ozow EFT payment request.
 * User will be redirected to Ozow to enter payment details or bank details.
 * 
 * Requirements:
 * - Ozow merchant account
 * - API Key, Merchant ID, and Account ID
 * - HTTPS connection (required by Ozow)
 * 
 * Setup Instructions:
 * 1. Create Ozow account at https://www.ozow.com
 * 2. Get API credentials from developer console
 * 3. Replace credentials below
 * 4. Ensure website uses HTTPS
 * 5. Set return/callback URLs in Ozow settings
 */

header('Content-Type: application/json');

// ========================================
// CONFIGURATION - REPLACE WITH YOUR KEYS
// ========================================
define('OZOW_API_KEY', 'REPLACE_WITH_YOUR_OZOW_API_KEY');
define('OZOW_MERCHANT_ID', 'REPLACE_WITH_YOUR_OZOW_MERCHANT_ID'); // Site Code
define('OZOW_ACCOUNT_ID', 'REPLACE_WITH_YOUR_OZOW_ACCOUNT_ID');
define('OZOW_MODE', 'test'); // 'test' or 'live'

// URLs
define('OZOW_TEST_URL', 'https://sandbox.ozow.com/pay/request');
define('OZOW_LIVE_URL', 'https://www.ozow.com/pay/request');

// ========================================
// ERROR HANDLING
// ========================================
function sendError($message, $code = 400) {
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'error' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

function sendSuccess($data) {
    http_response_code(200);
    echo json_encode(array_merge([
        'success' => true,
        'timestamp' => date('Y-m-d H:i:s')
    ], $data));
    exit;
}

// ========================================
// VERIFY REQUEST
// ========================================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('POST method required', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendError('Invalid JSON input', 400);
}

// ========================================
// VALIDATE INPUT
// ========================================
$required_fields = ['amount', 'orderId', 'email'];
foreach ($required_fields as $field) {
    if (!isset($input[$field])) {
        sendError("Missing required field: {$field}");
    }
}

// ========================================
// VALIDATE AMOUNT - CRITICAL SECURITY CHECK
// ========================================
try {
    $amount = floatval($input['amount']);
    if ($amount <= 0) {
        sendError('Invalid amount: Amount must be greater than zero. Received: ' . $input['amount']);
    }
    if ($amount > 1000000) {
        sendError('Invalid amount: Amount exceeds maximum allowed');
    }
    // Log for audit trail
    error_log('OZOW Payment: OrderID=' . $input['orderId'] . ', Amount=' . $amount . ', Email=' . $input['email']);
} catch (Exception $e) {
    sendError('Amount validation failed: ' . $e->getMessage());
}

// ========================================
// VALIDATE CREDENTIALS
// ========================================
if (strpos(OZOW_API_KEY, 'REPLACE_WITH') !== false) {
    sendError('Ozow API Key not configured', 500);
}

if (strpos(OZOW_MERCHANT_ID, 'REPLACE_WITH') !== false) {
    sendError('Ozow Merchant ID not configured', 500);
}

if (strpos(OZOW_ACCOUNT_ID, 'REPLACE_WITH') !== false) {
    sendError('Ozow Account ID not configured', 500);
}

// ========================================
// PREPARE OZOW REQUEST
// ========================================

try {
    // Get correct URL based on mode
    $ozow_url = (OZOW_MODE === 'live') ? OZOW_LIVE_URL : OZOW_TEST_URL;

    // Parse amount (Ozow expects cents)
    $amount_cents = (int)((float)$input['amount'] * 100);

    // Build request data
    $request_data = [
        'SiteCode' => OZOW_MERCHANT_ID,
        'CountryCode' => 'ZA',
        'CurrencyCode' => 'ZAR',
        'Amount' => $amount_cents,
        'Reference' => $input['orderId'],
        'BankReference' => substr(md5($input['orderId']), 0, 20),
        'Customer' => [
            'FirstName' => $input['firstName'] ?? 'Customer',
            'LastName' => $input['lastName'] ?? '',
            'EmailAddress' => $input['email'],
            'Phone' => $input['phone'] ?? '',
            'CountryCode' => 'ZA'
        ],
        'SuccessUrl' => $input['successUrl'] ?? '',
        'FailUrl' => $input['failUrl'] ?? '',
        'IsTest' => ($input['isTest'] === true || OZOW_MODE === 'test')
    ];

    // Create request signature (if required by Ozow API version)
    // This depends on your Ozow API version - check documentation
    
    // Make API request to Ozow
    $ch = curl_init($ozow_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($request_data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . OZOW_API_KEY
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);

    if ($curl_error) {
        sendError('Curl error: ' . $curl_error, 500);
    }

    $response_data = json_decode($response, true);

    if ($http_code === 200 && isset($response_data['RedirectUrl'])) {
        sendSuccess([
            'redirectUrl' => $response_data['RedirectUrl'],
            'orderId' => $input['orderId'],
            'amount' => $input['amount'],
            'mode' => OZOW_MODE,
            'message' => 'Ozow payment request created. Customer will be redirected.'
        ]);
    } else {
        sendError('Ozow API error: ' . ($response_data['Message'] ?? 'Unknown error'), 500);
    }

} catch (Exception $e) {
    sendError('Error preparing Ozow payment: ' . $e->getMessage(), 500);
}
?>
