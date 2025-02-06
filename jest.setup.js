import { TextEncoder, TextDecoder } from 'util';

// Mock clone function for graceful-fs
global.clone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
};

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
