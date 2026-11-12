import test from 'node:test';import assert from 'node:assert/strict';import {validateTools,routeReflex}from '../src/index.mjs';const tools=[{name:'first',description:'first'},{name:'second',description:'second'}];
test('duplicate tool name cannot overwrite criteria',()=>assert.throws(()=>validateTools([tools[0],tools[0]])));
test('none stays a reserved fallback category',()=>assert.throws(()=>validateTools([tools[0],{name:'none',description:'override fallback'}])));
test('prototype-shaped names rejected',()=>assert.throws(()=>validateTools([tools[0],{name:'constructor',description:'fixture'}])));
test('invalid confidence fails before provider',async()=>{let called=false;await assert.rejects(routeReflex('fixture',{tools,minConfidence:NaN,jev:{decide(){called=true;}}}));assert.equal(called,false);});
