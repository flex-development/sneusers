/// <reference path='@flex-development/exceptions/index.d.ts' />
/// <reference path='chai/index.d.ts' />
/// <reference path='faker/index.d.ts' />
/// <reference path='mocha/global.d.ts' />
/// <reference path='node/globals.global.d.ts' />
/// <reference path='pretty-format/index.d.ts' />
/// <reference path='sinon/index.d.ts' />

// @ts-expect-error Declaration name conflicts with built-in global identifier
declare let globalThis: typeof global.globalThis
