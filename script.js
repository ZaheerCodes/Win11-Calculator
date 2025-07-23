let expTxt = document.querySelector("#exp");
let typeTxt = document.querySelector("#type");
let buttons = document.querySelector("#buttons-panel");
let typeBtns = buttons.querySelectorAll("#digits .type");
let signBtn = buttons.querySelector("#sign-btn");

let backBtn = buttons.querySelector("#backspace-btn");
let clearAllBtn = buttons.querySelector("#clear-all-btn");
let clearEntryBtn = buttons.querySelector("#clear-entry-btn");

let divBtn = buttons.querySelector("#div-btn");
let mulBtn = buttons.querySelector("#mul-btn");
let minBtn = buttons.querySelector("#min-btn");
let plusBtn = buttons.querySelector("#plus-btn");

let percentBtn = buttons.querySelector("#percent-btn");
let reciprocalBtn = buttons.querySelector("#reciprocal-btn");
let squareBtn = buttons.querySelector("#sqr-btn");
let sqRootBtn = buttons.querySelector("#sqrt-btn");

let equalBtn = buttons.querySelector("#equal-btn");

let delHistoryBtn = document.querySelector("#storage-panel #del-history-btn");

const key = Object.freeze({
    Digit: "digit",
    Equal: "equal",
    Operator: "operator",
    Control: "control",
    None: "none"
});

let lastKey = key.None;
let resultState = false;    // true when: equal, unary, or binary operator btn is pressed
                            // false again when: some digit or clear all btn is pressed

/*
    ===================
      HANDLING INPUTS
    ===================
*/

const handleDigitInput = (event = null, str = "") => {

    if (lastKey == key.Equal) {
        handleClearAll();
    }
    let oldTxt = (exp.isBinary? exp.operand2 : exp.operand1).toString();
    if (resultState) {
        oldTxt = "0";
    }
    let newTxt = str;
    if (event != null) {
        newTxt = event.target.innerText;
    }
    let inputLimit = getInputLimit(newTxt, oldTxt);
    let oldTxtHasDac = oldTxt.includes(".");
    let newTxtHasDec = newTxt.includes(".");
    if ((newTxtHasDec && oldTxtHasDac)){
        return;
    }
    if (oldTxt === "0") {
        if (newTxt[0] == ".")
            oldTxt += newTxt;
        else
            oldTxt = newTxt;
    }
    else {
        oldTxt += newTxt;
    }
    if (exp.isBinary)
        exp.operand2 = oldTxt.slice(0,inputLimit);
    else
        exp.operand1 = oldTxt.slice(0,inputLimit);
    resultState = false;
    lastKey = key.Digit;
    handleFieldDisplay(false);
};

const getInputLimit = (newTxt, oldTxt) => {
    let charLimit = 16;
    let oldTxtHasDac = oldTxt.includes(".");
    let newTxtHasDec = newTxt.includes(".");
    if (oldTxtHasDac || newTxtHasDec) {
        charLimit = 17;
    }
    let merge = oldTxt === "0" && newTxt[0] !== ".";
    if ((merge && oldTxt.slice(0,2) === "0.") ||
        !merge && newTxt.slice(0,2) === "0.") {
        charLimit = 18;
    }
    return charLimit;
};

/* 
    =================
      HANDLING KEYS
    =================
*/

const handleKeys = (event) => {

    if ("0123456789.".includes(event.key.toString())) {
        handleDigitInput(null, event.key.toString());
        lastKey = key.Digit;
    }

    else if (event.key == "Backspace") {
        handleBackspace();
        lastKey = key.Control;
    }

    else if (event.key == "Delete") {
        handleClearEntry();
        lastKey = key.Control;
    }

    else if (event.key == "Escape") {
        handleClearAll();
        lastKey = key.Control;
    }

    else if (event.key == "Enter" || event.key == "=") {
        handleEqualBtn();
        lastKey = key.Equal;
    }

    else if (event.key == "+") {
        handleBinaryOp(binOp.Add);
        lastKey = key.Operator;
    }

    else if (event.key == "-") {
        handleBinaryOp(binOp.Subtract);
        lastKey = key.Operator;
    }

    else if (event.key == "*") {
        handleBinaryOp(binOp.Multiply);
        lastKey = key.Operator;
    }

    else if (event.key == "/") {
        handleBinaryOp(binOp.Divide);
        lastKey = key.Operator;
    }

    else if (event.key == "q") {
        handleUnaryOp(unOp.Square);
        lastKey = key.Operator;
    }

    else if (event.key == "r") {
        handleUnaryOp(unOp.Reciprocal);
        lastKey = key.Operator;
    }

    else if (event.key == "@") {
        handleUnaryOp(unOp.SqRoot);
        lastKey = key.Operator;
    }
}

