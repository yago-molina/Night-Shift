import test from 'node:test';
import assert from 'node:assert/strict';
import {safeModeRequested} from '../src/core/RuntimeRecovery.js';
test('modo seguro é opcional e detectado pela URL',()=>{
 assert.equal(safeModeRequested({search:'?safe=1'}),true);
 assert.equal(safeModeRequested({search:'?safe=0'}),false);
 assert.equal(safeModeRequested({search:''}),false);
});
