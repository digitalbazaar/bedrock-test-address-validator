/*
 * Bedrock Address Validator Module Configuration
 *
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 */
var config = require('bedrock').config;
var path = require('path');

// FIXME: What context should it use?
config.addressValidator = {};
config.addressValidator.test = {};
config.addressValidator.test.address = {
  '@context': '',
  name: 'Full Name',
  streetAddress: '100 Street Apt 1',
  addressLocality: 'City',
  addressRegion: 'State',
  postalCode: '10000',
  addressCountry: 'US'
};

// tests
config.mocha.tests.push(path.join(__dirname, 'test.js'));