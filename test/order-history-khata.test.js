var test = require('node:test');
var assert = require('node:assert/strict');

var orders = require('../lib/orders');
var ledger = require('../lib/ledger');

test('Order History sorts DD/MM/YYYY dates newest first across months and years', function () {
  var db = {
    orders: [
      { id: 1004, date: '30/01/2022' },
      { id: 1001, date: '28/12/2021' },
      { id: 1008, date: '15/03/2022' }
    ]
  };

  assert.deepEqual(orders.list(db, {}).map(function (order) { return order.id; }), [1008, 1004, 1001]);
});

test('Order History date range includes dates within the selected calendar interval', function () {
  var db = {
    orders: [
      { id: 1004, date: '30/01/2022' },
      { id: 1001, date: '28/12/2021' },
      { id: 1008, date: '15/03/2022' }
    ]
  };

  var result = orders.list(db, { from: '2022-01-01', to: '2022-02-01' });

  assert.deepEqual(result.map(function (order) { return order.id; }), [1004]);
});

test('Khata settlement adds a numeric string as money instead of concatenating it', function () {
  var db = {
    nextSettlementId: 501,
    customers: [{
      id: 2,
      name: 'Meera Joshi',
      openingBalance: 0,
      totalBilled: 2432.01,
      totalSettled: 1200,
      creditLimit: 5000
    }],
    settlements: []
  };

  var result = ledger.recordSettlement(db, 2, '500', 'upi', 'Payment received');

  assert.equal(result.ok, true);
  assert.equal(result.customer.totalSettled, 1700);
  assert.equal(result.customer.balance, 732.01);
  assert.equal(result.settlement.amount, 500);
});