/* 
    ====================
      HANDLING DISPLAY
    ====================
*/

const getTypeTxt = () => {
    return document.querySelector("#type").innerText;
};

const setTypeTxt = (str) => {
    document.querySelector("#type").innerText = str;
};

const getExpTxt = () => {
    return document.querySelector("#exp").innerText;
}

const setExpTxt = (str) => {
    document.querySelector("#exp").innerText = str;
}

const handleFieldDisplay = (equalPressed) => {
    if (exp.operand1 == ""){
        setTypeTxt("0");
        return;
    }

    if (equalPressed) {
        if (exp.isBinary) {
            setTypeTxt(addCommas(performFlatExp(exp)));
        } else {
            setTypeTxt(addCommas(performAllUnaryOps(exp.operand1, exp.unaryOps1)));
        }
    }
    else {
        if (exp.isBinary) {
            if (resultState) {
                if (exp.operand2 == "") {
                    setTypeTxt(addCommas(performAllUnaryOps(exp.operand1, exp.unaryOps1)));
                } else {
                    setTypeTxt(addCommas(performAllUnaryOps(exp.operand2, exp.unaryOps2)));
                }
            } else {
                if (exp.operand2 == "") {
                    setTypeTxt(addCommas(performAllUnaryOps(exp.operand1, exp.unaryOps1)));
                } else {
                    setTypeTxt(addCommas(performAllUnaryOps(exp.operand2, exp.unaryOps2)));
                }
            }
        } else {
            setTypeTxt(addCommas(performAllUnaryOps(exp.operand1, exp.unaryOps1)));
        }    
    }
    adjustResultTxt();
};

const handleExpDisplay = (equalPressed) => {
    if (exp.operand1 == ""){
        setExpTxt("");
        return;
    }
    if (equalPressed) {
        setExpTxt(readFlatExp(exp) + " =");
    }
    else {
        setExpTxt(readFlatExp(exp));
    }
};

const readFlatExp = (exp) => {
    let expStr = "";
    let op1 = exp.operand1;
    let op2 = "";
    for (let i = 0; i < exp.unaryOps1.length; i++) {
        op1 = exp.unaryOps1[i] + "( " + op1 + " )";        
    }
    if (exp.isBinary) {
        op2 = exp.operand2;
        for (let i = 0; i < exp.unaryOps2.length; i++) {
            op2 = exp.unaryOps2[i] + "( " + op2 + " )";        
        }
        op2 = " " + op2;
    }
    expStr += op1 + " " + exp.binaryOp + op2;
    return expStr;
};

const removeCommas = (str) => {
    str = str.toString();
    let result = str;
    if (str.includes(",")) {
        result = "";
        for (let i = 0; i < str.length; i++) {
            if (str[i] != ",")
                result += str[i];
        }
    }
    return result;
};

const addCommas = (str) => {
    str = removeCommas(str);
    let result = "";
    let temp = str;
    let decIdx = -1;
    for (let i = 0; i < str.length; i++) {
        if (str[i] == ".") {
            decIdx = i;
            break;
        }
    }
    if (decIdx != -1)
        temp = str.slice(0,decIdx);
    if (temp.length <= 3)
        return str;
    if (temp[0] == "-")
        temp = temp.slice(1);
    for (let i = 0; i < temp.length; i++) {
        if (i > 0 && (temp.length - i) % 3 == 0) {
            result += ",";
        }
        result += temp[i];
    }
    if (decIdx != -1)
        result += str.slice(decIdx, str.length);
    if (str[0] == "-")
        result = "-" + result; 
    return result;
};

const adjustResultTxt = () => {
    let parent = typeTxt.parentElement;
    let maxFont = 72;
    if(innerHeight < 680)
        maxFont = 48;
    typeTxt.style.fontSize = maxFont + "px";
    while (parseInt(parent.getBoundingClientRect().width) - parseInt(typeTxt.getBoundingClientRect().width) < 24)
    {
        let fontValue = parseInt(getComputedStyle(typeTxt).getPropertyValue("font-size").slice(0,2));
        fontValue -= 1;
        typeTxt.style.fontSize = fontValue + "px";
    }
}

adjustResultTxt();


/* 
    ==========================
      HANDLING CLEAR BUTTONS
    ==========================
*/

