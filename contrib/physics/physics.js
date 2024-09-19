/*************************************************************
 *
 *  KaTeX physics.js
 *
 *  This file implements a KaTeX version of physics version 1.3.
 *  https://ctan.org/pkg/physics
 *
 *  Some of the implementation is adapted from the following sources:
 *   - https://github.com/balthild/katex-physics
 *   - https://github.com/mathjax/MathJax-third-party-extensions/tree/master/legacy/physics
 *   - https://github.com/mathjax/MathJax-src
 *
 *  This code, as other KaTeX code, is released under the MIT license.
 *
 *  ----------------------------------------------------------
 *
 *  Copyright (c) 2011-2024 The MathJax Consortium
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

import katex from "katex";

/*************************************************************
 * Add physics macros to KaTeX from the physics package section 2
 */

/******************
 * 2.1 Automatic bracing
 */
katex.__defineMacro("\\quantity", function(ctx) {
    let size = "";
    if (sizes.includes(ctx.future().text)) {size = ctx.popToken().text;}
    const start = ctx.future().text;
    const end = braces[start];
    if (typeof end === "undefined") {
        return "\\left(" + getBody(ctx, "(", ")", size, false) + "\\right)";
    }
    ctx.popToken();
    return getBody(ctx, start, end, size);
});
katex.__defineMacro("\\qty", "\\quantity");
katex.__defineMacro("\\pqty", "\\qty(#1)");
katex.__defineMacro("\\bqty", "\\qty[#1]");
katex.__defineMacro("\\vqty", "\\qty|#1|");
katex.__defineMacro("\\Bqty", "\\qty{#1}");
katex.__defineMacro("\\absolutevalue", function(ctx) {
    let size = "";
    if (isAlt(ctx)) {skipToDelim(ctx, "{");} else {
        if (sizes.includes(ctx.future().text)) {size = ctx.popToken().text;}
        skipToDelim(ctx, "{");
    }
    return (
        "\\qty" + size + "|" + getBody(ctx, "{", "}", undefined, false) + "|"
    );
});
katex.__defineMacro("\\abs", "\\absolutevalue");
katex.__defineMacro("\\norm", function(ctx) {
    const alt = isAlt(ctx);
    let size = "";
    if (alt) {skipToDelim(ctx, "{");} else {
        if (sizes.includes(ctx.future().text)) {size = ctx.popToken().text;}
        skipToDelim(ctx, "{");
    }
    const a = getBody(ctx, "{", "}", undefined, false);
    return alt
        ? "\\left\\Vert{" + a + "}\\right\\Vert"
        : size
          ? size + "l\\Vert{" + a + "}" + size + "r\\Vert"
          : "\\left\\Vert{" + a + "}\\right\\Vert";
});
katex.__defineMacro("\\evaluated", function(ctx) {
    const alt = isAlt(ctx);
    const start = ctx.popToken().text;
    const end = evalBraces[start];
    if (typeof end === "undefined") {
        throw new Error("Expecting opening delimiters after macro");
    }
    let expr = "\\left" + (start === "{" ? "." : start);
    if (alt) {expr += "\\smash{";}
    let opened = 0;
    for (;;) {
        const next = ctx.popToken().text;
        if (next === "EOF") {
            throw new Error("Expecting " + end + " after macro");
        } else if (next !== end) {
            expr += next;
            if (next === start) {opened++;}
        } else if (end === "}" && opened > 0) {
            expr += next;
            opened--;
        } else {
            if (alt) {expr += "}";}
            expr += "\\vphantom{\\int}\\right|";
            break;
        }
    }
    return expr;
});
katex.__defineMacro("\\eval", "\\evaluated");
katex.__defineMacro("\\order", function(ctx) {
    const alt = isAlt(ctx);
    let size = "";
    if (alt) {skipToDelim(ctx, "{");} else {
        if (sizes.includes(ctx.future().text)) {size = ctx.popToken().text;}
        skipToDelim(ctx, "{");
    }
    const a = getBody(ctx, "{", "}", undefined, false);
    return alt
        ? "\\mathcal{O}(" + a + ")"
        : "\\mathcal{O}\\qty" + size + "(" + a + ")";
});
katex.__defineMacro("\\commutator", function(ctx) {
    const alt = isAlt(ctx);
    let size = "";
    if (alt) {skipToDelim(ctx, "{");} else {
        if (sizes.includes(ctx.future().text)) {size = ctx.popToken().text;}
        skipToDelim(ctx, "{");
    }
    const a = getBody(ctx, "{", "}", undefined, false);
    ctx.popToken();
    const b = getBody(ctx, "{", "}", undefined, false);
    return alt
        ? "[" + a + "," + b + "]"
        : size
          ? size + "l[" + a + "," + b + size + "r]"
          : "\\left[" + a + "," + b + "\\right]";
});
katex.__defineMacro("\\comm", "\\commutator");
katex.__defineMacro("\\anticommutator", function(ctx) {
    const alt = isAlt(ctx);
    let size = "";
    if (alt) {skipToDelim(ctx, "{");} else {
        if (sizes.includes(ctx.future().text)) {size = ctx.popToken().text;}
        skipToDelim(ctx, "{");
    }
    const a = getBody(ctx, "{", "}", undefined, false);
    ctx.popToken();
    const b = getBody(ctx, "{", "}", undefined, false);
    return alt
        ? "{" + a + "," + b + "}"
        : size
          ? size + "l\\{" + a + "," + b + size + "r\\}"
          : "\\left\\{" + a + "," + b + "\\right\\}";
});
katex.__defineMacro("\\acomm", "\\anticommutator");
katex.__defineMacro("\\poissonbracket", "\\anticommutator");
katex.__defineMacro("\\pb", "\\anticommutator");

