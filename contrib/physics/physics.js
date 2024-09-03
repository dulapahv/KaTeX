/*************************************************************
 *
 *  KaTeX physics.js
 *
 *  This file implements a KaTeX version of physics version 1.3.
 *  It is adapted from
 *   - https://github.com/balthild/katex-physics
 *   - MathJax-third-party-extensions/legacy/physics/
 *     https://github.com/mathjax/MathJax-third-party-extensions/tree/master/legacy/physics
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

// import katex from "katex";

/*************************************************************
 * Add macros to KaTeX
 */
//
// Automatic bracing
//
function getDelimSize(prefix) {
    switch (prefix) {
        case "\\big":
            return "\\bigl";
        case "\\Big":
            return "\\Bigl";
        case "\\bigg":
            return "\\biggl";
        case "\\Bigg":
            return "\\Biggl";
        default:
            if (prefix.startsWith("\\")) {
                throw new Error("Invalid size specifier: " + start);
            }
            return "";
    }
}

katex.__defineMacro("\\quantity", function (ctx) {
    const prefix = ctx.popToken().text;
    const lBracesSize = getDelimSize(prefix);
    const rBracesSize = bracesSize[lBracesSize];
    const lBraces = lBracesSize ? ctx.popToken().text : prefix;
    const rBraces = braces[lBraces];
    if (typeof rBraces === "undefined") {
        throw new Error("Expecting opening delimiters after the command");
    }
    const expr = [lBracesSize || "\\left", lBraces === "{" ? "\\{" : lBraces];
    let opened = 0;
    while (true) {
        const next = ctx.popToken().text;
        if (next === "EOF") {
            throw new Error(`Expecting closing delimiters ${rBraces}`);
        } else if (next !== rBraces) {
            expr.push(next);
            if (next === lBraces) {
                ++opened;
            }
        } else if (opened > 0) {
            expr.push(next);
            --opened;
        } else {
            expr.push(rBracesSize || "\\right", rBraces === "}" ? "\\}" : next);
            break;
        }
    }

    return expr.join(" ");
});
katex.__defineMacro("\\qty", "\\quantity");
katex.__defineMacro("\\pqty", "\\qty({#1})");
katex.__defineMacro("\\bqty", "\\qty[{#1}]");
katex.__defineMacro("\\vqty", "\\qty|{#1}|");
katex.__defineMacro("\\Bqty", "\\qty{{#1}}");
katex.__defineMacro("\\absolutevalue", function (ctx) {
    return isAlt(ctx) ? "\\lvert{#1}\\rvert" : "\\qty|{#1}|";
    // const prefix = ctx.future().text;
    // const lBracesSize = getDelimSize(prefix);
    // const rBracesSize = bracesSize[lBracesSize] || "";
    // if (lBracesSize) ctx.popToken();
    // var body = "";
    // while (ctx.future().text !== "}") {
    //     body += ctx.popToken().text;
    // }
    // return lBracesSize + "|" + body + rBracesSize + "|";
});
katex.__defineMacro("\\abs", "\\absolutevalue");
katex.__defineMacro("\\norm", function (ctx) {
    return isAlt(ctx) ? "\\|{#1}\\|" : "\\left\\Vert{#1}\\right\\Vert";
    // const prefix = ctx.future().text;
    // const lBracesSize = getDelimSize(prefix);
    // const rBracesSize = bracesSize[lBracesSize] || "";
    // if (lBracesSize) ctx.popToken();
    // var body = "";
    // while (ctx.future().text !== "}") {
    //     body += ctx.popToken().text;
    // }
    // return lBracesSize + "\\|" + body + "\\|" + rBracesSize;
});
katex.__defineMacro("\\evaluated", function (ctx) {
    const start = isAlt(ctx) ? ctx.popToken().text : ctx.popToken().text;
    const end = evalBraces[start];
    if (typeof end === "undefined") {
        throw new Error("Expecting opening delimiters after \\eval");
    }
    const expr = ["\\left"];
    expr.push(start === "{" ? "." : start);
    var opened = 0;
    while (true) {
        const next = ctx.popToken().text;
        if (next === "EOF") {
            throw new Error("Expecting " + end + " after \\eval");
        } else if (next !== end) {
            expr.push(next);
            if (next === start) {
                ++opened;
            }
        } else if (end === "}" && opened > 0) {
            expr.push(next);
            --opened;
        } else {
            expr.push("\\rule{0px}{1.2em}\\right|");
            break;
        }
    }
    return expr.join(" ");
});
katex.__defineMacro("\\eval", "\\evaluated");
katex.__defineMacro("\\order", function (ctx) {
    return isAlt(ctx) ? "\\mathcal{O}({#1})" : "\\mathcal{O}\\left(#1\\right)";
});
katex.__defineMacro("\\commutator", function (ctx) {
    return isAlt(ctx) ? "[{#1},{#2}]" : "\\left[#1,#2\\right]";
});
katex.__defineMacro("\\comm", "\\commutator");
katex.__defineMacro("\\anticommutator", function (ctx) {
    return isAlt(ctx) ? "\\{{#1},{#2}\\}" : "\\left\\{#1,#2\\right\\}";
});
katex.__defineMacro("\\acomm", "\\anticommutator");
katex.__defineMacro("\\poissonbracket", "\\anticommutator");
katex.__defineMacro("\\pb", "\\anticommutator");