const handleBackspace = () => {
    if (!resultState) {
        if (exp.isBinary) {
            exp.operand2 = delLastDigit(exp.operand2);
        }
        else {
            exp.operand1 = delLastDigit(exp.operand1);
        }
        lastKey = key.Control;
        handleFieldDisplay(false);
    }

    function delLastDigit (str) {
        if (str.length > 1) {
            str = str.slice(0, str.length-1);
        }
        else if (str.length = 1) {
            str = "0";
        }
        return str;
    };
};

const handleClearEntry = () => {
    if (exp.isBinary) {
        exp.operand2 = "0";
    }
    else {
        exp.operand1 = "0";
    }
    resultState = true;
    lastKey = key.Control;
    handleFieldDisplay(false);
};

const handleClearAll = () => {
    let clearedExp = {
        isBinary: false,    binaryOp: "",
        operand1: "0",      operand2: "",
        unaryOps1: [],      unaryOps2: []
    };
    exp = clearedExp;
    resultState = false;
    lastKey = key.Control;
    setExpTxt("");
    handleFieldDisplay(false);
}


/* 
    =======================
      HANDLING OPERATIONS
    =======================
*/

let exp = {
    isBinary: false,    binaryOp: "",
    operand1: "0",      operand2: "",
    unaryOps1: [],      unaryOps2: []
};

const binOp = Object.freeze({
    Add: "+",
    Subtract: "-",
    Multiply: "*",
    Divide: "/",
    None: "none"
});

const unOp = Object.freeze({
    Negate: "negate",
    Reciprocal: "1/",
    Square: "sqr",
    SqRoot: "sqrt",
    None: "none"
});

const opType = Object.freeze({
    Unary: "u",
    Binary: "b",
    None: "none"
});

const performFlatExp = (exp) => {
    let result1 = performAllUnaryOps(exp.operand1, exp.unaryOps1);
    let result2 = exp.operand2;
    let total = result1;
    if (exp.isBinary) {
        result2 = performAllUnaryOps(exp.operand2, exp.unaryOps2);
        total = evaluateBinaryOp(result1, result2, exp.binaryOp);
    }
    return total;
};

const performAllUnaryOps = (operand, unaryArr) => {
    if (unaryArr.length != 0) {
        let result = unaryArr.reduce((accumulator, currentValue) => {
            return evaluateUnaryOp(accumulator, currentValue);
        }, operand);
        return result;
    }
    return operand;
}

const evaluateUnaryOp = (operand, operator) => {
    let op = parseFloat(operand);
    let result = 0;
    switch(operator) {
        case "negate":
            result = -(op);
            break;
        case "sqr":
            result = op*op;
            break;
        case "sqrt":
            result = Math.sqrt(op);
            break;
        case "1/":
            result = 1/op;
            break;
    }
    return result;
};

const evaluateBinaryOp = (operand1, operand2, operator) => {
    let op1 = parseFloat(operand1);
    let op2 = parseFloat(operand2);
    let result = 0;
    switch(operator) {
        case binOp.Add:
            result = op1 + op2;
            break;
        case binOp.Subtract:
            result = op1 - op2;
            break;
        case binOp.Multiply:
            result = op1 * op2;
            break;
        case binOp.Divide:
            if (op2 != 0)
                result = op1 / op2;
            else
                typeTxt.innerText = "Cannot divide by zero";
            break;
    }
    return result;
};

const degToRadians = (deg) => {
    return (parseFloat(deg) * Math.PI ) / 180;
};

const getObjFromFlatExp = (expStr) => {

    // Expected String Format
    // Binary:  'numUnary1, unaryOps1, Op1, binaryOp, Op2, unaryOp2, numUnary2'
    // Unary:   'numUnary1, unaryOps1, Op1, 0'
    // For both unaryOps1 & unaryOps2, in-to-out = left-to-right

    let exp = {
        isBinary: false,    binaryOp: "",
        operand1: "0",      operand2: "",
        unaryOps1: [],      unaryOps2: []
    };
    exp.isBinary = (getNumOfOps(expStr) == 2);
    let expArr = expStr.split(",");
    let numUnary1 = parseInt(expArr.at(0));
    exp.operand1 = expArr.at(numUnary1 + 1);
    if (numUnary1 != 0)
        exp.unaryOps1 = expArr.slice(1, numUnary1 + 1);
    let numUnary2 = parseInt(expArr.at(-1));
    if (exp.isBinary) {
        exp.binaryOp = expArr.at(numUnary1 + 2);
        exp.operand2 = expArr.at(numUnary1 + 3);
        if (numUnary2 != 0)
            exp.unaryOps2 = expArr.slice(-(numUnary2 + 1), -1);
    }
    return exp;
}

