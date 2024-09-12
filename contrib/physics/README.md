# Physics Extension

This extension adds a set of macros from the [physics](https://ctan.org/pkg/physics) package.

## Syntax

See the [physics Manual](http://mirrors.ctan.org/macros/latex/contrib/physics/physics.pdf) for a full explanation of the input syntax, with working examples.

## Note

- Old `\Re` renamed to `\real`.
- Old `\Im` renamed to `\imaginary`.
- Standard trig functions are available without any automatic bracing under a new set of longer names, e.g.:
  - Old `\sin` renamed to `\sine`.
  - New `\sin` supports automatic bracing and optional power argument, e.g. `\sin[2](x)`.
- Similar behavior has also been extended to the following functions: `\exponential`,`\logarithm`,`\naturallogarithm`,`\determinant`,`\Probability`, e.g. `\exp` and `\exponential`.

## List of macros added

List of physics macros added to KaTeX from the physics package section 2.

### 2.1 Automatic bracing

`\quantity`,`\qty`,`\pqty`,`\bqty`,`\vqty`,`\Bqty`,`\absolutevalue`,`\abs`,`\norm`,`\evaluated`,`\eval`,`\order`,`\commutator`,`\comm`,`\anticommutator`,`\acomm`,`\poissonbracket`,`\pb`

### 2.2 Vector notation

`\vectorbold`,`\vb`,`\vectorarrow`,`\va`,`\vectorunit`,`\vu`,`\dotproduct`,`\vdot`,`\crossproduct`,`\cross`,`\cp`,`\gradient`,`\grad`,`\divergence`,`\div`,`\curl`,`\laplacian`

### 2.3 Operators

`\sin`,`\cos`,`\tan`,`\csc`,`\sec`,`\cot`,`\sinh`,`\cosh`,`\tanh`,`\csch`,`\sech`,`\coth`,`\arcsin`,`\arccos`,`\arctan`,`\arccsc`,`\arcsec`,`\arccot`,`asin`,`acos`,`atan`,`acsc`,`asec`,`acot`,`\sine`,`\cosine`,`\tangent`,`\cosecant`,`\secant`,`\cotangent`,`\hypsine`,`\hypcosine`,`\hyptangent`,`\hypcosecant`,`\hypsecant`,`\hypcotangent`,`\arcsine`,`\arccosine`,`\arctangent`,`\arccosecant`,`\arcsecant`,`\arccotangent`,`\asine`,`\acosine`,`\atangent`,`\acosecant`,`\asecant`,`\acotangent`,`\exponential`,`\logarithm`,`\naturallogarithm`,`\determinant`,`\Probability`,`\trace`,`\tr`,`\Trace`,`\Tr`,`\rank`,`\erf`,`\Res`,`\principalvalue`,`\pv`,`\PV`,`Re`,`Im`

### 2.4 Quick quad text

`\qqtext`,`\qq`,`\qcomma`,`\qc`,`\qcc`,`\qif`,`\qthen`,`\qelse`,`\qotherwise`,`\qunless`,`\qgiven`,`\qusing`,`\qassume`,`\qsince`,`\qlet`,`\qfor`,`\qall`,`\qeven`,`\qodd`,`\qinteger`,`\qand`,`\qor`,`\qas`,`\qin`

### 2.5 Derivatives

`\differential`,`\dd`,`derivative`,`\dv`,`\partialderivative`,`\pdv`,`\variation`,`\var`,`\functionalderivative`,`\fdv`

### 2.6 Dirac bra-ket notation

`\ket`,`\bra`,`\innerproduct`,`\braket`,`\ip`,`\outerproduct`,`\dyad`,`\ketbra`,`\op`,`\expectationvalue`,`\expval`,`\ev`,`\matrixelement`,`\matrixel`,`\mel`

### 2.7 Matrix macros

`\matrixquantity`,`\mqty`,`\pmqty`,`\Pmqty`,`\bmqty`,`\vmqty`,`\smallmatrixquantity`,`\smqty`,`\spmqty`,`\sPmqty`,`\sbmqty`,`\svmqty`,`\matrixdeterminant`,`\mdet`,`\smdet`,`\identitymatrix`,`\imat`,`\xmatrix`,`\xmat`,`\zeromatrix`,`\zmat`,`\paulimatrix`,`\pmat`,`\diagonalmatrix`,`\dmat`,`\antidiagonalmatrix`,`\admat`