//
// Vector notation
//
katex.__defineMacro("\\vectorbold", function (ctx) {
    return isAlt(ctx) ? "\\boldsymbol{#1}" : "\\mathbf{#1}";
});
katex.__defineMacro("\\vb", "\\vectorbold");
katex.__defineMacro("\\vectorarrow", function (ctx) {
    return isAlt(ctx) ? "\\vec{\\boldsymbol{#1}}" : "\\vec{\\mathbf{#1}}";
});
katex.__defineMacro("\\va", "\\vectorarrow");
katex.__defineMacro("\\vectorunit", function (ctx) {
    return isAlt(ctx) ? "\\boldsymbol{\\hat{#1}}" : "\\mathbf{\\hat{#1}}";
});
katex.__defineMacro("\\vu", "\\vectorunit");
katex.__defineMacro("\\dotproduct", "\\boldsymbol\\cdot");
katex.__defineMacro("\\vdot", "\\dotproduct");
katex.__defineMacro("\\crossproduct", "\\boldsymbol\\times");
katex.__defineMacro("\\cross", "\\crossproduct");
katex.__defineMacro("\\cp", "\\crossproduct");
katex.__defineMacro("\\gradient", "\\boldsymbol\\nabla");
katex.__defineMacro("\\grad", "\\gradient");
katex.__defineMacro("\\divergence", "\\grad\\vdot");
katex.__defineMacro("\\div", "\\divergence");
katex.__defineMacro("\\curl", "\\grad\\cross");
katex.__defineMacro("\\laplacian", "\\nabla^2");

//
// Operators
//
const trigFn = [
    "sin",
    "cos",
    "tan",
    "csc",
    "sec",
    "cot",
    "sinh",
    "cosh",
    "tanh",
    "csch",
    "sech",
    "coth",
    "arcsin",
    "arccos",
    "arctan",
    "arccsc",
    "arcsec",
    "arccot",
    "asin",
    "acos",
    "atan",
    "acsc",
    "asec",
    "acot",
];

trigFn.forEach((op) => {
    katex.__defineMacro("\\" + op, function (ctx) {
        const n = getSquareParameter(ctx);
        return n ? "\\" + op + "^{" + n + "}" : "\\operatorname{" + op + "}";
    });
});