const getNumOfOps = (expStr) => {
    let expArr = expStr.split(",");
    expArr[parseInt(expArr.at(0)) + 1] = "checkOp";
    if (expArr.at(-2) == "checkOp")
        return 1;
    else
        return 2;
}

/* 
    =============================
      HANDLING OPERATOR BUTTONS
    =============================
*/

const handlePercentOp = () => {
    if (exp.isBinary) {
        if (exp.operand2 == "") {
            exp.operand2 = exp.operand1;
        } else {
            exp.operand2 = performAllUnaryOps(exp.operand2, exp.unaryOps2);
        }
        exp.operand2 = exp.operand2 * (exp.operand1 / 100);
        resultState = true;
        lastKey = key.Operator;
        handleFieldDisplay(false);
        handleExpDisplay(false);
    }
};

const handleNegateOp = () => {
    if (exp.isBinary) {
        if (exp.operand2 == "") {
            exp.operand2 = exp.operand1;            
        }
        if (resultState) {
            exp.unaryOps2.push(unOp.Negate);
            handleExpDisplay(false);
        } else if (exp.operand2 !== "0"){
            exp.operand2 = -exp.operand2;
        }
    }
    else {
       if (resultState) {
            exp.unaryOps1.push(unOp.Negate);
            handleExpDisplay(false);
        } else if (exp.operand1 !== "0"){
            exp.operand1 = -exp.operand1;
        }
    }
    lastKey = key.Operator;
    handleFieldDisplay(false);
}
const handleUnaryOp = (operator) => {
    if (exp.isBinary) {
        if (exp.operand2 == "") {
            exp.operand2 = exp.operand1;
        }
        exp.unaryOps2.push(operator);
    }
    else {
        exp.unaryOps1.push(operator);
    }

    resultState = true;
    lastKey = key.Operator;
    handleExpDisplay(false);
    handleFieldDisplay(false);
}

const handleBinaryOp = (operator) => {
    if (exp.isBinary) {
        if (exp.operand2 == "")
            exp.operand1 = performAllUnaryOps(exp.operand1, exp.unaryOps1);
        else
            exp.operand1 = performFlatExp(exp);
        exp.operand2 = "";
        exp.unaryOps2 = [];
        exp.unaryOps1 = [];
        // create history
    } else {
        exp.isBinary = true;
    }
    exp.binaryOp = operator;
    resultState = true;
    lastKey = key.Operator;
    handleExpDisplay(false);
    handleFieldDisplay(false);
}

/* 
    =========================
      HANDLING EQUAL BUTTON
    =========================
*/

const handleEqualBtn = () => {
    if (exp.isBinary && exp.operand2 == "") {
        exp.operand2 = exp.operand1;
    }
    // create history
    handleExpDisplay(true);
    handleFieldDisplay(true);
    exp.operand1 = performFlatExp(exp);
    exp.operand2 = performAllUnaryOps(exp.operand2, exp.unaryOps2);
    exp.unaryOps2 = [];
    exp.unaryOps1 = [];
    resultState = true;
    lastKey = key.Equal;
}


/* 
    ============================
      HANDLING EVENT LISTENERS  
    ============================
*/


window.addEventListener("resize", adjustResultTxt);
document.addEventListener("keydown", handleKeys);
for (let btn of typeBtns) {
    btn.addEventListener("click", handleDigitInput);
}

backBtn.addEventListener("click", handleBackspace);
clearEntryBtn.addEventListener("click", handleClearEntry);
clearAllBtn.addEventListener("click", handleClearAll);

plusBtn.addEventListener("click", () => handleBinaryOp(binOp.Add));
minBtn.addEventListener("click", () => handleBinaryOp(binOp.Subtract));
mulBtn.addEventListener("click", () => handleBinaryOp(binOp.Multiply));
divBtn.addEventListener("click", () => handleBinaryOp(binOp.Divide));

percentBtn.addEventListener("click", handlePercentOp);
signBtn.addEventListener("click", handleNegateOp);
reciprocalBtn.addEventListener("click", () => handleUnaryOp(unOp.Reciprocal));
squareBtn.addEventListener("click", () => handleUnaryOp(unOp.Square));
sqRootBtn.addEventListener("click", () => handleUnaryOp(unOp.SqRoot));

equalBtn.addEventListener("click", handleEqualBtn);
delHistoryBtn.addEventListener("click", clearHistory);
