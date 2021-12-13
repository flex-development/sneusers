declare global {
  namespace EsmLoader {
    type Format =
      | 'builtin'
      | 'commonjs'
      | 'dynamic'
      | 'json'
      | 'module'
      | 'wasm'

    type Source = string | Buffer

    const hooks: {
      getFormat: Hooks.GetFormat
      resolve: Hooks.Resolve
      transformSource: Hooks.TransformSource
    }

    namespace Hooks {
      type GetFormat = (
        url: string,
        context: HookContext.GetFormat,
        defaultGetFormat: GetFormat
      ) => Promise<HookResult.GetFormat>

      type Resolve = (
        specifier: string,
        context: HookContext.Resolve,
        defaultResolve: Resolve
      ) => Promise<HookResult.Resolve>

      type TransformSource = (
        source: Source,
        context: HookContext.TransformSource,
        defaultTransformSource: TransformSource
      ) => Promise<HookResult.TransformSource>
    }

    namespace HookContext {
      type GetFormat = Record<never, never>
      type Resolve = { parentURL: string }
      type TransformSource = { format: Format; url: string }
    }

    namespace HookResult {
      type GetFormat = { format: Format }
      type Resolve = { url: string }
      type TransformSource = { source: Source }
    }
  }
}

export {}
