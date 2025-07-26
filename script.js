/*
    ===================================
      GLOBALLY ACCESSING DOM ELEMENTS  
    ===================================
*/

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
let themeBtn = document.querySelector("#theme-btn");

let storagePanel = document.querySelector("#storage-panel");
let overlay = document.querySelector("#overlay");
let histMobBtn = document.querySelector("#hist-mob-btn");
let delHistoryBtn = document.querySelector("#storage-panel #del-history-btn");

const key = Object.freeze({
    Digit: "digit",
    Equal: "equal",
    Operator: "operator",
    Control: "control",
    None: "none"
});

let lastKey = key.None;
let errorState = false;
let resultState = false;
    // true when: equal, unary, or binary operator btn is pressed
    // false again when: some digit or clear all btn is pressed


/*
    ===================
      HANDLING INPUTS
    ===================
*/

const handleDigitInput = (event = null, str = "") => {

    if (lastKey == key.Equal || errorState) {
        handleClearAll();
        disableErrorState();
        errorState = false;
    }

    let oldTxt = (exp.isBinary? exp.operand2 : exp.operand1).toString();
    if (resultState) {
        oldTxt = "0";
        if (exp.isBinary) {
            exp.operand2 = "";
            exp.unaryOps2 = [];
        }
        else {
            setExpTxt(readFlatExp(exp));
            createHistoryItem(exp);
            exp.unaryOps1 = [];
        }
    }
    
    let newTxt = str;
    if (event != null) {
        newTxt = event.target.innerHTML;
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
        digitPressed(event.key.toString());
        lastKey = key.Digit;
    }

    else if (event.key == "Backspace") {
        handleBackspace();
        keyPressEffect("#backspace-btn");
        lastKey = key.Control;
    }

    else if (event.key == "Delete") {
        handleClearEntry();
        keyPressEffect("#clear-entry-btn");
        lastKey = key.Control;
    }

    else if (event.key == "Escape") {
        handleClearAll();
        keyPressEffect("#clear-all-btn");
        lastKey = key.Control;
    }

    else if (event.key == "Enter" || event.key == "=") {
        handleEqualBtn();
        keyPressEffect("#equal-btn");
        lastKey = key.Equal;
    }

    else if (event.key == "+") {
        handleBinaryOp(binOp.Add);
        keyPressEffect("#plus-btn");
        lastKey = key.Operator;
    }

    else if (event.key == "-") {
        handleBinaryOp(binOp.Subtract);
        keyPressEffect("#min-btn");
        lastKey = key.Operator;
    }

    else if (event.key == "*") {
        handleBinaryOp(binOp.Multiply);
        keyPressEffect("#mul-btn");
        lastKey = key.Operator;
    }

    else if (event.key == "/") {
        handleBinaryOp(binOp.Divide);
        keyPressEffect("#div-btn");
        lastKey = key.Operator;
    }

    else if (event.key == "q") {
        handleUnaryOp(unOp.Square);
        keyPressEffect("#sqr-btn");
        lastKey = key.Operator;
    }

    else if (event.key == "r") {
        handleUnaryOp(unOp.Reciprocal);
        keyPressEffect("#reciprocal-btn");
        lastKey = key.Operator;
    }

    else if (event.key == "@") {
        handleUnaryOp(unOp.SqRoot);
        keyPressEffect("#sqrt-btn");
        lastKey = key.Operator;
    }

    else if (event.key == "%") {
        handlePercentOp();
        keyPressEffect("#percent-btn");
        lastKey = key.Operator;
    }

}

const digitPressed = (str) => {
    switch(str) {
        case "0":
            (keyPressEffect("#digits #d0-btn"));
            break;
        case "1":
            (keyPressEffect("#digits #d1-btn"));
            break;
        case "2":
            (keyPressEffect("#digits #d2-btn"));
            break;
        case "3":
            (keyPressEffect("#digits #d3-btn"));
            break;
        case "4":
            (keyPressEffect("#digits #d4-btn"));
            break;
        case "5":
            (keyPressEffect("#digits #d5-btn"));
            break;
        case "6":
            (keyPressEffect("#digits #d6-btn"));
            break;
        case "7":
            (keyPressEffect("#digits #d7-btn"));
            break;
        case "8":
            (keyPressEffect("#digits #d8-btn"));
            break;
        case "9":
            (keyPressEffect("#digits #d9-btn"));
            break;
        case ".":
            (keyPressEffect("#digits #dot-btn"));
            break;
    }
}