/******************
 * 2.2 Vector notation
 */
katex.__defineMacro("\\vectorbold", function(ctx) {
    return isAlt(ctx) ? "\\boldsymbol{#1}" : "\\mathbf{#1}";
});
katex.__defineMacro("\\vb", "\\vectorbold");
katex.__defineMacro("\\vectorarrow", function(ctx) {
    return isAlt(ctx) ? "\\boldsymbol{\\vec{#1}}" : "\\mathbf{\\vec{#1}}";
});
katex.__defineMacro("\\va", "\\vectorarrow");
katex.__defineMacro("\\vectorunit", function(ctx) {
    return isAlt(ctx) ? "\\boldsymbol{\\hat{#1}}" : "\\mathbf{\\hat{#1}}";
});
katex.__defineMacro("\\vu", "\\vectorunit");
katex.__defineMacro("\\dotproduct", "\\boldsymbol\\cdot");
katex.__defineMacro("\\vdot", "\\dotproduct");
katex.__defineMacro("\\crossproduct", "\\boldsymbol\\times");
katex.__defineMacro("\\cross", "\\crossproduct");
katex.__defineMacro("\\cp", "\\crossproduct");
katex.__defineMacro("\\gradient", function(ctx) {
    const start = ctx.future().text;
    const end = braces[start];
    if (start === "{" || typeof end === "undefined") {return "\\boldsymbol\\nabla";}
    ctx.popToken();
    return "\\boldsymbol\\nabla\\negmedspace" + getBody(ctx, start, end);
});
katex.__defineMacro("\\grad", "\\gradient");
katex.__defineMacro("\\divergence", function(ctx) {
    const start = ctx.future().text;
    const end = braces[start];
    if (start === "{" || typeof end === "undefined") {
        return "\\boldsymbol\\nabla\\vdot";
    }
    ctx.popToken();
    return "\\boldsymbol\\nabla\\vdot\\negmedspace" + getBody(ctx, start, end);
});
katex.__defineMacro("\\div", "\\divergence"); // old \div renamed to \divide
katex.__defineMacro("\\divide", "\u00f7");
katex.__defineMacro("\\curl", function(ctx) {
    const start = ctx.future().text;
    const end = braces[start];
    if (start === "{" || typeof end === "undefined") {
        return "\\boldsymbol\\nabla\\times";
    }
    ctx.popToken();
    return "\\boldsymbol\\nabla\\times\\negmedspace" + getBody(ctx, start, end);
});
katex.__defineMacro("\\laplacian", function(ctx) {
    const start = ctx.future().text;
    const end = braces[start];
    if (start === "{" || typeof end === "undefined") {
        return "\\boldsymbol\\nabla^2";
    }
    ctx.popToken();
    return "\\boldsymbol\\nabla^2\\negmedspace" + getBody(ctx, start, end);
});

/******************
 * 2.3 Operators
 */