katex.__defineMacro("\\sine", "\\sin");
katex.__defineMacro("\\cosine", "\\cos");
katex.__defineMacro("\\tangent", "\\tan");
katex.__defineMacro("\\cosecant", "\\csc");
katex.__defineMacro("\\secant", "\\sec");
katex.__defineMacro("\\cotangent", "\\cot");
katex.__defineMacro("\\hypsine", "\\sinh");
katex.__defineMacro("\\hypcosine", "\\cosh");
katex.__defineMacro("\\hyptangent", "\\tanh");
katex.__defineMacro("\\hypcosecant", "\\csch");
katex.__defineMacro("\\hypsecant", "\\sech");
katex.__defineMacro("\\hypcotangent", "\\coth");
katex.__defineMacro("\\arcsine", "\\arcsin");
katex.__defineMacro("\\arccosine", "\\arccos");
katex.__defineMacro("\\arctangent", "\\arctan");
katex.__defineMacro("\\arccosecant", "\\arccsc");
katex.__defineMacro("\\arcsecant", "\\arcsec");
katex.__defineMacro("\\arccotangent", "\\arccot");
katex.__defineMacro("\\asine", "\\arcsin");
katex.__defineMacro("\\acosine", "\\arccos");
katex.__defineMacro("\\atangent", "\\arctan");
katex.__defineMacro("\\acosecant", "\\arccsc");
katex.__defineMacro("\\asecant", "\\arcsec");
katex.__defineMacro("\\acotangent", "\\arccot");
katex.__defineMacro("\\exponential", "\\exp");
katex.__defineMacro("\\logarithm", "\\log");
katex.__defineMacro("\\naturallogarithm", "\\ln");
katex.__defineMacro("\\determinant", "\\det");
katex.__defineMacro("\\Probability", "\\Pr");
katex.__defineMacro("\\trace", "\\operatorname{tr}");
katex.__defineMacro("\\tr", "\\trace");
katex.__defineMacro("\\Trace", "\\operatorname{Tr}");
katex.__defineMacro("\\Tr", "\\Trace");
katex.__defineMacro("\\rank", "\\operatorname{rank}");
katex.__defineMacro("\\erf", "\\operatorname{erf}");
katex.__defineMacro("\\Res", "\\operatorname{Res}");
katex.__defineMacro("\\principalvalue", "\\mathcal{P}");
katex.__defineMacro("\\pv", "\\principalvalue");
katex.__defineMacro("\\PV", "\\operatorname{P.V.}");
katex.__defineMacro("\\Re", "\\operatorname{Re}\\left\\{#1\\right\\}"); // old \Re renamed to \real
katex.__defineMacro("\\real", "\\mathfrak{R}");
katex.__defineMacro("\\Im", "\\operatorname{Im}\\left\\{#1\\right\\}"); // old \Im renamed to \imaginary
katex.__defineMacro("\\imaginary", "\\mathfrak{I}");

//
// Quick quad text
//
katex.__defineMacro("\\qqtext", function (ctx) {
    return (
        (isAlt(ctx) ? "" : "\\quad") + "\\text{" + ctx.popToken() + "}\\quad"
    );
});
katex.__defineMacro("\\qq", "\\qqtext");
katex.__defineMacro("\\qcomma", ",\\quad");
katex.__defineMacro("\\qc", "\\qcomma");

const qMacros = [
    {name: "qcc", text: "c.c."},
    {name: "qif", text: "if"},
    {name: "qthen", text: "then"},
    {name: "qelse", text: "else"},
    {name: "qotherwise", text: "otherwise"},
    {name: "qunless", text: "unless"},
    {name: "qgiven", text: "given"},
    {name: "qusing", text: "using"},
    {name: "qassume", text: "assume"},
    {name: "qsince", text: "since"},
    {name: "qlet", text: "let"},
    {name: "qfor", text: "for"},
    {name: "qall", text: "all"},
    {name: "qeven", text: "even"},
    {name: "qodd", text: "odd"},
    {name: "qinteger", text: "integer"},
    {name: "qand", text: "and"},
    {name: "qor", text: "or"},
    {name: "qas", text: "as"},
    {name: "qin", text: "in"},
];

qMacros.forEach(({name, text}) => {
    katex.__defineMacro("\\" + name, function (ctx) {
        return (isAlt(ctx) ? "" : "\\quad") + "\\text{" + text + "}\\quad";
    });
});

