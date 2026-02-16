<?php
/**
 * PAYFAST NOTIFICATION HANDLER
 * 
 * This file receives payment notifications from Payfast.
 * Called by Payfast IPN (Instant Payment Notification) after payment.
 * 
 * Important:
 * - Verify the notification signature
 * - Don't rely solely on this for payment confirmation
 * - Implement proper logging
 * - Return 200 OK to Payfast to prevent resends
 */

// ========================================
// CONFIGURATION
// ========================================
define('PAYFAST_MERCHANT_ID', 'REPLACE_WITH_YOUR_MERCHANT_ID');
define('PAYFAST_MERCHANT_KEY', 'REPLACE_WITH_YOUR_MERCHANT_KEY');
define('PAYFAST_PASSPHRASE', ''); // Set in Payfast dashboard if you have one

// Set error logging
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/payfast_notifications.log');

// ========================================
// VERIFY PAYFAST NOTIFICATION
// ========================================

// Get post data
$post_data = $_POST;

// Log the request
error_log('Payfast notification received: ' . print_r($post_data, true));

// Required fields
if (!isset($post_data['m_payment_id']) || !isset($post_data['payment_status']) || !isset($post_data['signature'])) {
    error_log('Error: Missing required fields in Payfast notification');
    http_response_code(400);
    exit;
}

// Verify merchant ID
if ($post_data['merchant_id'] != PAYFAST_MERCHANT_ID) {
    error_log('Error: Invalid merchant ID in notification');
    http_response_code(400);
    exit;
}

// Build signature verification
$sig_string = '';
foreach ($post_data as $key => $value) {
    if ($key === 'signature') continue;
    if (empty($value)) continue;
    $sig_string .= $key . '=' . urlencode($value) . '&';
}
$sig_string = rtrim($sig_string, '&');

if (PAYFAST_PASSPHRASE) {
    $sig_string .= '&passphrase=' . urlencode(PAYFAST_PASSPHRASE);
}

$signature = md5($sig_string);

// Verify signature matches
if ($signature !== $post_data['signature']) {
    error_log('Error: Invalid signature in Payfast notification');
    http_response_code(400);
    exit;
}

// ========================================
// PROCESS PAYMENT STATUS
// ========================================

$order_id = $post_data['m_payment_id'];
$payment_status = $post_data['payment_status'];
$amount = $post_data['amount_gross'] ?? 0;
$transaction_id = $post_data['pf_payment_id'] ?? '';

error_log("Processing order {$order_id} with status {$payment_status}");

// TODO: Update your order database with the payment status
// This is where you would:
// 1. Load the order from database
// 2. Verify the amount matches
// 3. Update order status
// 4. Send confirmation email
// 5. Update inventory
// 6. Log the transaction

if ($payment_status === 'COMPLETE') {
    // Payment successful
    error_log("Order {$order_id} payment completed (Transaction: {$transaction_id})");
    
    // TODO: Implement order confirmation logic
    // Example:
    // $order = Order::find($order_id);
    // $order->status = 'paid';
    // $order->transaction_id = $transaction_id;
    // $order->save();
    // sendConfirmationEmail($order);

} else if ($payment_status === 'PENDING') {
    // Payment pending
    error_log("Order {$order_id} payment pending");
    
} else if ($payment_status === 'FAILED') {
    // Payment failed
    error_log("Order {$order_id} payment FAILED");
    
    // TODO: Implement payment failure handling
    
} else {
    error_log("Unknown payment status: {$payment_status}");
}

// IMPORTANT: Always return 200 OK to Payfast to acknowledge receipt
// If this script throws an error, Payfast will keep retrying
http_response_code(200);
echo "OK";
?>