const ops = [
    "\\sin",
    "\\cos",
    "\\tan",
    "\\csc",
    "\\sec",
    "\\cot",
    "\\sinh",
    "\\cosh",
    "\\tanh",
    "\\csch",
    "\\sech",
    "\\coth",
    "\\arcsin",
    "\\arccos",
    "\\arctan",
    "\\arccsc",
    "\\arcsec",
    "\\arccot",
    "\\asin",
    "\\acos",
    "\\atan",
    "\\acsc",
    "\\asec",
    "\\acot",
    "\\exp",
    "\\log",
    "\\ln",
    "\\det",
    "\\Pr",
    "\\exp",
    "\\log",
    "\\ln",
    "\\det",
    "\\Pr",
];

ops.forEach((op) => {
    katex.__defineMacro(op, function(ctx) {
        const n = getSquareParameter(ctx);
        const start = ctx.future().text;
        const end = braces[start];
        if (start !== "(" || typeof end === "undefined") {
            return (
                "\\operatorname{" +
                op.substring(1) +
                "}" +
                (n ? "^{" + n + "}" : "")
            );
        }
        ctx.popToken();
        return (
            "\\operatorname{" +
            op.substring(1) +
            "}" +
            (n ? "^{" + n + "}" : "") +
            "\\negmedspace" +
            getBody(ctx, start, end)
        );
    });
});

katex.__defineMacro("\\sine", "\\operatorname{sin}");
katex.__defineMacro("\\cosine", "\\operatorname{cos}");
katex.__defineMacro("\\tangent", "\\operatorname{tan}");
katex.__defineMacro("\\cosecant", "\\operatorname{csc}");
katex.__defineMacro("\\secant", "\\operatorname{sec}");
katex.__defineMacro("\\cotangent", "\\operatorname{cot}");
katex.__defineMacro("\\hypsine", "\\operatorname{sinh}");
katex.__defineMacro("\\hypcosine", "\\operatorname{cosh}");
katex.__defineMacro("\\hyptangent", "\\operatorname{tanh}");
katex.__defineMacro("\\hypcosecant", "\\operatorname{csch}");
katex.__defineMacro("\\hypsecant", "\\operatorname{sech}");
katex.__defineMacro("\\hypcotangent", "\\operatorname{coth}");
katex.__defineMacro("\\arcsine", "\\operatorname{arcsin}");
katex.__defineMacro("\\arccosine", "\\operatorname{arccos}");
katex.__defineMacro("\\arctangent", "\\operatorname{arctan}");
katex.__defineMacro("\\arccosecant", "\\operatorname{arccsc}");
katex.__defineMacro("\\arcsecant", "\\operatorname{arcsec}");
katex.__defineMacro("\\arccotangent", "\\operatorname{arccot}");
katex.__defineMacro("\\asine", "\\operatorname{asin}");
katex.__defineMacro("\\acosine", "\\operatorname{acos}");
katex.__defineMacro("\\atangent", "\\operatorname{atan}");
katex.__defineMacro("\\acosecant", "\\operatorname{acsc}");
katex.__defineMacro("\\asecant", "\\operatorname{asec}");
katex.__defineMacro("\\acotangent", "\\operatorname{acot}");
katex.__defineMacro("\\exponential", "\\operatorname{exp}");
katex.__defineMacro("\\logarithm", "\\operatorname{log}");
katex.__defineMacro("\\naturallogarithm", "\\operatorname{ln}");
katex.__defineMacro("\\determinant", "\\operatorname{det}");
katex.__defineMacro("\\Probability", "\\operatorname{Pr}");
katex.__defineMacro("\\trace", function(ctx) {
    const start = ctx.future().text;
    const end = braces[start];
    if (start !== "(" || typeof end === "undefined") {return "\\operatorname{tr}";}
    ctx.popToken();
    return "\\operatorname{tr}\\negmedspace" + getBody(ctx, start, end);
});
katex.__defineMacro("\\tr", "\\trace");
katex.__defineMacro("\\Trace", function(ctx) {
    const start = ctx.future().text;
    const end = braces[start];
    if (start !== "(" || typeof end === "undefined") {return "\\operatorname{Tr}";}
    ctx.popToken();
    return "\\operatorname{Tr}\\negmedspace" + getBody(ctx, start, end);
});
katex.__defineMacro("\\Tr", "\\Trace");
katex.__defineMacro("\\rank", "\\operatorname{rank}");
katex.__defineMacro("\\erf", function(ctx) {
    const start = ctx.future().text;
    const end = braces[start];
    if (start !== "(" || typeof end === "undefined") {return "\\operatorname{erf}";}
    ctx.popToken();
    return "\\operatorname{erf}\\negmedspace" + getBody(ctx, start, end);
});
katex.__defineMacro("\\Res", function(ctx) {
    const start = ctx.future().text;
    const end = braces[start];
    if (typeof end === "undefined") {return "\\operatorname{Res}";}
    ctx.popToken();
    return "\\operatorname{Res}\\negmedspace" + getBody(ctx, start, end);
});
katex.__defineMacro("\\principalvalue", "\\mathcal{P}");
katex.__defineMacro("\\pv", "\\principalvalue");
katex.__defineMacro("\\PV", "\\operatorname{P.V.}");
katex.__defineMacro(
    "\\Re",
    "\\operatorname{Re}\\left\\{#1\\right\\}"
); // old \Re renamed to \real
katex.__defineMacro("\\real", "\u211c");
katex.__defineMacro(
    "\\Im",
    "\\operatorname{Im}\\left\\{#1\\right\\}"
); // old \Im renamed to \imaginary
katex.__defineMacro("\\imaginary", "\u2111");

