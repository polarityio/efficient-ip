module.exports = {
  name: 'EfficientIP SOLIDserver',
  acronym: 'EIP',
  description: 'Searches EfficientIP SOLIDserver for metadata regarding observed IPv4 addresses',
  entityTypes: ['ipv4'],
  logging: { level: 'info' },
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
      name: 'EfficientIP SOLIDServer URL',
      description: 'The URL for your EfficientIP SOLIDserver instance to include the schema (i.e., https://)',
      type: 'text',
      default: '',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'username',
      name: 'EfficientIP Username',
      description: 'The username to authenticate as on your EfficientIP SOLIDserver',
      default: '',
      type: 'text',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'password',
      name: 'EfficientIP password',
      description: 'The password to authenticate to the EfficientIP SOLIDserver',
      default: '',
      type: 'password',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'privateIpOnly',
      name: 'Only search private RFC 1918 Addresses',
      description: 'If checked, the integration will only search private RFC 1918 IP addresses.',
      default: false,
      type: 'boolean',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'blocklist',
      name: 'Ignored IP Addresses',
      description: 'A comma delimited list of IP addresses that will never be searched in EfficientIP',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    },
    {
      key: 'ipBlocklistRegex',
      name: 'Ignored IP Addresses Regex',
      description: 'IP Addresses that match the given regex will not be searched in EfficientIP (if blank, no IPs will be ignored)',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: false
    }
  ]
};
