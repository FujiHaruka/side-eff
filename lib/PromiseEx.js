class PromiseEx extends Promise {
  affectThen (fn) {
    return this.then((sideEffect) => sideEffect.affectThen(fn))
  }
}

module.exports = PromiseEx