//
// Derivatives
//
katex.__defineMacro("\\differential", function (ctx) {
    const n = getSquareParameter(ctx);
    var op = "\\mathrm{d}";
    if ((n && !isDigit.test(n)) || n > 1) {
        op += "^{" + n + "}";
    }
    if (ctx.future().text !== "{") {
        return op;
    }
    try {
        const ch = ctx.popToken();
        return "\\mathop{}\\!" + op + "{" + ch + "}";
    } catch (e) {
        return op;
    }
});
katex.__defineMacro("\\dd", "\\differential");
katex.__defineMacro("\\derivative", function (ctx) {
    const n = getSquareParameter(ctx);
    const fn = ctx.popToken();
    while (ctx.future().text === " ") {
        ctx.popToken();
    }
    if (ctx.future().text !== "{") {
        return "\\frac{\\dd^{" + n + "}}{" + ddExpr(1, fn) + "^{" + n + "}}";
    }
    var variable;
    try {
        variable = ctx.popToken();
    } catch (e) {}
    return (
        "\\frac{" + ddExpr(n, fn) + "}{" + ddExpr(1, variable) + "^{" + n + "}}"
    );
});
katex.__defineMacro("\\dv", "\\derivative");
katex.__defineMacro("\\partialderivative", function (ctx) {
    const n = getSquareParameter(ctx);
    const fn = ctx.popToken();
    if (n) {
        while (ctx.future().text === " ") {
            ctx.popToken();
        }
        if (ctx.future().text !== "{") {
            return (
                "\\frac{\\pd^{" + n + "}}{" + pdExpr(1, fn) + "^{" + n + "}}"
            );
        }
        var variable;
        try {
            variable = ctx.popToken();
        } catch (e) {}
        return (
            "\\frac{" +
            pdExpr(n, fn) +
            "}{" +
            pdExpr(1, variable) +
            "^{" +
            n +
            "}}"
        );
    }
    const args = [];
    while (true) {
        while (ctx.future().text === " ") {
            ctx.popToken();
        }
        if (ctx.future().text !== "{") {
            break;
        }
        try {
            args.push(ctx.popToken());
        } catch (e) {
            break;
        }
    }
    if (args.length === 0) {
        return "\\frac{\\partial}{" + pdExpr(args.length, fn) + "}";
    }
    return (
        "\\frac{" +
        pdExpr(args.length, fn) +
        "}{" +
        args.map((arg) => pdExpr(1, arg)).join("") +
        "}"
    );
});
katex.__defineMacro("\\pdv", "\\partialderivative");
katex.__defineMacro("\\pd", function (ctx) {
    const n = getSquareParameter(ctx);
    var op = "\\partial";
    if ((n && !isDigit.test(n)) || n > 1) {
        op += "^{" + n + "}";
    }
    if (ctx.future().text !== "{") {
        return op;
    }
    try {
        const ch = ctx.popToken();
        return "\\mathop{}\\!" + op + "{" + ch + "}";
    } catch (e) {
        return op;
    }
});
katex.__defineMacro("\\variation", "\\delta");
katex.__defineMacro("\\var", "\\variation");
katex.__defineMacro(
    "\\functionalderivative",
    "\\frac{\\delta{#1}}{\\delta{#2}}",
);
katex.__defineMacro("\\fdv", "\\functionalderivative");

//
// Dirac bra-ket notation
//
katex.__defineMacro("\\ket", "\\left|{#1}\\right>");
katex.__defineMacro("\\bra", function (ctx) {
    var expr = ["\\left<{" + popNextArg(ctx)];
    while (ctx.future().text === " ") {
        ctx.popToken();
    }
    if (ctx.future().text !== "\\ket") {
        expr.push("}\\right|");
        return expr.join(" ");
    }
    ctx.popToken();
    expr.push("}\\middle|{");
    expr.push(popNextArg(ctx));
    expr.push("}\\right>");
    return expr.join(" ");
});
katex.__defineMacro("\\innerproduct", function (ctx) {
    const a = popNextArg(ctx);
    var expr = ["\\left<{" + a + "}\\middle|{"];
    try {
        expr.push(popNextArg(ctx));
    } catch (e) {
        expr.push(a);
    }
    expr.push("}\\right>");
    return expr.join(" ");
});
katex.__defineMacro("\\braket", "\\innerproduct");
katex.__defineMacro("\\ip", "\\innerproduct");
katex.__defineMacro("\\outerproduct", function (ctx) {
    const a = popNextArg(ctx);
    var expr = ["\\left|{" + a + "}\\middle>\\middle<{"];
    try {
        expr.push(popNextArg(ctx));
    } catch (e) {
        expr.push(a);
    }
    expr.push("}\\right|");
    return expr.join(" ");
});
katex.__defineMacro("\\dyad", "\\outerproduct");
katex.__defineMacro("\\ketbra", "\\outerproduct");
katex.__defineMacro("\\op", "\\outerproduct");
katex.__defineMacro("\\expectationvalue", function (ctx) {
    const a = popNextArg(ctx);
    while (ctx.future().text === " ") {
        ctx.popToken();
    }
    if (ctx.future().text !== "{") {
        return "\\left<{" + a + "}\\right>";
    }
    const b = popNextArg(ctx);
    return "\\left<{" + b + "}\\middle|{" + a + "}\\middle|{" + b + "}\\right>";
});
katex.__defineMacro("\\expval", "\\expectationvalue");
katex.__defineMacro("\\ev", "\\expectationvalue");
katex.__defineMacro("\\matrixelement", function (ctx) {
    const [a, b, c] = ctx.consumeArgs(3).map((arg) =>
        arg
            .reverse()
            .map((t) => t.text)
            .join(""),
    );
    return "\\left<{" + a + "}\\middle|{" + b + "}\\middle|{" + c + "}\\right>";
});
katex.__defineMacro("\\matrixel", "\\matrixelement");
katex.__defineMacro("\\mel", "\\matrixelement");

