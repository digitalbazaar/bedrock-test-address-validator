/*
 * Bedrock Address Validator Module Configuration
 *
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 */
var config = require('bedrock').config;
var path = require('path');

config.addressValidator = {};
config.addressValidator.test = {};
config.addressValidator.test.key = 'testhashkey';
// FIXME: What context should it use?
config.addressValidator.test.address = {
  '@context': 'https://w3id.org/identity/v1',
  name: 'Full Name',
  streetAddress: '100 Street Apt 1',
  addressLocality: 'City',
  addressRegion: 'State',
  postalCode: '10000',
  addressCountry: 'US'
};

// tests
config.mocha.tests.push(path.join(__dirname, 'test.js'));