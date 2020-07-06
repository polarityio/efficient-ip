module.exports = {
  name: 'efficientiP SOLIDserver',
  acronym: 'EIP',
  description: 'Searches efficientiP for metadata regarding observed IPv4 addresses',
  entityTypes: ['ipv4'],
  logging: { level: 'trace' },
  block: {
    component: {
      file: './components/block.js'
    },
    template: {
      file: './templates/block.hbs'
    }
  },
  summary: {
    component: {
      file: './components/summary.js'
    },
    template: {
      file: './templates/summary.hbs'
    }
  },
  request: {
    // Provide the path to your certFile. Leave an empty string to ignore this option.
    // Relative paths are relative to the integration's root directory
    cert: '',
    // Provide the path to your private key. Leave an empty string to ignore this option.
    // Relative paths are relative to the integration's root directory
    key: '',
    // Provide the key passphrase if required.  Leave an empty string to ignore this option.
    // Relative paths are relative to the integration's root directory
    passphrase: '',
    // Provide the Certificate Authority. Leave an empty string to ignore this option.
    // Relative paths are relative to the integration's root directory
    ca: '',
    // An HTTP proxy to be used. Supports proxy Auth with Basic Auth, identical to support for
    // the url parameter (by embedding the auth info in the uri)
    proxy: '',
    /**
     * If set to false, the integration will ignore SSL errors.  This will allow the integration to connect
     * to the server without valid SSL certificates.  Please note that we do NOT recommending setting this
     * to false in a production environment.
     */
    rejectUnauthorized: true
  },
  options: [
    {
      key: 'url',
      name: 'efficientiP Server URL',
      description:
        'The URL for your FIR instance to include the schema (i.e., https://)',
      type: 'text',
      default: '',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'username',
      name: 'efficientiP username',
      description:
        'The username to authenticate to the efficientiP server',
      default: '',
      type: 'text',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'password',
      name: 'efficientiP password',
      description:
        'The password to authenticate to the efficientiP server',
      default: '',
      type: 'password',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'blocklist',
      name: 'Entity Blocklist IPs',
      description: 'A list of entities that will never be seached in efficientIp',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'ipBlocklistRegex',
      name: 'IP Blocklist Regex',
      description:
        'A list of regexes that will never be used to never search entites in efficientIP',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    }
  ]
};