//
// Matrix macros
//
katex.__defineMacro("\\matrixquantity", function (ctx) {
    const start = ctx.popToken().text;
    const end = braces[start];
    if (typeof end === "undefined") {
        throw new Error("Expecting opening delimiters after \\qty");
    }
    var expr = ["\\left"];
    expr.push(start === "{" ? "\\{" : start);
    expr.push("\\begin{matrix}");
    var opened = 0;
    while (true) {
        const next = ctx.popToken().text;
        if (next === "EOF") {
            throw new Error(
                "Expecting closing delimiters " + end + " after \\mqty",
            );
        } else if (next !== end) {
            expr.push(next);
            if (next === start) {
                ++opened;
            }
        } else if (opened > 0) {
            expr.push(next);
            --opened;
        } else {
            expr.push("\\end{matrix}\\right");
            expr.push(end === "}" ? "\\}" : next);
            break;
        }
    }
    return expr.join(" ");
});
katex.__defineMacro("\\mqty", "\\matrixquantity");
katex.__defineMacro(
    "\\smallmatrixquantity",
    "\\begin{smallmatrix}#1\\end{smallmatrix}",
);
katex.__defineMacro("\\smqty", "\\smallmatrixquantity");
katex.__defineMacro(
    "\\matrixdeterminant",
    "\\left|\\begin{matrix}#1\\end{matrix}\\right|",
);
katex.__defineMacro("\\mdet", "\\matrixdeterminant");
katex.__defineMacro("\\identitymatrix", function (ctx) {
    const n = parseInt(ctx.popToken());
    if (isNaN(n)) {
        throw new Error("Expecting integers as the parameter of \\imat");
    }
    return "\\dmat[0]{" + new Array(n).fill(1).join(",") + "}";
});
katex.__defineMacro("\\imat", "\\identitymatrix");
katex.__defineMacro("\\xmatrix", function (ctx) {
    const lbl = isAlt(ctx);
    const [x, n, m] = [
        ctx.popToken(),
        parseInt(ctx.popToken()),
        parseInt(ctx.popToken()),
    ];
    if (isNaN(n) || isNaN(m)) {
        throw new Error(
            "Expecting integers as the second and third parameter of \\xmat",
        );
    }
    if (!lbl || (n === 1 && m === 1)) {
        return new Array(n).fill(new Array(m).fill(x).join("&")).join("\\\\");
    }
    const mat = [];
    for (var i = 1; i <= n; i++) {
        const row = [];
        for (var j = 1; j <= m; ++j) {
            var label = "" + (n > 1 ? i : "") + (m > 1 ? j : "");
            row.push(x + "_{" + label + "}");
        }
        mat.push(row);
    }
    return (
        "\\begin{matrix}" +
        mat.map((row) => row.join(",")).join("\\\\") +
        "\\end{matrix}"
    );
});
katex.__defineMacro("\\xmat", "\\xmatrix");
katex.__defineMacro("\\zeromatrix", function (ctx) {
    const n = ctx.popToken();
    const m = ctx.popToken();
    const row = "0&".repeat(m - 1) + "0";
    return (
        "\\begin{matrix}" + (row + "\\\\").repeat(n - 1) + row + "\\end{matrix}"
    );
});
katex.__defineMacro("\\zmat", "\\zeromatrix");
katex.__defineMacro("\\paulimatrix", function (ctx) {
    const n = ctx.consumeArg().tokens[0].text;
    var mat = "";
    switch (n) {
        case "0":
            mat = " 1 & 0\\\\ 0 & 1";
            break;
        case "1":
        case "x":
            mat = " 0 & 1\\\\ 1 & 0";
            break;
        case "2":
        case "y":
            mat = " 0 & -i\\\\ i & 0";
            break;
        case "3":
        case "z":
            mat = " 1 & 0\\\\ 0 & -1";
            break;
        default:
            throw new Error(
                "Invalid parameter for \\pmat. Expecting 0, 1, 2, 3, x, y, or z",
            );
    }
    return "\\begin{matrix}" + mat + "\\end{matrix}";
});
katex.__defineMacro("\\pmat", "\\paulimatrix");
katex.__defineMacro("\\diagonalmatrix", function (ctx) {
    const fill = getSquareParameter(ctx);
    const el = popNextArg(ctx).split(",");
    const lines = [];
    for (var i = 0; i < el.length; i++) {
        var line = new Array(el.length).fill(fill);
        line[i] = expandElem(el[i]);
        lines.push(line.map((el) => "{" + el + "}").join("&"));
    }
    return "\\begin{matrix}" + lines.join("\\\\") + "\\end{matrix}";
});
katex.__defineMacro("\\dmat", "\\diagonalmatrix");
katex.__defineMacro("\\antidiagonalmatrix", function (ctx) {
    const fill = getSquareParameter(ctx);
    const el = popNextArg(ctx).split(",");
    const lines = [];
    for (var i = 0; i < el.length; i++) {
        var line = new Array(el.length).fill(fill);
        line[el.length - i - 1] = expandElem(el[i]);
        lines.push(line.map((el) => "{" + el + "}").join("&"));
    }
    return "\\begin{matrix}" + lines.join("\\\\") + "\\end{matrix}";
});
katex.__defineMacro("\\admat", "\\antidiagonalmatrix");

