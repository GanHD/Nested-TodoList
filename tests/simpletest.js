/**
 * Very simple in-browser unit-test library, with zero deps.
 *
 * Background turns green if all tests pass, otherwise red.
 * View the JavaScript console to see failure reasons.
 *
 * Example:
 *
 *   adder.js (code under test)
 *
 *     function add(a, b) {
 *       return a + b;
 *     }
 *
 *   adder-test.html (tests - just open a browser to see results)
 *
 *     <script src="tinytest.js"></script>
 *     <script src="adder.js"></script>
 *     <script>
 *
 *     tests({
 *
 *       'adds numbers': function() {
 *         eq(6, add(2, 4));
 *         eq(6.6, add(2.6, 4));
 *       },
 *
 *       'subtracts numbers': function() {
 *         eq(-2, add(2, -4));
 *       },
 *
 *     });
 *     </script>
 *
 * That's it. Stop using over complicated frameworks that get in your way.
 *
 * -Joe Walnes
 * MIT License. See https://github.com/joewalnes/jstinytest/
 */
var utils = {
  renderStats : function(counter, failures){
    var resultText = document.createElement("h1");
    resultText.innerHTML = "Ran "+ counter+ " tests: "
      + (counter-failures)+ " successes, "+ failures +" failures."
    document.body.appendChild(resultText);
  }
}
var TinyTest = {

  run: function(tests) {
    var failures = 0;
    var counter =0;
    for (var testName in tests) {
      var testAction = tests[testName];
      try {
        counter++;
        testAction.apply(this);

        console.log('%cTest ' + counter + ': '
          +  testName, "color:green;font-weight: bold;")
      } catch (e) {
        failures++;
        console.groupCollapsed('%cTest '+counter+': '
          + testName,"color:red;font-weight: bold;");
          console.error(e.stack);
        console.groupEnd();
      }
    }
    setTimeout(function() { // Give document a chance to complete
      if (window.document && document.body) {
        document.body.style.backgroundColor = (failures == 0 ? '#99ff99' : '#ff9999');
        utils.renderStats(counter, failures);
      }
    }, 0);
  },

  fail: function(msg) {
    throw new Error('fail(): ' + msg);
  },

  assert: function(value, msg) {
    if (!value) {
      throw new Error('assert(): ' + msg);
    }
  },

  assertEquals: function(expected, actual) {
    if (expected != actual) {
      throw new Error('assertEquals() "' + expected + '" != "' + actual + '"');
    }
  },

  assertStrictEquals: function(expected, actual) {
    if (expected !== actual) {
      throw new Error('assertStrictEquals() "' + expected + '" !== "' + actual + '"');
    }
  },

};

var fail = TinyTest.fail.bind(TinyTest),
  assert = TinyTest.assert.bind(TinyTest),
  assertEquals = TinyTest.assertEquals.bind(TinyTest),
  eq = TinyTest.assertEquals.bind(TinyTest), // alias for assertEquals
  assertStrictEquals = TinyTest.assertStrictEquals.bind(TinyTest),
  tests = TinyTest.run.bind(TinyTest);
