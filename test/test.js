'use strict';
const Cow = require('../src').Cow;
const Herd = require('../src').Herd;
const should = require('chai').should();

describe('Cow', function(){
  describe('.setToken', () => {
    it('can be set with a string', () => {
      const tok = 'lakjshdkjsaldN';
      Cow.setToken(tok);
      Cow._token.should.equal(tok);
    });
  });
});
