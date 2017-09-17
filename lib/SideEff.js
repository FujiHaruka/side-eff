class SideEff {
  constructor (value, payload) {
    const s = this
    s.value = value
    s.payload = payload

    const isImpl = s._isImplementedAffect()
    const isImplA = s._isImplementedAffectAsync()
    const isBothImpl = isImpl && isImplA
    const isNeitherImpl = !isImpl && !isImplA
    if (isBothImpl) {
      throw new Error('Both of "affect" and "affectAsync" methods must not be overrided in SideEff extended class. Allowed only one.')
    }
    if (isNeitherImpl) {
      throw new Error('One of "affect" and "affectAsync" methods must be overrided in SideEff extended class.')
    }
  }

  affect () {
    throw new Error('"affect" method is not implemented.')
  }

  affectAsync () {
    throw new Error('"affectAsync" method is not implemented.')
  }

  affectThen (fn) {
    const s = this
    if (s._isImplementedAffect()) {
      s.affect(s.payload)
      return fn(s.value)
    } else {
      const sideEffect = fn(s.value)
      const promise = s.affectAsync(s.payload)
      promise.affectThen = sideEffect.affectThen
      promise.unwrap = sideEffect.unwrap
      return promise.then(() => sideEffect)
    }
  }

  unwrap () {
    const s = this
    if (s._isImplementedAffect()) {
      s.affect(s.payload)
      return s.value
    } else {
      return s.affectAsync(s.payload)
        .then(() => s.value)
    }
  }

  _isImplementedAffect () {
    return this.affect !== SideEff.prototype.affect
  }

  _isImplementedAffectAsync () {
    return this.affectAsync !== SideEff.prototype.affectAsync
  }
}

module.exports = SideEff
