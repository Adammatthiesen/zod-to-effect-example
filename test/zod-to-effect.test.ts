import * as vi from 'vitest'
import prettier from '@prettier/sync'
import { z } from 'zod'
import { zodToEffect } from '../src/zod-to-effect.js'

function format(src: string) {
  return prettier.format(src, { parser: 'typescript', semi: false })
}

vi.describe('zodToEffect', () => {
  vi.test('kitchen sink', () => {
    vi.expect.soft(format(
      zodToEffect.toString(
        z.union([
          z.object({
            abc: z.tuple([
              z.string(),
              z.object({
                def: z.optional(z.int()),
                ghi: z.array(z.number()),
              })
            ])
          }),
          z.intersection(
            z.object({
              jkl: z.record(
                z.string(),
                z.array(z.number())
              )
            }),
            z.object({
              mno: z.map(
                z.set(z.date()),
                z.nullable(
                  z.union([
                    z.literal([1, 2, 3]),
                    z.bigint()
                  ])
                )
              )
            })
          )
        ])

      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Union(
        Schema.Struct({
          abc: Schema.Tuple(
            Schema.String,
            Schema.Struct({
              def: Schema.optional(Schema.Int),
              ghi: Schema.Array(Schema.Number),
            }),
          ),
        }),
        Schema.Struct({
          jkl: Schema.Record({
            key: Schema.String,
            value: Schema.Array(Schema.Number),
          }),
        }).pipe(
          Schema.extend(
            Schema.Struct({
              mno: Schema.Map({
                key: Schema.Set(Schema.Date),
                value: Schema.Union(
                  Schema.Union(Schema.Literal(1, 2, 3), Schema.BigInt),
                  Schema.Null,
                ),
              }),
            }),
          ),
        ),
      )
      "
    `)
  })

  vi.test('nullary types', () => {
    vi.expect.soft(format(
      zodToEffect.toString(
        z.never()
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Never
      "
    `)

    vi.expect.soft(format(
      zodToEffect.toString(
        z.any()
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Any
      "
    `)

    vi.expect.soft(format(
      zodToEffect.toString(
        z.unknown()
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Unknown
      "
    `)
      
    vi.expect.soft(format(
      zodToEffect.toString(
        z.void()
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Void
      "
    `)

    vi.expect.soft(format(
      zodToEffect.toString(
        z.undefined()
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Undefined
      "
    `)

    vi.expect.soft(format(
      zodToEffect.toString(
        z.null()
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Null
      "
    `)

    vi.expect.soft(format(
      zodToEffect.toString(
        z.symbol()
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Symbol
      "
    `)

    vi.expect.soft(format(
      zodToEffect.toString(
        z.boolean()
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Boolean
      "
    `)

    vi.expect.soft(format(
      zodToEffect.toString(
        z.nan()
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Literal(NaN)
      "
    `)

    vi.expect.soft(format(
      zodToEffect.toString(
        z.int()
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Int
      "
    `)

    vi.expect.soft(format(
      zodToEffect.toString(
        z.bigint()
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.BigInt
      "
    `)

    vi.expect.soft(format(
      zodToEffect.toString(
        z.number()
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Number
      "
    `)

    vi.expect.soft(format(
      zodToEffect.toString(
        z.string()
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.String
      "
    `)

    vi.expect.soft(format(
      zodToEffect.toString(
        z.date()
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Date
      "
    `)
  })

  vi.test('z.array', () => {
    vi.expect.soft(format(
      zodToEffect.toString(
        z.array(z.unknown())
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Array(Schema.Unknown)
      "
    `)
      
    vi.expect.soft(format(
      zodToEffect.toString(
        z.array(z.array(z.number()))
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Array(Schema.Array(Schema.Number))
      "
    `)
  })

  vi.test('z.object', () => {
    vi.expect.soft(format(
      zodToEffect.toString(
        z.object({})
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Struct({})
      "
    `)

    vi.expect.soft(format(
      zodToEffect.toString(
        z.object({
          abc: z.string(),
          def: z.number(),
        })
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Struct({ abc: Schema.String, def: Schema.Number })
      "
    `)

    vi.expect.soft(format(
      zodToEffect.toString(
        z.object({
          abc: z.optional(z.string()),
          def: z.optional(z.number()),
        })
      )
    )).toMatchInlineSnapshot
      (`
      "Schema.Struct({
        abc: Schema.optional(Schema.String),
        def: Schema.optional(Schema.Number),
      })
      "
    `)
  })
})
