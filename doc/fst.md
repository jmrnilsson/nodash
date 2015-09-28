`(a, b) → a`

Extract the first component of a pair.

Nodash implements pairs as arrays of two elements. `fst` is a function form for the
syntactic form `x[0]` and therefore works on any array or string, i.e. you can
think of it as having the overloaded signatures `[a] → a` and `String → String`.