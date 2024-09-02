/*************************************************************
 *
 *  KaTeX physics.js
 *
 *  This file implements a KaTeX version of physics version 1.3.
 *  It is adapted from MathJax-third-party-extensions/legacy/physics/
 *  https://github.com/mathjax/MathJax-third-party-extensions/tree/master/legacy/physics
 *  It differs from the MathJax version as follows:
 *    1. The interface is changed so that it can be called from KaTeX, not MathJax.
 *    2. Added additional macros missing from the MathJax version as referenced from
 *       https://mirrors.ibiblio.org/CTAN/macros/latex/contrib/physics/physics.pdf
 *        - \trace
 *        - \Trace
 *        - \ip
 *        - Matrix macros
 *    3. Removed the following macros as they are already implemented in KaTeX:
 *       - \Im
 *       - \ket
 *       - \bra
 *       - \braket
 *
 *  Some features are not implemented yet:
 *   - `*` modified command
 *   - `[]` or `()` modified command
 *   - variable no. of arguments
 *
 *  Many features are still buggy, for example, Matrix macros.
 *  However, there is a working implementation here:
 *  https://github.com/balthild/katex-physics
 *
 *  This code, as other KaTeX code, is released under the MIT license.
 *
 * /*************************************************************
 *
 *  MathJax-third-party-extensions/legacy/physics/
 *  https://github.com/mathjax/MathJax-third-party-extensions/tree/master/legacy/physics
 *
 *  Mimics the LaTeX Physics Package
 *
 *  ---------------------------------------------------------------------
 *
 *  Copyright (c) 2011-2015 The MathJax Consortium
 *  Copyright (c) 2024 Dulapah Vibulsanti
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

//
// Coding Style
//   - use '' for identifiers that can by minified/uglified
//   - use "" for strings that need to stay untouched

// version: "3.3.0" for MathJax and KaTeX

// import katex from "katex";

// Automatic bracing
katex.__defineMacro("\\quantity", "{\\left\\{#1\\right\\}}");
katex.__defineMacro("\\qty", "{\\left\\{#1\\right\\}}");
katex.__defineMacro("\\pqty", "{\\left(#1\\right)}");
katex.__defineMacro("\\bqty", "{\\left[#1\\right]}");
katex.__defineMacro("\\vqty", "{\\left\\vert#1\\right\\vert}");
katex.__defineMacro("\\Bqty", "{\\left\\{#1\\right\\}}");
katex.__defineMacro("\\absolutevalue", "{\\left\\vert#1\\right\\vert}");
katex.__defineMacro("\\abs", "{\\left\\vert#1\\right\\vert}");
katex.__defineMacro("\\norm", "{\\left\\Vert#1\\right\\Vert}");
katex.__defineMacro("\\evaluated", "{#1\\vert}");
katex.__defineMacro("\\eval", "{#1\\vert}");
katex.__defineMacro("\\order", "{\\mathcal{O}\\left(#1\\right)}");
katex.__defineMacro("\\commutator", "{\\left[#1,#2\\right]}");
katex.__defineMacro("\\comm", "{\\left[#1,#2\\right]}");
katex.__defineMacro("\\anticommutator", "{\\left\\{#1,#2\\right\\}}");
katex.__defineMacro("\\acomm", "{\\left\\{#1,#2\\right\\}}");
katex.__defineMacro("\\poissonbracket", "{\\left\\{#1,#2\\right\\}}");
katex.__defineMacro("\\pb", "{\\left\\{#1,#2\\right\\}}");

// Vector notation
katex.__defineMacro("\\vectorbold", "{\\boldsymbol{#1}}");
katex.__defineMacro("\\vb", "{\\boldsymbol{#1}}");
katex.__defineMacro("\\vectorarrow", "{\\vec{\\boldsymbol{#1}}}");
katex.__defineMacro("\\va", "{\\vec{\\boldsymbol{#1}}}");
katex.__defineMacro("\\vectorunit", "{{\\boldsymbol{\\hat{#1}}}}");
katex.__defineMacro("\\vu", "{{\\boldsymbol{\\hat{#1}}}}");
katex.__defineMacro("\\dotproduct", "{\\boldsymbol\\cdot}");
katex.__defineMacro("\\vdot", "{\\boldsymbol\\cdot}");
katex.__defineMacro("\\crossproduct", "{\\boldsymbol\\times}");
katex.__defineMacro("\\cross", "{\\boldsymbol\\times}");
katex.__defineMacro("\\cp", "{\\boldsymbol\\times}");
katex.__defineMacro("\\gradient", "{\\boldsymbol\\nabla}");
katex.__defineMacro("\\grad", "{\\boldsymbol\\nabla}");
katex.__defineMacro("\\divergence", "{\\grad\\vdot}");
katex.__defineMacro("\\div", "{\\grad\\vdot}");
katex.__defineMacro("\\curl", "{\\grad\\cross}");
katex.__defineMacro("\\laplacian", "{\\nabla^2}");

// Operators
katex.__defineMacro("\\trace", "{\\operatorname{tr}}"); // In addition to MathJax
katex.__defineMacro("\\tr", "{\\operatorname{tr}}");
katex.__defineMacro("\\Trace", "{\\operatorname{Tr}}"); // In addition to MathJax
katex.__defineMacro("\\Tr", "{\\operatorname{Tr}}");
katex.__defineMacro("\\rank", "{\\operatorname{rank}}");
katex.__defineMacro("\\erf", "{\\operatorname{erf}}");
katex.__defineMacro("\\Res", "{\\operatorname{Res}}");
katex.__defineMacro("\\principalvalue", "{\\mathcal{P}}");
katex.__defineMacro("\\pv", "{\\mathcal{P}}");
katex.__defineMacro("\\PV", "{\\operatorname{P.V.}}");
katex.__defineMacro("\\Re", "{\\operatorname{Re}\\left\\{#1\\right\\}}");
// katex.__defineMacro("\\Im", "{\\operatorname{Im}\\left\\{#1\\right\\}}");

// Quick quad text
katex.__defineMacro("\\qqtext", "{\\quad\\text{#1}\\quad}");
katex.__defineMacro("\\qq", "{\\quad\\text{#1}\\quad}");
katex.__defineMacro("\\qcomma", "{\\text{,}\\quad}");
katex.__defineMacro("\\qc", "{\\text{,}\\quad}");
katex.__defineMacro("\\qcc", "{\\quad\\text{c.c.}\\quad}");
katex.__defineMacro("\\qif", "{\\quad\\text{if}\\quad}");
katex.__defineMacro("\\qthen", "{\\quad\\text{then}\\quad}");
katex.__defineMacro("\\qelse", "{\\quad\\text{else}\\quad}");
katex.__defineMacro("\\qotherwise", "{\\quad\\text{otherwise}\\quad}");
katex.__defineMacro("\\qunless", "{\\quad\\text{unless}\\quad}");
katex.__defineMacro("\\qgiven", "{\\quad\\text{given}\\quad}");
katex.__defineMacro("\\qusing", "{\\quad\\text{using}\\quad}");
katex.__defineMacro("\\qassume", "{\\quad\\text{assume}\\quad}");
katex.__defineMacro("\\qsince", "{\\quad\\text{since}\\quad}");
katex.__defineMacro("\\qlet", "{\\quad\\text{let}\\quad}");
katex.__defineMacro("\\qfor", "{\\quad\\text{for}\\quad}");
katex.__defineMacro("\\qall", "{\\quad\\text{all}\\quad}");
katex.__defineMacro("\\qeven", "{\\quad\\text{even}\\quad}");
katex.__defineMacro("\\qodd", "{\\quad\\text{odd}\\quad}");
katex.__defineMacro("\\qinteger", "{\\quad\\text{integer}\\quad}");
katex.__defineMacro("\\qand", "{\\quad\\text{and}\\quad}");
katex.__defineMacro("\\qor", "{\\quad\\text{or}\\quad}");
katex.__defineMacro("\\qas", "{\\quad\\text{as}\\quad}");
katex.__defineMacro("\\qin", "{\\quad\\text{in}\\quad}");

// Derivatives
katex.__defineMacro("\\differential", "{\\text{d}}");
katex.__defineMacro("\\dd", "{\\text{d}}");
katex.__defineMacro("\\derivative", "{\\frac{\\text{d}{#1}}{\\text{d}{#2}}}");
katex.__defineMacro("\\dv", "{\\frac{\\text{d}{#1}}{\\text{d}{#2}}}");
katex.__defineMacro(
    "\\partialderivative",
    "{\\frac{\\partial{#1}}{\\partial{#2}}}",
);
katex.__defineMacro("\\pdv", "{\\frac{\\partial{#1}}{\\partial{#2}}}");
katex.__defineMacro("\\variation", "{\\delta}");
katex.__defineMacro("\\var", "{\\delta}");
katex.__defineMacro(
    "\\functionalderivative",
    "{\\frac{\\delta{#1}}{\\delta{#2}}}",
);
katex.__defineMacro("\\fdv", "{\\frac{\\delta{#1}}{\\delta{#2}}}");

// Dirac bra-ket notation
// katex.__defineMacro("\\ket", "{\\left\\vert{#1}\\right\\rangle}");
// katex.__defineMacro("\\bra", "{\\left\\langle{#1}\\right\\vert}");
katex.__defineMacro(
    "\\innerproduct",
    "{\\left\\langle{#1}\\mid{#2}\\right\\rangle}",
);
// katex.__defineMacro("\\braket", "{\\left\\langle{#1}\\mid{#2}\\right\\rangle}");
katex.__defineMacro("\\ip", "{\\left\\langle{#1}\\mid{#2}\\right\\rangle}"); // In addition to MathJax
katex.__defineMacro(
    "\\outerproduct",
    "{\\left\\vert{#1}\\right\\rangle\\left\\langle{#2}\\right\\vert}",
);
katex.__defineMacro(
    "\\dyad",
    "{\\left\\vert{#1}\\right\\rangle\\left\\langle{#2}\\right\\vert}",
);
katex.__defineMacro(
    "\\ketbra",
    "{\\left\\vert{#1}\\right\\rangle\\left\\langle{#2}\\right\\vert}",
);
katex.__defineMacro(
    "\\op",
    "{\\left\\vert{#1}\\right\\rangle\\left\\langle{#2}\\right\\vert}",
);
katex.__defineMacro(
    "\\expectationvalue",
    "{\\left\\langle{#1}\\right\\rangle}",
);
katex.__defineMacro("\\expval", "{\\left\\langle{#1}\\right\\rangle}");
katex.__defineMacro("\\ev", "{\\left\\langle{#1}\\right\\rangle}");
katex.__defineMacro(
    "\\matrixelement",
    "{\\left\\langle{#1}\\right\\vert{#2}\\left\\vert{#3}\\right\\rangle}",
);
katex.__defineMacro(
    "\\matrixel",
    "{\\left\\langle{#1}\\right\\vert{#2}\\left\\vert{#3}\\right\\rangle}",
);
katex.__defineMacro(
    "\\mel",
    "{\\left\\langle{#1}\\right\\vert{#2}\\left\\vert{#3}\\right\\rangle}",
);

// Matrix macros
katex.__defineMacro("\\matrixquantity", "{\\begin{matrix}#1\\end{matrix}}");
katex.__defineMacro("\\mqty", "{\\begin{matrix}#1\\end{matrix}}");
katex.__defineMacro(
    "\\smallmatrixquantity",
    "{\\begin{smallmatrix}#1\\end{smallmatrix}}",
);
katex.__defineMacro("\\smqty", "{\\begin{smallmatrix}#1\\end{smallmatrix}}");
katex.__defineMacro(
    "\\matrixdeterminant",
    "{\\begin{vmatrix}#1\\end{vmatrix}}",
);
katex.__defineMacro("\\mdet", "{\\begin{vmatrix}#1\\end{vmatrix}}");
katex.__defineMacro("\\identitymatrix", iMat);
katex.__defineMacro("\\imat", iMat);
katex.__defineMacro("\\xmatrix", xMat);
katex.__defineMacro("\\xmat", xMat);
katex.__defineMacro("\\zeromatrix", zMat);
katex.__defineMacro("\\zmat", zMat);
katex.__defineMacro("\\paulimatrix", pMat);
katex.__defineMacro("\\pmat", pMat);
katex.__defineMacro("\\diagonalmatrix", dMat);
katex.__defineMacro("\\dmat", dMat);
katex.__defineMacro("\\antidiagonalmatrix", aDMat);
katex.__defineMacro("\\admat", aDMat);

// Helper function to process the arguments of a macro
function processTokens(tokens) {
    var result = "";
    for (var i = tokens.length - 1; i >= 0; i--) {
        result += tokens[i].text;
    }
    return result;
}

// Generate n × n identity matrix
function iMat(context) {
    const n = processTokens(context.consumeArg().tokens);
    var matrix = "\\begin{matrix}";
    const row = "0&".repeat(n - 1) + "0\\\\";
    for (var i = 0; i < n; i++) {
        matrix +=
            "0&".repeat(i) +
            "1" +
            (i < n - 1 ? "&" + row.slice(2 * (i + 1)) : "");
    }
    return (matrix += "\\end{matrix}");
}

// Generate n × m matrix filled with x
function xMat(context) {
    const x = processTokens(context.consumeArg().tokens);
    const n = processTokens(context.consumeArg().tokens);
    const m = processTokens(context.consumeArg().tokens);
    const row = (x + "&").repeat(m - 1) + x;
    return (
        "\\begin{matrix}" + (row + "\\\\").repeat(n - 1) + row + "\\end{matrix}"
    );
}

// n × m matrix filled with zeros
function zMat(context) {
    const n = processTokens(context.consumeArg().tokens);
    const m = processTokens(context.consumeArg().tokens);
    const row = "0&".repeat(m - 1) + "0";
    return (
        "\\begin{matrix}" + (row + "\\\\").repeat(n - 1) + row + "\\end{matrix}"
    );
}

// nth Pauli matrix
function pMat(context) {
    const body = processTokens(context.consumeArg().tokens);
    const matrices = {
        0: "\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}",
        1: "\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}",
        x: "\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}",
        2: "\\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}",
        y: "\\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}",
        3: "\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}",
        z: "\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}",
    };
    if (matrices[body]) {
        return matrices[body];
    } else {
        throw ["Invalid argument to \\pmat: ", body];
    }
}

// Diagonal matrix
function dMat(context) {
    const body = processTokens(context.consumeArg().tokens);
    const el = body.split(",").map((e) => e.trim());
    const n = el.length;
    var rows = [];
    for (var i = 0; i < n; i++) {
        var row = new Array(n);
        row[i] = el[i];
        rows.push(row.join("&"));
    }
    return "\\begin{pmatrix}" + rows.join("\\\\") + "\\end{pmatrix}";
}

// Anti-diagonal matrix
function aDMat(context) {
    const body = processTokens(context.consumeArg().tokens);
    const el = body.split(",").map((e) => e.trim());
    const n = el.length;
    var rows = [];
    for (var i = 0; i < n; i++) {
        var row = new Array(n);
        row[n - 1 - i] = el[i];
        rows.push(row.join("&"));
    }
    return "\\begin{pmatrix}" + rows.join("\\\\") + "\\end{pmatrix}";
}
