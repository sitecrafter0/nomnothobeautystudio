<?php
/**
 * YOCO PAYMENT PROCESSOR
 * 
 * This file handles Yoco credit card payments.
 * It processes tokenized card data and charges the customer.
 * 
 * Requirements:
 * - Composer: php -r "copy('https://getcomposer.org/installer', 'composer-setup.php'); php composer-setup.php;"
 * - Install Yoco SDK: composer require yocowallet/sdk
 * 
 * Setup Instructions:
 * 1. Install Yoco PHP SDK
 * 2. Add your YOCO_SECRET_KEY below
 * 3. Set proper error logging
 * 4. Enable HTTPS on production
 */

header('Content-Type: application/json');

// ========================================
// CONFIGURATION - REPLACE WITH YOUR KEYS
// ========================================
define('YOCO_SECRET_KEY', 'sk_test_REPLACE_WITH_YOUR_YOCO_SECRET_KEY');
define('YOCO_MODE', 'test'); // Change to 'live' for production

// ========================================
// ERROR HANDLING
// ========================================
function sendError($message, $code = 400) {
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'message' => $message,
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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendError('Invalid JSON input', 400);
}

// ========================================
// VALIDATE INPUT
// ========================================
$required_fields = ['amount', 'currency', 'metadata'];
foreach ($required_fields as $field) {
    if (!isset($input[$field])) {
        sendError("Missing required field: {$field}");
    }
}

if (!isset($input['metadata']['orderId']) || !isset($input['metadata']['customerEmail'])) {
    sendError('Missing order ID or customer email in metadata');
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
    error_log('YOCO Payment: OrderID=' . $input['metadata']['orderId'] . ', Amount=' . $amount . ', Currency=' . $input['currency']);
} catch (Exception $e) {
    sendError('Amount validation failed: ' . $e->getMessage());
}

// ========================================
// YOCO CHARGE PROCESSING
// ========================================

try {
    // Check if Yoco SDK is installed
    if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
        sendError('Yoco SDK not installed. Please run: composer require yocowallet/sdk', 500);
    }

    require_once __DIR__ . '/vendor/autoload.php';

    // Validate credentials
    if (strpos(YOCO_SECRET_KEY, 'REPLACE_WITH') !== false) {
        sendError('Yoco secret key not configured', 500);
    }

    // Initialize Yoco client
    // NOTE: This is a template. Actual implementation depends on Yoco SDK version
    // Uncomment and modify based on your Yoco SDK documentation
    
    /*
    $yoco = new Yoco\Client(YOCO_SECRET_KEY);
    
    $charge = $yoco->createCharge([
        'amount' => (int)$input['amount'],
        'currency' => $input['currency'] ?? 'ZAR',
        'token' => $input['token'], // Token from Yoco.js
        'description' => 'Order #' . $input['metadata']['orderId'],
        'statementDescription' => 'Nomnotho Beauty',
        'metadata' => $input['metadata']
    ]);

    if ($charge->isSuccessful()) {
        sendSuccess([
            'transactionId' => $charge->id(),
            'amount' => $input['amount'],
            'currency' => $input['currency'],
            'status' => 'completed',
            'orderId' => $input['metadata']['orderId']
        ]);
    } else {
        sendError('Yoco charge failed: ' . $charge->failureMessage());
    }
    */
    
    // TEMPORARY: For testing without SDK
    if (YOCO_MODE === 'test') {
        sendSuccess([
            'transactionId' => 'yoco_test_' . time(),
            'amount' => $input['amount'],
            'currency' => $input['currency'],
            'status' => 'completed',
            'orderId' => $input['metadata']['orderId'],
            'message' => 'Test mode - no actual charge made. Install Yoco SDK to process real payments.'
        ]);
    }

} catch (Exception $e) {
    sendError('Error processing Yoco payment: ' . $e->getMessage(), 500);
}
?>
