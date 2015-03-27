/*
 * Bedrock Session via MongoDB Module.
 *
 * This module takes an address and returns whether or not that address is valid.
 *
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');
var crypto = require('crypto');

// required for hashJsonLd
var async = require('async');
var jsonld = require('jsonld');

// load config defaults
require('./config');

// module API
var api = {};
module.exports = api;

// FIXME: Should input address have a context or should this module set the context?

/**
 * Validates an Address.
 *
 * @param address the Address to validate.
 * @param callback(err, address) called once the operation completes.
 */
api.validateAddress = function(address, callback) {
  // set out address to pre-defined test values
  var out = bedrock.tools.clone(bedrock.config.addressValidator.test.address);
  out.type = 'Address';
  out.label = bedrock.tools.clone(address.label) || 'Unnamed';
  out.name = bedrock.tools.clone(address.name) || 'Full Name';

  // produce validation hash
  _hashAddress(out, function(err, hash) {
    if(err) {
      return callback(err);
    }
    out.sysAddressHash = hash;
    out.sysValidated = true;
    callback(null, out);
  });
};

/**
 * Determines if the given Address has been previously validated.
 *
 * @param address the Address to check.
 * @param callback(err, validated) called once the operation completes.
 */
api.isAddressValidated = function(address, callback) {
  if(address.sysValidated === true) {
    _hashAddress(address, function(err, hash) {
      if(err) {
        return callback(err);
      }
      callback(null, address.sysAddressHash === hash);
    });
  } else {
    callback(null, false);
  }
};

/**
 * Produces a validation hash for an address.
 *
 * @param address the address to hash.
 * @param callback(err, hash) called once the operation completes.
 */
function _hashAddress(address, callback) {
  var md = crypto.createHash('sha1');
  md.update(bedrock.config.addressValidator.test.key, 'utf8');
  hashJsonLd(address, function(err, hash) {
    if(err) {
      return callback(err);
    }
    md.update(hash, 'utf8');
    callback(null, md.digest('hex'));
  });
}

// FIXME: put this in external library

/**
 * Gets a hash on the given JSON-LD object. In order to hash a JSON-LD
 * object, it is first reframed (if a frame is provided) and then
 * normalized.
 *
 * @param obj the JSON-LD object to hash.
 * @param [frame] the frame to use to reframe the object (optional).
 * @param callback(err, hash) called once the operation completes.
 */
function hashJsonLd(obj, frame, callback) {
  // handle args

  if(typeof frame === 'function') {
    callback = frame;
    frame = null;
  }

  async.waterfall([
    /*
    function(callback) {
      // if context is not present, it is safe to assume it uses
      // the default bedrock context
      if(!('@context' in obj)) {
        obj = bedrock.tools.clone(obj);
        obj['@context'] = bedrock.config.constants.IDENTITY_CONTEXT_V1_URL;
        return callback(null, obj);
      }
      callback(null, obj);
    },
    function(callback) {
      // do reframing if frame supplied
      if(frame) {
        return jsonld.frame(obj, frame, callback);
      }
      callback(null, obj);
    },
    */
    function(callback) {
      // normalize
      jsonld.normalize(obj, {format: 'application/nquads'}, callback);
    },
    function(normalized, callback) {
      // hash
      var md = crypto.createHash('sha256');
      md.end(normalized, 'utf8');
      callback(null, 'urn:sha256:' + md.read().toString('hex'));
    }
  ], callback);
}
