const { JSDOM } = require('jsdom');
const assert = require('assert');

// Create a new JSDOM instance
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
});

// Set up the global environment
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Import our test file
require('../__tests__/integration/formMode.integration.test.js');
