const ContextResolve = require('../../src/context-resolve')
const Logger = require('../../src/logger')

jest.mock('../../src/resolve', () => jest.fn())

const resolve = require('../../src/resolve')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Test ContextResolve', () => {
  describe('constructor', () => {
    test('private property', () => {
      let { query, logger, ctx } = init()
      expect(ctx._query).toBe(query)
      expect(ctx._logger).toBe(logger)
    })
  })
  describe('resolve', () => {
    test('should resolve the expect value', () => {
      let { logger, ctx } = init()
      let ctx1 = {}
      let value = {}
      let returnValue = {}
      resolve.mockReturnValueOnce(returnValue)
      expect(ctx.resolve(ctx1, value)).toBe(returnValue)
      expect(resolve.mock.calls[0]).toEqual([ctx1, value])
    })
  })
  describe('query', () => {
    test('should query the linked data', () => {
      let { query, ctx } = init()
      let path = '$$$$abc'
      let returnValue = {}
      query.mockReturnValueOnce(returnValue)
      expect(ctx.query(path)).toEqual(returnValue)
      expect(query.mock.calls[0]).toEqual([path, true])
    })
  })
  describe('error', () => {
    test('should log the error msg', () => {
      let { ctx, logger } = init()
      expect(ctx.error('msg')).toBeUndefined()
      expect(logger._msgs[0]).toBe('msg')
    })
  })
  describe('clearLog', () => {
    test('should clear all error msgs', () => {
      let { ctx, logger } = init()
      ctx.error('msg')
      expect(logger.dirty()).toBe(true)
      ctx.clearLog()
      expect(logger.dirty()).toBe(false)
    })
  })
  describe('hasError', () => {
    test('should detect wheter context has error', () => {
      let { ctx, logger } = init()
      expect(ctx.hasError()).toBe(false)
      ctx.error('msg')
      expect(ctx.hasError()).toBe(true)
    })
  })
  describe('enter', () => {
    test('should enter the scoped context', () => {
      let { ctx, logger } = init()
      let scopedCtx = ctx.enter('scoped')
      expect(scopedCtx).toBeInstanceOf(ContextResolve)
      expect(scopedCtx._query).toBe(ctx._query)
      expect(scopedCtx._logger).toBe(logger.findChild('scoped'))
    })
  })
})

function init() {
  let query = jest.fn()
  let logger = new Logger()
  let ctx = new ContextResolve(query, logger)
  return { query, logger, ctx }
}