/******************
 * 2.4 Quick quad text
 */
katex.__defineMacro("\\qqtext", function(ctx) {
    return (
        (isAlt(ctx) ? "" : "\\quad") + "\\text{" + popNextArg(ctx) + "}\\quad"
    );
});
katex.__defineMacro("\\qq", "\\qqtext");
katex.__defineMacro("\\qcomma", ",\\quad");
katex.__defineMacro("\\qc", "\\qcomma");
katex.__defineMacro("\\qcc", "\\quad\\text{c.c.}\\quad");

const qMacros = [
    "\\qif",
    "\\qthen",
    "\\qelse",
    "\\qotherwise",
    "\\qunless",
    "\\qgiven",
    "\\qusing",
    "\\qassume",
    "\\qsince",
    "\\qlet",
    "\\qfor",
    "\\qall",
    "\\qeven",
    "\\qodd",
    "\\qinteger",
    "\\qand",
    "\\qor",
    "\\qas",
    "\\qin",
];

qMacros.forEach((name) => {
    katex.__defineMacro(name, function(ctx) {
        return (
            (isAlt(ctx) ? "" : "\\quad") +
            "\\text{" +
            name.substring(2) +
            "}\\quad"
        );
    });
});

/******************
 * 2.5 Derivatives
 */
katex.__defineMacro("\\differential", function(ctx) {
    const n = getSquareParameter(ctx);
    let op = "\\mathrm{d}";
    if ((n && !isDigit.test(n)) || n > 1) {op += "^{" + n + "}";}
    if (ctx.future().text !== "{") {return op;}
    try {
        const ch = popNextArg(ctx);
        return "\\mathop{}\\!" + op + "{" + ch + "}";
    } catch (e) {
        return op;
    }
});
katex.__defineMacro("\\dd", "\\differential");
katex.__defineMacro("\\derivative", function(ctx) {
    const alt = isAlt(ctx);
    const n = getSquareParameter(ctx);
    const fn = popNextArg(ctx);
    let expr;
    while (ctx.future().text === " ") {ctx.popToken();}
    if (ctx.future().text !== "{") {
        alt
            ? (expr = "\\dd^{" + n + "}/" + dd(1, fn) + "^{" + n + "}")
            : (expr =
                  "\\frac{\\dd^{" + n + "}}{" + dd(1, fn) + "^{" + n + "}}");
    } else {
        let variable;
        try {
            variable = popNextArg(ctx);
        } catch (e) {
            throw new Error("Expecting a variable after macro");
        }
        alt
            ? (expr = dd(n, fn) + "/" + dd(1, variable) + "^{" + n + "}")
            : (expr =
                  "\\frac{" +
                  dd(n, fn) +
                  "}{" +
                  dd(1, variable) +
                  "^{" +
                  n +
                  "}}");
    }
    if (ctx.future().text === "(") {
        ctx.popToken();
        return expr + "\\negmedspace" + getBody(ctx, "(", ")");
    }
    return expr;
});
katex.__defineMacro("\\dv", "\\derivative");
katex.__defineMacro("\\partialderivative", function(ctx) {
    const alt = isAlt(ctx);
    const n = getSquareParameter(ctx);
    const fn = popNextArg(ctx);
    let expr;
    if (n) {
        while (ctx.future().text === " ") {ctx.popToken();}
        if (ctx.future().text !== "{") {
            expr = alt
                ? "\\pd^{" + n + "}/" + pd(1, fn) + "^{" + n + "}"
                : "\\frac{\\pd^{" + n + "}}{" + pd(1, fn) + "^{" + n + "}}";
        } else {
            const variable = popNextArg(ctx);
            expr = alt
                ? pd(n, fn) + "/" + pd(1, variable) + "^{" + n + "}"
                : "\\frac{" +
                  pd(n, fn) +
                  "}{" +
                  pd(1, variable) +
                  "^{" +
                  n +
                  "}}";
        }
    } else {
        let args = "";
        let argsCount = 0;
        for (;;) {
            while (ctx.future().text === " ") {ctx.popToken();}
            if (ctx.future().text !== "{") {break;}
            try {
                args += pd(1, popNextArg(ctx));
                argsCount++;
            } catch (e) {
                break;
            }
        }
        if (argsCount === 0) {
            expr = alt
                ? "\\partial/" + pd(argsCount, fn)
                : "\\frac{\\partial}{" + pd(argsCount, fn) + "}";
        } else {
            expr = alt
                ? pd(argsCount, fn) + "/" + args
                : "\\frac{" + pd(argsCount, fn) + "}{" + args + "}";
        }
    }
    if (ctx.future().text === "(") {
        ctx.popToken();
        return expr + "\\negmedspace" + getBody(ctx, "(", ")");
    }
    return expr;
});
katex.__defineMacro("\\pderivative", "\\partialderivative");
katex.__defineMacro("\\pdv", "\\partialderivative");
katex.__defineMacro("\\pd", function(ctx) {
    const n = getSquareParameter(ctx);
    let op = "\\partial";
    if ((n && !isDigit.test(n)) || n > 1) {op += "^{" + n + "}";}
    if (ctx.future().text !== "{") {return op;}
    try {
        const ch = popNextArg(ctx);
        return "\\mathop{}\\!" + op + "{" + ch + "}";
    } catch (e) {
        return op;
    }
});
katex.__defineMacro("\\variation", "\\delta");
katex.__defineMacro("\\var", "\\variation");
katex.__defineMacro("\\fd", function(ctx) {
    const n = getSquareParameter(ctx);
    let op = "\\delta";
    if ((n && !isDigit.test(n)) || n > 1) {op += "^{" + n + "}";}
    if (ctx.future().text !== "{") {return op;}
    try {
        const ch = popNextArg(ctx);
        return "\\mathop{}\\!" + op + "{" + ch + "}";
    } catch (e) {
        return op;
    }
});
katex.__defineMacro("\\functionalderivative", function(ctx) {
    const alt = isAlt(ctx);
    const n = getSquareParameter(ctx);
    const fn = popNextArg(ctx);
    let expr;
    while (ctx.future().text === " ") {ctx.popToken();}
    if (ctx.future().text !== "{") {
        expr = alt
            ? "\\delta^{" + n + "}/" + fdv(1, fn) + "^{" + n + "}"
            : "\\frac{\\delta^{" + n + "}}{" + fdv(1, fn) + "^{" + n + "}}";
    } else {
        const variable = popNextArg(ctx);
        expr = alt
            ? fdv(n, fn) + "/" + fdv(1, variable) + "^{" + n + "}"
            : "\\frac{" +
              fdv(n, fn) +
              "}{" +
              fdv(1, variable) +
              "^{" +
              n +
              "}}";
    }
    if (ctx.future().text === "(") {
        ctx.popToken();
        return expr + "\\negmedspace" + getBody(ctx, "(", ")");
    }
    return expr;
});
katex.__defineMacro("\\fdv", "\\functionalderivative");

