/// <reference path='@faker-js/faker/index.d.ts' />
/// <reference path='@flex-development/exceptions/index.d.ts' />
/// <reference path='cache-manager-redis-store/index.d.ts' />
/// <reference path='chai/index.d.ts' />
/// <reference path='mocha/index.d.ts' />
/// <reference path='node/index.d.ts' />
/// <reference path='pretty-format/index.d.ts' />
/// <reference path='sinon/index.d.ts' />
/// <reference path='volleyball/index.d.ts' />

// @ts-expect-error Declaration name conflicts with built-in global identifier
declare let globalThis: typeof global.globalThis
