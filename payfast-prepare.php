<?php
/**
 * PAYFAST PAYMENT PROCESSOR
 * 
 * This file prepares a Payfast hosted payment request.
 * User will be redirected to Payfast to enter payment details.
 * 
 * Requirements:
 * - Payfast merchant account
 * - Merchant ID and Key
 * - HTTPS connection (required by Payfast)
 * 
 * Setup Instructions:
 * 1. Create Payfast merchant account at https://www.payfast.co.za
 * 2. Get Merchant ID and Key from dashboard
 * 3. Replace credentials below
 * 4. Ensure website uses HTTPS
 * 5. Add return/notify URLs to Payfast settings
 */

header('Content-Type: application/json');

// ========================================
// CONFIGURATION - REPLACE WITH YOUR KEYS
// ========================================
define('PAYFAST_MERCHANT_ID', 'REPLACE_WITH_YOUR_MERCHANT_ID'); // Your numeric Merchant ID
define('PAYFAST_MERCHANT_KEY', 'REPLACE_WITH_YOUR_MERCHANT_KEY'); // Your Merchant Key
define('PAYFAST_PASSPHRASE', ''); // Optional: set in Payfast settings
define('PAYFAST_MODE', 'test'); // 'test' or 'live'

// URLs
define('PAYFAST_TEST_URL', 'https://sandbox.payfast.co.za/eng/process');
define('PAYFAST_LIVE_URL', 'https://www.payfast.co.za/eng/process');

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
$required_fields = ['merchantId', 'amount', 'orderId', 'firstName', 'lastName', 'email'];
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
    error_log('PAYFAST Payment: OrderID=' . $input['orderId'] . ', Amount=' . $amount . ', Email=' . $input['email']);
} catch (Exception $e) {
    sendError('Amount validation failed: ' . $e->getMessage());
}

// ========================================
// VALIDATE CREDENTIALS
// ========================================
if (strpos(PAYFAST_MERCHANT_ID, 'REPLACE_WITH') !== false) {
    sendError('Payfast Merchant ID not configured', 500);
}

if (strpos(PAYFAST_MERCHANT_KEY, 'REPLACE_WITH') !== false) {
    sendError('Payfast Merchant Key not configured', 500);
}

// ========================================
// PREPARE PAYFAST REQUEST
// ========================================

try {
    // Build payment data
    $payfast_data = [
        'merchant_id' => PAYFAST_MERCHANT_ID,
        'merchant_key' => PAYFAST_MERCHANT_KEY,
        'return_url' => rtrim($input['returnUrl'], '/') . '?status=success',
        'cancel_url' => rtrim($input['returnUrl'], '/') . '?status=cancelled',
        'notify_url' => $input['notifyUrl'] ?? '',
        'name_first' => substr($input['firstName'], 0, 32),
        'name_last' => substr($input['lastName'], 0, 32),
        'email_address' => $input['email'],
        'cell_number' => $input['phone'] ?? '',
        'm_payment_id' => $input['orderId'],
        'amount' => number_format((float)$input['amount'], 2, '.', ''),
        'item_name' => 'Order #' . $input['orderId'],
        'item_description' => $input['itemDescription'] ?? '',
    ];

    // Add passphrase if set
    if (PAYFAST_PASSPHRASE) {
        $payfast_data['passphrase'] = PAYFAST_PASSPHRASE;
    }

    // Sort data alphabetically
    ksort($payfast_data);

    // Generate signature
    $signature_string = '';
    foreach ($payfast_data as $key => $value) {
        if (!empty($value)) {
            $signature_string .= $key . '=' . urlencode($value) . '&';
        }
    }
    $signature_string = rtrim($signature_string, '&');
    
    if (PAYFAST_PASSPHRASE) {
        $signature_string .= '&passphrase=' . urlencode(PAYFAST_PASSPHRASE);
    }

    $signature = md5($signature_string);
    $payfast_data['signature'] = $signature;

    // Get correct URL based on mode
    $payfast_url = (PAYFAST_MODE === 'live') ? PAYFAST_LIVE_URL : PAYFAST_TEST_URL;

    // Build form POST URL
    $checkout_url = $payfast_url . '?' . http_build_query($payfast_data);

    sendSuccess([
        'checkoutUrl' => $checkout_url,
        'orderId' => $input['orderId'],
        'amount' => $input['amount'],
        'mode' => PAYFAST_MODE,
        'message' => 'Payfast payment request prepared. Customer will be redirected to Payfast.'
    ]);

} catch (Exception $e) {
    sendError('Error preparing Payfast payment: ' . $e->getMessage(), 500);
}
?>