const keyPressEffect = (selector) => {
    let btn = document.querySelector(selector);
    if (!btn.hasAttribute("disabled")) {
        btn.classList.add("active");
        setTimeout(() => {btn.classList.remove("active");}, 100);
        return true;
    }
    return false;
}

/* 
    ====================
      HANDLING DISPLAY
    ====================
*/

const getTypeTxt = () => {
    return document.querySelector("#type").innerHTML;
};

const setTypeTxt = (str) => {
    document.querySelector("#type").innerHTML = str;
};

const getExpTxt = () => {
    return document.querySelector("#exp").innerHTML;
}

const setExpTxt = (str) => {
    document.querySelector("#exp").innerHTML = str;
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
    let x = getTypeTxt().toLowerCase();
    if (x == "overflow" ||
        x == "invalid input" ||
        x == "cannot divide by zero") {
        enableErrorState();
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
        op1 = getOperatorSymbol(exp.unaryOps1[i]) + "( " + op1 + " )";        
    }
    if (exp.isBinary) {
        op2 = exp.operand2;
        for (let i = 0; i < exp.unaryOps2.length; i++) {
            op2 = getOperatorSymbol(exp.unaryOps2[i]) + "( " + op2 + " )";        
        }
        op2 = " " + op2;
    }
    expStr += op1 + " " + getOperatorSymbol(exp.binaryOp) + op2;
    return expStr;

    function getOperatorSymbol(str) {
        switch(str) {
            case "*":
                return "&times;";
            case "/":
                return "&divide;";
            case "sqrt":
                return "&Sqrt;";
            default:
                return str;
        }
    }
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

    // Check if it's a non-numeric error message:
    if ("abcdefghijklmnopqrstuvwxyz".includes(str[1])) {
        return str;
    }

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
    disableErrorState();

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
    disableErrorState();
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
    disableErrorState();
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
    if (exp.isBinary && exp.operand2 != "") {
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
    let op = new Decimal(operand);
    let result = 0;
    switch(operator) {
        case "negate":
            result = op.negated().toString();
            break;
        case "sqr":
            result = op.pow(2).toString();
            break;
        case "sqrt":
            if (op >= 0)
                result = op.sqrt().toString();
            else
                result = "Invalid input";
            break;
        case "1/":
            if (op != 0)
                result = (new Decimal("1")).div(op).toString();
            else
                result = "Cannot divide by zero";
            break;
    }
    return checkErrorMsg(result);
};

const evaluateBinaryOp = (operand1, operand2, operator) => {
    let a = new Decimal(operand1);
    let b = new Decimal(operand2);
    let result = 0;
    switch(operator) {
        case binOp.Add:
            result = a.plus(b).toString();
            break;
        case binOp.Subtract:
            result = a.minus(b).toString();
            break;
        case binOp.Multiply:
            result = a.times(b).toString();
            break;
        case binOp.Divide:
            if (b.toString() !== "0")
               result = a.div(b).toString();
            else
                result = "Cannot divide by zero";
            break;
    }
    return checkErrorMsg(result);
};

const degToRadians = (deg) => {
    return (parseFloat(deg) * Math.PI ) / 180;
};

const checkErrorMsg = (str) => {
    if (str == "Infinity" || str == "NaN")
        return "Overflow";
    else 
        return str;
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

const enableErrorState = () => {
    errorState = true;
    exp = {
        isBinary: false,    binaryOp: "",
        operand1: "",      operand2: "",
        unaryOps1: [],      unaryOps2: []
    };
    toggleBtnsState();
};

const disableErrorState = () => {
    if (errorState) {
        errorState = false;
        handleFieldDisplay(false);
        handleExpDisplay(false);
        toggleBtnsState();
    }
};

const toggleBtnsState = () => {
    let dotBtn = document.querySelector("#digits #dot-btn");
    let btnArr = [];
    btnArr.push(plusBtn, minBtn, mulBtn, divBtn, dotBtn, signBtn, percentBtn, reciprocalBtn, squareBtn, sqRootBtn);
    for (const btn of btnArr) {
        btn.classList.toggle("in-error-state");
        btn.toggleAttribute("disabled");
    }
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
        exp.operand2 = (exp.operand2 * (exp.operand1 / 100)).toString();
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
            exp.operand2 = (new Decimal(exp.operand2)).negated().toString();
        }
    }
    else {
       if (resultState) {
            exp.unaryOps1.push(unOp.Negate);
            handleExpDisplay(false);
        } else if (exp.operand1 !== "0"){
            exp.operand1 = (new Decimal(exp.operand1)).negated().toString();
        }
    }
    lastKey = key.Operator;
    handleFieldDisplay(false);
}

