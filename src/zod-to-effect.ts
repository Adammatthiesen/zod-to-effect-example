import { zx } from '@traversable/zod'
import { z } from 'zod'
import * as Schema from 'effect/Schema'

zodToEffect.toString = zodToEffect_toString

export function zodToEffect<T>(schema: z.ZodType<T>): Schema.Schema<T>
export function zodToEffect<T extends z.core.$ZodType>(schema: T) {
  return zx.fold<Schema.Schema.Any>((x) => {
    switch (true) {
      default: return x satisfies never as never
      // the usual suspects:
      case zx.tagged('never')(x): return Schema.Never as never
      case zx.tagged('any')(x): return Schema.Any
      case zx.tagged('unknown')(x): return Schema.Unknown
      case zx.tagged('void')(x): return Schema.Void
      case zx.tagged('undefined')(x): return Schema.Undefined
      case zx.tagged('null')(x): return Schema.Null
      case zx.tagged('symbol')(x): return Schema.Symbol
      case zx.tagged('boolean')(x): return Schema.Boolean
      case zx.tagged('nan')(x): return Schema.Literal(NaN)
      case zx.tagged('int')(x): return Schema.Int
      case zx.tagged('bigint')(x): return Schema.BigInt
      case zx.tagged('number')(x): return Schema.Number
      case zx.tagged('string')(x): return Schema.String
      case zx.tagged('date')(x): return Schema.Date
      case zx.tagged('literal')(x): return Schema.Literal(...x._zod.def.values as string[])
      case zx.tagged('enum')(x): return Schema.Enums(Object.fromEntries(x._zod.def.entries as never))
      case zx.tagged('array')(x): return Schema.Array(x._zod.def.element)
      case zx.tagged('optional')(x): return Schema.optional(x._zod.def.innerType) as never
      case zx.tagged('nonoptional')(x): return x._zod.def.innerType
      case zx.tagged('readonly')(x): return x._zod.def.innerType
      case zx.tagged('set')(x): return Schema.Set(x._zod.def.valueType)
      case zx.tagged('map')(x): return Schema.Map({ key: x._zod.def.keyType, value: x._zod.def.valueType })
      case zx.tagged('nullable')(x): return Schema.Union(x._zod.def.innerType, Schema.Null)
      case zx.tagged('object')(x): return Schema.Struct(x._zod.def.shape)
      case zx.tagged('tuple')(x): return Schema.Tuple(...x._zod.def.items)
      case zx.tagged('union')(x): return Schema.Union(...x._zod.def.options)
      case zx.tagged('intersection')(x): return Schema.Struct(x._zod.def.left as {}).pipe(Schema.extend(x._zod.def.right))
      case zx.tagged('record')(x): return Schema.Record({ key: x._zod.def.keyType, value: x._zod.def.valueType })
      // not sure how these schemas map to Effect (if they do at all):
      case zx.tagged('lazy')(x):
      case zx.tagged('prefault')(x):
      case zx.tagged('default')(x):
      case zx.tagged('catch')(x):
      case zx.tagged('custom')(x):
      case zx.tagged('success')(x):
      case zx.tagged('pipe')(x):
      case zx.tagged('promise')(x):
      case zx.tagged('file')(x): 
      case zx.tagged('transform')(x):
      case zx.tagged('template_literal')(x): { throw Error('Unsupported schema: ' + x._zod.def.type) }
    }
  })(schema)
}

function zodToEffect_toString<T>(schema: z.ZodType<T>): string
function zodToEffect_toString<T extends z.core.$ZodType>(schema: T) {
  return zx.fold<string>((x, _, input) => {
    switch (true) {
      default: return x satisfies never
      // the usual suspects:
      case zx.tagged('never')(x): return 'Schema.Never'
      case zx.tagged('any')(x): return 'Schema.Any'
      case zx.tagged('unknown')(x): return 'Schema.Unknown'
      case zx.tagged('void')(x): return 'Schema.Void'
      case zx.tagged('undefined')(x): return 'Schema.Undefined'
      case zx.tagged('null')(x): return 'Schema.Null'
      case zx.tagged('symbol')(x): return 'Schema.Symbol'
      case zx.tagged('boolean')(x): return 'Schema.Boolean'
      case zx.tagged('nan')(x): return 'Schema.Literal(NaN)'
      case zx.tagged('int')(x): return 'Schema.Int'
      case zx.tagged('bigint')(x): return 'Schema.BigInt'
      case zx.tagged('number')(x): return 'Schema.Number'
      case zx.tagged('string')(x): return 'Schema.String'
      case zx.tagged('date')(x): return 'Schema.Date'
      case zx.tagged('literal')(x): return `Schema.Literal(${x._zod.def.values.map((x) => typeof x === 'string' ? `"${x}"` : `${x}`).join(', ')})`
      case zx.tagged('enum')(x): return `Schema.Enums(${x._zod.def.entries})`
      case zx.tagged('array')(x): return `Schema.Array(${x._zod.def.element})`
      case zx.tagged('optional')(x): return `Schema.optional(${x._zod.def.innerType})`
      case zx.tagged('nonoptional')(x): return x._zod.def.innerType
      case zx.tagged('readonly')(x): return x._zod.def.innerType
      case zx.tagged('set')(x): return `Schema.Set(${x._zod.def.valueType})`
      case zx.tagged('map')(x): return `Schema.Map({ key: ${x._zod.def.keyType}, value: ${x._zod.def.valueType} })`
      case zx.tagged('nullable')(x): return `Schema.Union(${x._zod.def.innerType}, Schema.Null)`
      case zx.tagged('tuple')(x): return `Schema.Tuple(${x._zod.def.items.join(', ')})`
      case zx.tagged('union')(x): return `Schema.Union(${x._zod.def.options.join(', ')})`
      case zx.tagged('intersection')(x): return `${x._zod.def.left}.pipe(Schema.extend(${x._zod.def.right}))`
      case zx.tagged('record')(x): return `Schema.Record({ key: ${x._zod.def.keyType}, value: ${x._zod.def.valueType} })`
      case zx.tagged('object')(x): return `Schema.Struct({ ${Object.entries(x._zod.def.shape).map(([k, v]) => `${k}: ${v}`).join(', ')} })`
      // not sure how these schemas map to Effect (if they do at all):
      case zx.tagged('lazy')(x):
      case zx.tagged('prefault')(x):
      case zx.tagged('default')(x):
      case zx.tagged('catch')(x):
      case zx.tagged('custom')(x):
      case zx.tagged('success')(x):
      case zx.tagged('pipe')(x):
      case zx.tagged('promise')(x):
      case zx.tagged('file')(x): 
      case zx.tagged('transform')(x):
      case zx.tagged('template_literal')(x): { throw Error('Unsupported schema: ' + x._zod.def.type) }
    }
  })(schema)
}

