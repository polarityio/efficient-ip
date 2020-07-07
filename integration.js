const request = require('request');
const async = require('async');
const fs = require('fs');
const _ = require('lodash');
const config = require('./config/config');

let Logger;
let requestWithDefaults;
let previousIpRegexAsString = '';
let ipBlocklistRegex = null;
const IGNORED_IPS = new Set(['127.0.0.1', '255.255.255.255', '0.0.0.0']);

const MAX_PARALLEL_LOOKUPS = 10;

/**
 *
 * @param entities
 * @param options
 * @param cb
 */
function startup(logger) {
  let defaults = {};
  Logger = logger;

  const { cert, key, passphrase, ca, proxy, rejectUnauthorized } = config.request;

  if (typeof cert === 'string' && cert.length > 0) {
    defaults.cert = fs.readFileSync(cert);
  }

  if (typeof key === 'string' && key.length > 0) {
    defaults.key = fs.readFileSync(key);
  }

  if (typeof passphrase === 'string' && passphrase.length > 0) {
    defaults.passphrase = passphrase;
  }

  if (typeof ca === 'string' && ca.length > 0) {
    defaults.ca = fs.readFileSync(ca);
  }

  if (typeof proxy === 'string' && proxy.length > 0) {
    defaults.proxy = proxy;
  }

  if (typeof rejectUnauthorized === 'boolean') {
    defaults.rejectUnauthorized = rejectUnauthorized;
  }

  requestWithDefaults = request.defaults(defaults);
}

function _setupRegexBlocklists(options) {
  if (options.ipBlocklistRegex !== previousIpRegexAsString && options.ipBlocklistRegex.length === 0) {
    Logger.debug('Removing IP blocklist Regex Filtering');
    previousIpRegexAsString = '';
    ipBlocklistRegex = null;
  } else {
    if (options.ipBlocklistRegex !== previousIpRegexAsString) {
      previousIpRegexAsString = options.ipBlocklistRegex;
      Logger.debug({ ipBlocklistRegex: previousIpRegexAsString }, 'Modifying IP blocklist Regex');
      ipBlocklistRegex = new RegExp(options.ipBlocklistRegex, 'i');
    }
  }
}

function _isEntityblocklisted(entity, { blocklist }) {
  Logger.trace({ blocklist }, 'blocklist Values');

  const entityIsblocklisted = _.includes(blocklist, entity.value.toLowerCase());

  const ipIsblocklisted = entity.isIP && ipBlocklistRegex !== null && ipBlocklistRegex.test(entity.value);
  if (ipIsblocklisted) Logger.debug({ ip: entity.value }, 'Blocked BlockListed IP Lookup');

  return entityIsblocklisted || ipIsblocklisted;
}

function _isInvalidEntity(entity) {
  return entity.isIPv4 && IGNORED_IPS.has(entity.value);
}

function doLookup(entities, options, cb) {
  let lookupResults = [];
  let tasks = [];

  Logger.debug(entities);

  _setupRegexBlocklists(options);

  entities.forEach((entity) => {
    if (!_isInvalidEntity(entity) && !_isEntityblocklisted(entity, options)) {
      let requestOptions = {
        method: 'GET',
        uri: `${options.url}/rest/ip_address_list`,
        qs: {
          WHERE: `hostaddr like '${entity.value}'`
        },
        json: true
      };

      if (
        typeof options.username === 'string' &&
        options.username.length > 0 &&
        typeof options.password === 'string' &&
        options.password.length > 0
      ) {
        requestOptions.auth = {
          user: options.username,
          pass: options.password
        };
      }

      Logger.trace({ uri: requestOptions }, 'Request URI');

      tasks.push(function (done) {
        requestWithDefaults(requestOptions, function (error, res, body) {
          let processedResult = handleRestError(error, entity, res, body);

          if (processedResult.error) {
            done(processedResult);
            return;
          }

          done(null, processedResult);
        });
      });
    }
  });

  async.parallelLimit(tasks, MAX_PARALLEL_LOOKUPS, (err, results) => {
    if (err) {
      Logger.error({ err: err }, 'Error');
      cb(err);
      return;
    }

    results.forEach((result) => {
      if (result.body === null || _.isEmpty(result.body)) {
        lookupResults.push({
          entity: result.entity,
          data: null
        });
      } else {
        lookupResults.push({
          entity: result.entity,
          data: {
            summary: [],
            details: result.body
          }
        });
      }
    });

    Logger.debug({ lookupResults }, 'Results');
    cb(null, lookupResults);
  });
}

function handleRestError(error, entity, res, body) {
  let result;

  if (error) {
    return {
      error: error,
      detail: 'HTTP Request Error'
    };
  }

  if (res.statusCode === 200) {
    // we got data!
    result = {
      entity: entity,
      body: body
    };
  } else if (res.statusCode === 404) {
    // no result found
    result = {
      entity: entity,
      body: null
    };
  } else if (res.statusCode === 202) {
    // no result found
    result = {
      entity: entity,
      body: null
    };
  } else {
    // unexpected status code
    result = {
      entity: entity,
      error: body,
      detail: `Unexpected error occurred, please check credentials or reach out to your Polarity Admin`
    };
  }
  return result;
}

module.exports = {
  doLookup: doLookup,
  startup: startup
};