const handleUnaryOp = (operator) => {
    let tempCheck = removeCommas(getTypeTxt()) == performFlatExp(exp) && exp.isBinary;
    let binOpPressed =  tempCheck && exp.operand2 == "";
    let historyFetched = tempCheck && exp.operand2 != "";
    if (historyFetched) {
        exp.operand1 = performFlatExp(exp);
    }
    if (lastKey == key.Equal || historyFetched == true) {
        exp.isBinary = false;
        exp.binaryOp = "";
        exp.operand2 = "";
        exp.unaryOps2 = [];
        exp.unaryOps1 = [];
        exp.unaryOps1.push(operator);
    }
    else if (binOpPressed) {
        exp.operand2 = performAllUnaryOps(exp.operand1, exp.unaryOps1);
        exp.unaryOps2.push(operator);
    }
    else {
        if (exp.isBinary) {
            if (exp.operand2 == "") {
                exp.operand2 = exp.operand1;
            }
            exp.unaryOps2.push(operator);
        }
        else {
            exp.unaryOps1.push(operator);
        }
    }
    resultState = true;
    lastKey = key.Operator;
    handleExpDisplay(false);
    handleFieldDisplay(false);
}

const handleBinaryOp = (operator) => {
    if (exp.isBinary) {
        if (exp.operand2 != "") {
            createHistoryItem(exp);
            exp.operand1 = performFlatExp(exp);
            exp.unaryOps1 = [];
        }
        exp.operand2 = "";
        exp.unaryOps2 = [];
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
    // if (!errorState) {
        handleExpDisplay(true);
        handleFieldDisplay(true);
        createHistoryItem(exp);        
        resultState = true;
    // }
    // else
        disableErrorState();
    exp.operand1 = performFlatExp(exp);
    exp.operand2 = performAllUnaryOps(exp.operand2, exp.unaryOps2);
    exp.unaryOps2 = [];
    exp.unaryOps1 = [];
    lastKey = key.Equal;
}


/* 
    ====================
      HANDLING HISTORY
    ====================
*/

const createHistoryItem = (exp, key = "") => {
    let emptyMsg = document.querySelector("#empty-msg");
    emptyMsg.style.display = "none";
    let list = document.querySelector("#history-list");
    let item = document.createElement("li");
    let hExp = document.createElement("pre");
    let hResult = document.createElement("pre");
    item.classList.add("item");
    hExp.classList.add("h-exp");
    hResult.classList.add("h-result");
    hExp.innerHTML = addMoreSpace(readFlatExp(exp), exp) + " =";
    hResult.innerHTML = performFlatExp(exp);
    if (key == "") {
        key = "hist_" + list.children.length;
        localStorage.setItem(key, JSON.stringify(exp));
    }
    item.setAttribute("data-key", key);
    item.append(hExp);
    item.append(hResult);
    item.addEventListener("click", fetchHistoryItem);
    list.insertBefore(item, list.firstChild);
    function addMoreSpace(str, hExp) {
        let result = "";
        for (let i = 0; i < str.length; i++) {
            if (hExp.isBinary && str[i] == hExp.binaryOp){
                result += "  " + str[i] + "  ";
            }
            else{
                result += str[i];
            }
        }
        return result;
    }
};

const fetchHistoryItem = (event) => {
    let item = event.currentTarget;
    let key = item.dataset.key;
    exp = JSON.parse(localStorage.getItem(key));
    resultState = true;
    handleExpDisplay(true);
    handleFieldDisplay(true);
};

const loadHistory = () => {
    let keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("hist")) {
            keys.push(key);
        }
    }
    if (keys.length > 0) {
        keys.sort((a,b) => {
            return a.slice(5) - b.slice(5);
        });
        for (let i = 0; i < keys.length; i++) {
            let exp = JSON.parse(localStorage.getItem(keys[i]));
            createHistoryItem(exp, keys[i]);
        }
    }
}