/******************
 * 2.6 Dirac bra-ket notation
 */
katex.__defineMacro("\\ket", function(ctx) {
    return isAlt(ctx) ? "|#1\\rangle" : "\\left|#1\\right>";
});
katex.__defineMacro("\\bra", function(ctx) {
    let alt = isAlt(ctx);
    const expr = [alt ? "\\langle" : "\\left<"];
    expr.push(`{${popNextArg(ctx)}`);
    while (ctx.future().text === " ") {ctx.popToken();}
    if (ctx.future().text !== "\\ket") {
        expr.push(`}${alt ? "|" : "\\right|"}`);
        return expr.join(" ");
    }
    ctx.popToken();
    if (isAlt(ctx)) {
        alt = true;
        expr[0] = "\\langle";
    }
    expr.push(`}${alt ? "|" : "\\middle|"}{`);
    expr.push(popNextArg(ctx));
    expr.push(`}${alt ? "\\rangle" : "\\right>"}`);
    return expr.join(" ");
});
katex.__defineMacro("\\innerproduct", function(ctx) {
    const alt = isAlt(ctx);
    const a = popNextArg(ctx);
    let expr = alt ? "\\langle{" + a + "}|{" : "\\left<{" + a + "}\\middle|{";
    try {
        expr += popNextArg(ctx);
    } catch (e) {
        expr += a;
    }
    return expr + "}" + (alt ? "\\rangle" : "\\right>");
});
katex.__defineMacro("\\braket", "\\innerproduct");
katex.__defineMacro("\\ip", "\\innerproduct");
katex.__defineMacro("\\outerproduct", function(ctx) {
    const alt = isAlt(ctx);
    const a = popNextArg(ctx);
    let expr = alt
        ? "|{" + a + "}\\rangle\\langle{"
        : "\\left|{" + a + "}\\middle>\\middle<{";
    try {
        expr += popNextArg(ctx);
    } catch (e) {
        expr += a;
    }
    return expr + "}" + (alt ? "|" : "\\right|");
});
katex.__defineMacro("\\dyad", "\\outerproduct");
katex.__defineMacro("\\ketbra", "\\outerproduct");
katex.__defineMacro("\\op", "\\outerproduct");
katex.__defineMacro("\\expectationvalue", function(ctx) {
    const alt1 = isAlt(ctx);
    const alt2 = isAlt(ctx);
    const a = popNextArg(ctx);
    while (ctx.future().text === " ") {ctx.popToken();}
    if (ctx.future().text !== "{") {return "\\left<{" + a + "}\\right>";}
    const b = popNextArg(ctx);
    return genBracket(b, a, b, alt1, alt2);
});
katex.__defineMacro("\\expval", "\\expectationvalue");
katex.__defineMacro("\\ev", "\\expectationvalue");
katex.__defineMacro("\\matrixelement", function(ctx) {
    const alt1 = isAlt(ctx);
    const alt2 = isAlt(ctx);
    const args = ctx.consumeArgs(3);
    const expr = [];
    for (let i = 0; i < args.length; i++) {
        let n = "";
        for (let j = args[i].length - 1; j >= 0; j--) {n += args[i][j].text;}
        expr.push(n);
    }
    const [a, b, c] = expr;
    return genBracket(a, b, c, alt1, alt2);
});
katex.__defineMacro("\\matrixel", "\\matrixelement");
katex.__defineMacro("\\mel", "\\matrixelement");

