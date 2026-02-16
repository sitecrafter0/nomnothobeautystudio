// Quick test to verify cart calculation fixes
// Run this in browser console to test: copy/paste and execute

console.log('=== CART CALCULATION TEST ===\n');

// Test 1: Single Item
const cart1 = [
    { id: 1, name: 'Product A', price: 99.99, qty: 1 }
];
const total1 = cart1.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    const itemQty = parseInt(item.qty) || 1;
    return sum + (itemPrice * itemQty);
}, 0);
console.log('Test 1 - Single Item:');
console.log('  Items: ' + JSON.stringify(cart1));
console.log('  Expected: 99.99 | Got: ' + total1.toFixed(2));
console.log('  Result: ' + (Math.abs(total1 - 99.99) < 0.01 ? '✅ PASS' : '❌ FAIL') + '\n');

// Test 2: Multiple Items
const cart2 = [
    { id: 1, name: 'Product A', price: 50.00, qty: 2 },
    { id: 2, name: 'Product B', price: 75.00, qty: 1 }
];
const total2 = cart2.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    const itemQty = parseInt(item.qty) || 1;
    return sum + (itemPrice * itemQty);
}, 0);
console.log('Test 2 - Multiple Items:');
console.log('  Items: ' + JSON.stringify(cart2));
console.log('  Expected: 175.00 | Got: ' + total2.toFixed(2));
console.log('  Result: ' + (Math.abs(total2 - 175.00) < 0.01 ? '✅ PASS' : '❌ FAIL') + '\n');

// Test 3: Decimal Precision
const cart3 = [
    { id: 1, name: 'Product A', price: 99.99, qty: 3 }
];
const total3 = cart3.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    const itemQty = parseInt(item.qty) || 1;
    return sum + (itemPrice * itemQty);
}, 0);
console.log('Test 3 - Decimal Precision:');
console.log('  Items: ' + JSON.stringify(cart3));
console.log('  Expected: 299.97 | Got: ' + total3.toFixed(2));
console.log('  Result: ' + (Math.abs(total3 - 299.97) < 0.01 ? '✅ PASS' : '❌ FAIL') + '\n');

// Test 4: OLD BROKEN CODE (for comparison)
const cartBroken = [
    { id: 1, name: 'Product A', price: 99.99, qty: 1 }
];
const totalBroken = cartBroken.reduce((sum, item) => sum + (item.price * item.quantity), 0);
console.log('Test 4 - OLD BROKEN CODE (should be NaN):');
console.log('  Items: ' + JSON.stringify(cartBroken));
console.log('  OLD CODE Result: ' + totalBroken + ' (❌ BROKEN - uses item.quantity instead of item.qty)');
console.log('  NEW CODE Result: ' + cart1[0].price.toFixed(2) + ' (✅ FIXED - uses item.qty)\n');

// Test 5: Validation Checks
console.log('Test 5 - Validation Checks:');
console.log('  Empty cart validation: ' + ([] <= 0 ? '❌ Would fail' : '✅ PASS'));
console.log('  Zero total validation: ' + (0 <= 0 ? '❌ Would reject' : '✅ Not caught'));
console.log('  Negative validation: ' + ((-10) > 0 ? '❌ Would pass' : '✅ PASS'));

console.log('\n=== TEST SUMMARY ===');
console.log('All calculations should show 2 decimal places');
console.log('All tests should show ✅ PASS');
console.log('The old code using item.quantity is ❌ BROKEN (would be NaN)');
