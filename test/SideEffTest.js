const SideEff = require('../lib')
const asleep = require('asleep')
const {ok, equal, deepEqual} = require('assert')

describe('SideEff', () => {
  it('sync', () => {
    const array = []
    class A extends SideEff {
      affect (payload) {
        array.push(payload)
      }
    }
    const withPush = (fn) => (arg) => new A(fn(arg), arg)
    const result = new A(1, 0)
      .affectThen(withPush((n) => n + 5))
      .affectThen(withPush((n) => n * 2))
      .unwrap()
    equal(result, 12)
    deepEqual(array, [0, 1, 6])
  })

  it('async', async () => {
    const array = []
    class A extends SideEff {
      async affectAsync (payload) {
        await asleep(10)
        array.push(payload)
      }
    }
    const withPush = (fn) => (arg) => new A(fn(arg), arg)
    const result = await new A(1, 0)
      .affectThen(withPush((n) => n + 5))
      .affectThen(withPush((n) => n * 2))
      .unwrap()
    equal(result, 12)
    deepEqual(array, [0, 1, 6])
  })

  it('error', () => {
    class NoImpl extends SideEff {}
    {
      let err
      try {
        NoImpl(1, 1)
      } catch (e) {
        err = e
      }
      ok(err)
    }
  })
})

/* global describe, it */