/******************
 * 2.7 Matrix macros
 */
katex.__defineMacro("\\matrixquantity", function(ctx) {
    const alt = isAlt(ctx);
    const start = ctx.popToken().text;
    const end = braces[start];
    if (typeof end === "undefined") {
        throw new Error("Expecting opening delimiters after macro");
    }
    let expr =
        start === "{"
            ? ""
            : alt && start === "("
              ? "\\left\\lgroup"
              : "\\left" + start;
    expr += "\\begin{matrix}";
    let opened = 0;
    for (;;) {
        const next = ctx.popToken().text;
        if (next === "EOF") {
            throw new Error(
                "Expecting closing delimiters " + end + " after macro",
            );
        } else if (next !== end) {
            expr += next;
            if (next === start) {opened++;}
        } else if (opened > 0) {
            expr += next;
            opened--;
        } else {
            expr += "\\end{matrix}";
            expr +=
                end === "}"
                    ? ""
                    : alt && start === "("
                      ? "\\right\\rgroup"
                      : "\\right" + next;
            break;
        }
    }
    return expr;
});
katex.__defineMacro("\\mqty", "\\matrixquantity");
katex.__defineMacro("\\pmqty", "\\mqty(#1)");
katex.__defineMacro("\\Pmqty", "\\mqty*(#1)");
katex.__defineMacro("\\bmqty", "\\mqty[#1]");
katex.__defineMacro("\\vmqty", "\\mqty|#1|");
katex.__defineMacro("\\smallmatrixquantity", function(ctx) {
    const alt = isAlt(ctx);
    const start = ctx.popToken().text;
    const end = braces[start];
    if (typeof end === "undefined") {
        throw new Error("Expecting opening delimiters after macro");
    }
    let expr =
        start === "{"
            ? ""
            : alt && start === "("
              ? "\\left\\lgroup"
              : "\\left" + start;
    expr += "\\begin{smallmatrix}";
    let opened = 0;
    for (;;) {
        const next = ctx.popToken().text;
        if (next === "EOF") {
            throw new Error(
                "Expecting closing delimiters " + end + " after macro",
            );
        } else if (next !== end) {
            expr += next;
            if (next === start) {opened++;}
        } else if (opened > 0) {
            expr += next;
            opened--;
        } else {
            expr += "\\end{smallmatrix}";
            expr +=
                end === "}"
                    ? ""
                    : alt && start === "("
                      ? "\\right\\rgroup"
                      : "\\right" + next;
            break;
        }
    }
    return expr;
});
katex.__defineMacro("\\smqty", "\\smallmatrixquantity");
katex.__defineMacro("\\spmqty", "\\smqty(#1)");
katex.__defineMacro("\\sPmqty", "\\smqty*(#1)");
katex.__defineMacro("\\sbmqty", "\\smqty[#1]");
katex.__defineMacro("\\svmqty", "\\smqty|#1|");
katex.__defineMacro(
    "\\matrixdeterminant",
    "\\left|\\begin{matrix}#1\\end{matrix}\\right|",
);
katex.__defineMacro("\\mdet", "\\matrixdeterminant");
katex.__defineMacro(
    "\\smdet",
    "\\vert\\begin{smallmatrix}#1\\end{smallmatrix}\\vert"
);
katex.__defineMacro("\\identitymatrix", function(ctx) {
    const n = parseInt(popNextArg(ctx));
    if (isNaN(n)) {
        throw new Error("Expecting integers as the parameter of \\imat");
    }
    return "\\dmat[0]{" + new Array(n).fill(1).join(",") + "}";
});
katex.__defineMacro("\\imat", "\\identitymatrix");
katex.__defineMacro("\\xmatrix", function(ctx) {
    const lbl = isAlt(ctx);
    const [x, n, m] = [
        popNextArg(ctx),
        parseInt(popNextArg(ctx)),
        parseInt(popNextArg(ctx)),
    ];
    if (isNaN(n) || isNaN(m)) {
        throw new Error(
            "Expecting integers as the second and third parameter of \\xmat",
        );
    }
    if (!lbl || (n === 1 && m === 1)) {
        return (
            "\\begin{matrix}" +
            new Array(n).fill(new Array(m).fill(x).join("&")).join("\\\\") +
            "\\end{matrix}"
        );
    }
    const mat = [];
    for (let i = 1; i <= n; ++i) {
        const row = [];
        for (let j = 1; j <= m; ++j) {
            const label = "" + (n > 1 ? i : "") + (m > 1 ? j : "");
            row.push(x + "_{" + label + "}");
        }
        mat.push(row);
    }
    return (
        "\\begin{matrix}" +
        mat.map((row) => row.join("&")).join("\\\\") +
        "\\end{matrix}"
    );
});
katex.__defineMacro("\\xmat", "\\xmatrix");
katex.__defineMacro("\\zeromatrix", function(ctx) {
    const [n, m] = [parseInt(popNextArg(ctx)), parseInt(popNextArg(ctx))];
    if (isNaN(n) || isNaN(m)) {
        throw new Error(
            "Expecting integers as the second and third parameter of \\zmat",
        );
    }
    const row = "0&".repeat(m - 1) + "0";
    return (
        "\\begin{matrix}" + (row + "\\\\").repeat(n - 1) + row + "\\end{matrix}"
    );
});
katex.__defineMacro("\\zmat", "\\zeromatrix");
katex.__defineMacro("\\paulimatrix", function(ctx) {
    const tokens = ctx.consumeArg().tokens;
    let n = "";
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.text !== " ") {
            n = token.text;
            break;
        }
    }
    let mat;
    switch (n) {
        case "0":
            mat = "1&0\\\\0&1";
            break;
        case "1":
        case "x":
            mat = "0&1\\\\1&0";
            break;
        case "2":
        case "y":
            mat = "0&-i\\\\i&0";
            break;
        case "3":
        case "z":
            mat = "1&0\\\\0&-1";
            break;
        default:
            throw new Error(
                "Invalid parameter for \\pmat. Expecting 0, 1, 2, 3, x, y, or z",
            );
    }
    return "\\begin{matrix}" + mat + "\\end{matrix}";
});
katex.__defineMacro("\\pmat", "\\paulimatrix");
katex.__defineMacro("\\diagonalmatrix", function(ctx) {
    const fill = getSquareParameter(ctx);
    const el = popNextArg(ctx).split(",");
    let row = "";
    for (let i = 0; i < el.length; i++) {
        const line = new Array(el.length).fill(fill);
        line[i] = expandElem(el[i]);
        row +=
            line
                .map(function(el) {
                    return "{" + el + "}";
                })
                .join("&") + (i < el.length - 1 ? "\\\\" : "");
    }
    return "\\begin{matrix}" + row + "\\end{matrix}";
});
katex.__defineMacro("\\dmat", "\\diagonalmatrix");
katex.__defineMacro("\\antidiagonalmatrix", function(ctx) {
    const fill = getSquareParameter(ctx);
    const el = popNextArg(ctx).split(",");
    let row = "";
    for (let i = 0; i < el.length; i++) {
        const line = new Array(el.length).fill(fill);
        line[el.length - i - 1] = expandElem(el[i]);
        row +=
            line
                .map(function(el) {
                    return "{" + el + "}";
                })
                .join("&") + (i < el.length - 1 ? "\\\\" : "");
    }
    return "\\begin{matrix}" + row + "\\end{matrix}";
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

const sizes = ["\\big", "\\Big", "\\bigg", "\\Bigg"];

const isDigit = /^\d+$/;
const isSpace = /\s+/g;

// Extracts the body of an expression between specified delimiters.
function getBody(ctx, start, end, size = "", delim = true) {
    let expr = "";
    if (delim) {
        expr += size ? size + "l" : "\\left";
        expr += start === "{" ? "\\{" : start;
    }
    let opened = 0;
    for (;;) {
        const next = ctx.popToken().text;
        if (next === "EOF") {
            if (!delim) {break;}
            throw new Error("Expecting closing delimiters " + end);
        } else if (next !== end) {
            expr += next;
            if (next === start) {opened++;}
        } else if (opened > 0) {
            expr += next;
            opened--;
        } else {
            if (delim) {
                expr += size ? size + "r" : "\\right";
                expr += end === "}" ? "\\}" : next;
            }
            break;
        }
    }
    return expr;
}

// Check if there is * after the macro
function isAlt(ctx) {
    while (ctx.future().text === " ") {ctx.popToken();}
    if (ctx.future().text === "*") {
        ctx.popToken();
        return true;
    }
    return false;
}

// Get the parameter inside [] after the macro
function getSquareParameter(ctx) {
    while (ctx.future().text === " ") {ctx.popToken();}
    let param = "";
    if (ctx.future().text === "[") {
        ctx.popToken();
        for (;;) {
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

// Get the next argument after the macro
function popNextArg(ctx) {
    const arg = ctx.consumeArgs(1)[0];
    let expr = "";
    for (let i = arg.length - 1; i >= 0; i--) {expr += arg[i].text;}
    return expr;
}

// Skip to the next delimiter after the macro
function skipToDelim(ctx, delim) {
    for (;;) {
        const next = ctx.popToken().text;
        if (next === "EOF") {
            throw new Error("Expecting " + delim + " after macro");
        } else if (next === delim) {
            break;
        }
    }
}

// Generate the bracket notation for matrix elements
function genBracket(a, b, c, alt1, alt2) {
    return alt1 && alt2
        ? "\\left\\langle{" +
              a +
              "}\\middle\\vert{" +
              b +
              "}\\middle\\vert{" +
              c +
              "}\\right\\rangle"
        : alt1
          ? "\\langle{" + a + "}|{" + b + "}|{" + c + "}\\rangle"
          : "\\left\\langle{" +
            a +
            "}\\right\\vert{\\!" +
            b +
            "\\!}\\left\\vert{" +
            c +
            "}\\right\\rangle";
}

function dd(n, f) {
    return "\\dd[" + n + "]{" + f + "}";
}

function pd(n, f) {
    return "\\pd[" + n + "]{" + f + "}";
}

function fdv(n, f) {
    return "\\fd[" + n + "]{" + f + "}";
}

// Recursively expand nested matrices
function expandElem(el) {
    if (el.indexOf("&") !== -1 || el.indexOf("\\\\") !== -1) {
        const rows = el.split("\\\\");
        let result = "\\begin{matrix}";
        for (let i = 0; i < rows.length; i++) {
            if (i > 0) {result += "\\\\";}
            const cols = rows[i].split("&");
            for (let j = 0; j < cols.length; j++) {
                if (j > 0) {result += "&";}
                result += expandElem(cols[j]);
            }
        }
        result += "\\end{matrix}";
        return result;
    }
    return el.replace(isSpace, "");
}