const clearHistory = () => {
    let emptyMsg = document.querySelector("#empty-msg");
    emptyMsg.style.display = "flex";
    let list = document.querySelector("#history-list");
    list.innerHTML = "";
    let removeKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("hist")) {
            removeKeys.push(key);
        }
    }
    if (removeKeys.length > 0) {
        for (let i = 0; i < removeKeys.length; i++) {
            localStorage.removeItem(removeKeys[i]);
        }
    }
};

const openHistoryMob = () => {
    overlay.style.display = "block";
    storagePanel.style.top = "45vh";
    storagePanel.style.display = "flex";
    storagePanel.animate(
        [
            {
                top: "45vh",
                opacity: 0
            },
            {
                top: "33.3vh",
                opacity: 1
            }
        ],
        {
            duration: 200,
            easing: 'ease-in-out',
            fill: 'forwards'
        }
    );
};

const closeHistoryMob = () => {
    const anim = storagePanel.animate(
        [
            {
                opacity: 1
            },
            {
                opacity: 0
            }
        ],
        {
            duration: 200,
            easing: 'ease-in-out',
            fill: 'forwards'
        }
    );
    anim.finished.then(() => {
        overlay.style.display = "none";
        storagePanel.style.top = "101vh";
        storagePanel.style.display = "none";
    });
};

loadHistory();


/* 
    ======================
      HANDLING APP THEME
    ======================
*/

let isAnimatingTheme = false;

const setTheme = (str) => {
    localStorage.setItem("theme", str);
};

const getTheme = (setPosition = true) => {
    let theme = localStorage.getItem("theme");
    if (theme == null) {
        theme = "light";
        setTheme(theme);
    }
    let root = document.documentElement;
    let btn = document.querySelector("#active-theme");
    if (theme == "dark") {
        root.setAttribute("data-theme", "dark");
        btn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
        if (setPosition) {
            btn.style.left = "";
            btn.style.right = "3px";
        }
    }
    else {
        root.setAttribute("data-theme", "light");
        btn.innerHTML = `<p class="dim">&#xf08c;</p>`;
        if (setPosition) {
            btn.style.left = "3px";
            btn.style.right = "";
        }
    }
    return theme;
};

const switchTheme = (setPosition = true) => {
    let root = document.documentElement;
    let curTheme = root.getAttribute("data-theme");
    if(curTheme == "light") {
        setTheme("dark")
    }
    else {
        setTheme("light");
    }
    getTheme(setPosition);
};

const handleThemeBtn = (event) => {
    if (isAnimatingTheme)
        return;
    isAnimatingTheme = true;

    let btn = event.currentTarget.querySelector("#active-theme");
    let child = btn.firstElementChild;
    let transVal = 0;
    let rotateVal = 0;
    let theme = document.documentElement.getAttribute("data-theme");
    if (theme == "light") {
        transVal = "26px";
        rotateVal = "180deg";
    }
    else {
        transVal = "-26px";
        rotateVal = "-270deg";
    }
    const translation = btn.animate(
        [
            {
                transform: `translateX(0)`,
            },
            {
                transform: `translateX(${transVal})`,
            }
        ],
        {
            duration: 500,
            easing: 'ease-in-out',
        }
    );

    const rotation = child.animate(
        [
            {
                transform: "rotateZ(0)",
                opacity: "1"
            },
            {
                transform: `rotateZ(${rotateVal})`,
                opacity: "0.2"
            }
        ],
        {
            duration: 400,
            easing: 'ease-in-out',
            fill: 'forwards'
        }
    );
    rotation.finished.then(() => {
        isAnimatingTheme = false;
        switchTheme(false)
    });

    translation.finished.then(() => {
        isAnimatingTheme = false;
        if (theme == "light") {
            btn.style.right = "3px";
            btn.style.left = "";
        }
        else {
            btn.style.right = "";
            btn.style.left = "3px";
        }
        event.currentTarget.disabled = false;
        event.currentTarget.removeAttribute("disabled");
    });
}

getTheme();


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
themeBtn.addEventListener("click", handleThemeBtn);

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
delHistoryBtn.addEventListener("click", () => clearHistory());
histMobBtn.addEventListener("click", openHistoryMob);

overlay.addEventListener("click", closeHistoryMob);