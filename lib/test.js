/*
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 */

'use strict';

var bedrock = require('bedrock');
var av = require('./addressValidator');
var BedrockError = bedrock.util.BedrockError;

/*
Digital Bazaar, Inc.
1700 Kraft Dr Suite #2408
Blacksburg, VA 24060
*/

describe('bedrock', function() {
  describe('validateAddress()', function() {
    it('should validate address', function(done) {
      var address = {
        name: "Digital Bazaar",
        streetAddress: "1700 Kraft Dr Suite 2408",
        addressLocality: "Blacksburg",
        addressRegion: "Virginia",
        postalCode: "24060", 
        addressCountry: "United States"
      };
      av.validateAddress(address, function(err, validatedAddress) {
        if(err) {
            console.trace();

  //        console.log("\n" + err + "\n");
        } else {
          validatedAddress.sysValidated.should.eql(true);
        }
        done();
      });
    });
  });
});