/*************************************************************
 * Helper functions and constants
 */
const braces = {
    "(": ")",
    "[": "]",
    "{": "}",
    "\\{": "\\}",
    "|": "|",
};

const evalBraces = {
    "(": "|",
    "[": "|",
    "{": "}",
};

const bracesSize = {
    "\\bigl": "\\bigr",
    "\\Bigl": "\\Bigr",
    "\\biggl": "\\biggr",
    "\\Biggl": "\\Biggr",
};

const isDigit = /^\d+$/;
const ddExpr = (n, f) => "\\dd[" + n + "]{" + f + "}";
const pdExpr = (n, f) => "\\pd[" + n + "]{" + f + "}";

function popNextArg(ctx) {
    return ctx
        .consumeArgs(1)[0]
        .reverse()
        .map((t) => t.text)
        .join("");
}

function getSquareParameter(ctx) {
    while (ctx.future().text === " ") {
        ctx.popToken();
    }
    var param = "";
    if (ctx.future().text === "[") {
        ctx.popToken();
        while (true) {
            const ch = ctx.popToken().text;
            if (ch === "]") {
                break;
            } else if (ch === "EOF") {
                throw new Error("Expecting ]");
            }
            param += ch;
        }
    }
    return param;
}

function isAlt(ctx) {
    while (ctx.future().text === " ") {
        ctx.popToken();
    }
    if (ctx.future().text === "*") {
        ctx.popToken();
        return true;
    }
    return false;
}

// Recursively expand nested matrices
function expandElem(el) {
    if (el.includes("&") || el.includes("\\\\")) {
        return (
            "\\begin{matrix}" +
            el
                .split("\\\\")
                .map((row) => row.split("&").map(expandElem).join("&"))
                .join("\\\\") +
            "\\end{matrix}"
        );
    }
    return el.replace(/\s+/g, "");
}
