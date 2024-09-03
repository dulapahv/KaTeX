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
katex.__defineMacro("\\quantity", function (ctx) {
    var start = ctx.popToken().text;
    var lBraces = "";
    switch (start) {
        case "\\big":
            lBraces = "\\bigl";
            break;
        case "\\Big":
            lBraces = "\\Bigl";
            break;
        case "\\bigg":
            lBraces = "\\biggl";
            break;
        case "\\Bigg":
            lBraces = "\\Biggl";
            break;
        default:
            if (start.startsWith("\\")) {
                throw new Error("Invalid size specifier: " + start);
            }
            break;
    }
    const rBraces = bracesSize[lBraces];
    start = lBraces ? ctx.popToken().text : start;
    const end = braces[start] || braces[defaultDelim];
    if (typeof end === "undefined") {
        throw new Error("Expecting opening delimiters after the command");
    }
    const expr = [lBraces || "\\left"];
    expr.push(start === "{" ? "\\{" : start);
    var opened = 0;
    while (true) {
        const next = ctx.popToken().text;
        if (next === "EOF") {
            throw new Error("Expecting closing delimiters " + end);
        } else if (next !== end) {
            expr.push(next);
            if (next === start) {
                ++opened;
            }
        } else if (opened > 0) {
            expr.push(next);
            --opened;
        } else {
            expr.push(rBraces || "\\right");
            expr.push(end === "}" ? "\\}" : next);
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
});
katex.__defineMacro("\\abs", "\\absolutevalue");
katex.__defineMacro("\\norm", function (ctx) {
    return isAlt(ctx) ? "\\|{#1}\\|" : "\\left\\Vert{#1}\\right\\Vert";
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
katex.__defineMacro("\\trace", "\\operatorname{tr}"); // In addition to MathJax
katex.__defineMacro("\\tr", "\\trace");
katex.__defineMacro("\\Trace", "\\operatorname{Tr}"); // In addition to MathJax
katex.__defineMacro("\\Tr", "\\Trace");
katex.__defineMacro("\\rank", "\\operatorname{rank}");
katex.__defineMacro("\\erf", "\\operatorname{erf}");
katex.__defineMacro("\\Res", "\\operatorname{Res}");
katex.__defineMacro("\\principalvalue", "\\mathcal{P}");
katex.__defineMacro("\\pv", "\\principalvalue");
katex.__defineMacro("\\PV", "\\operatorname{P.V.}");
katex.__defineMacro("\\Re", "\\operatorname{Re}\\left\\{#1\\right\\}");
// katex.__defineMacro("\\Im", "\\operatorname{Im}\\left\\{#1\\right\\}");

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
katex.__defineMacro("\\qcc", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{c.c.}\\quad";
});
katex.__defineMacro("\\qif", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{if}\\quad";
});
katex.__defineMacro("\\qthen", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{then}\\quad";
});
katex.__defineMacro("\\qelse", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{else}\\quad";
});
katex.__defineMacro("\\qotherwise", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{otherwise}\\quad";
});
katex.__defineMacro("\\qunless", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{unless}\\quad";
});
katex.__defineMacro("\\qgiven", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{given}\\quad";
});
katex.__defineMacro("\\qusing", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{using}\\quad";
});
katex.__defineMacro("\\qassume", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{assume}\\quad";
});
katex.__defineMacro("\\qsince", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{since}\\quad";
});
katex.__defineMacro("\\qlet", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{let}\\quad";
});
katex.__defineMacro("\\qfor", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{for}\\quad";
});
katex.__defineMacro("\\qall", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{all}\\quad";
});
katex.__defineMacro("\\qeven", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{even}\\quad";
});
katex.__defineMacro("\\qodd", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{odd}\\quad";
});
katex.__defineMacro("\\qinteger", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{integer}\\quad";
});
katex.__defineMacro("\\qand", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{and}\\quad";
});
katex.__defineMacro("\\qor", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{or}\\quad";
});
katex.__defineMacro("\\qas", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{as}\\quad";
});
katex.__defineMacro("\\qin", function (ctx) {
    return (isAlt(ctx) ? "" : "\\quad") + "\\text{in}\\quad";
});

//
// Derivatives
//
katex.__defineMacro("\\differential", function (ctx) {
    const n = getSqureParameter(ctx);
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
    const n = getSqureParameter(ctx);
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
    const n = getSqureParameter(ctx);
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
    const n = getSqureParameter(ctx);
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
    let expr = ["\\left<{" + popNextArg(ctx)];
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
katex.__defineMacro("\\ip", "\\innerproduct"); // In addition to MathJax
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
    console.log(expr.join(" "));
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
    for (var i = 1; i <= n; ++i) {
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
    const body = ctx.popToken();
    const mat = {
        0: "1&0\\\\0&1",
        1: "0&1\\\\1&0",
        x: "0&1\\\\1&0",
        2: "0&-i\\\\i&0",
        y: "0&-i\\\\i&0",
        3: "1&0\\\\0&-1",
        z: "1&0\\\\0&-1",
    };
    if (mat[body]) {
        return "\\begin{pmatrix}" + mat[body] + "\\end{pmatrix}";
    } else {
        throw new Error(
            "Invalid parameter for \\pmat. Expecting 0, 1, 2, 3, x, y, or z",
        );
    }
});
katex.__defineMacro("\\pmat", "\\paulimatrix");
katex.__defineMacro("\\diagonalmatrix", function (ctx) {
    const fill = getSqureParameter(ctx);
    const el = ctx.popToken().split(",");
    const lines = [];
    for (var i = 0; i < el.length; ++i) {
        var line = new Array(el.length).fill(fill);
        line[i] = el[i];
        lines.push(line.map((el) => "{" + el + "}").join("&"));
    }
    return "\\begin{matrix}" + lines.join("\\\\") + "\\end{matrix}";
});
katex.__defineMacro("\\dmat", "\\diagonalmatrix");
katex.__defineMacro("\\antidiagonalmatrix", function (ctx) {
    const fill = getSqureParameter(ctx);
    const el = ctx.popToken().split(",");
    const lines = [];
    for (var i = 0; i < el.length; ++i) {
        var line = new Array(el.length).fill(fill);
        line[el.length - i - 1] = el[i];
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

function getSqureParameter(ctx) {
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
