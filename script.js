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
let equalBtn = buttons.querySelector("#equal-btn");

let operand1 = "";
let operand2 = "";
let lastOperator = "";

const key = Object.freeze({
    Digit: "digit",
    Equal: "equal",
    Operator: "operator",
    None: "none"
});
let lastKey = key.None;

// HANDLING INPUT:
// **************

const type = (event = null, str = "", merge = true) => {

    if (lastKey != key.Digit) typeTxt.innerText = "0";

    let newTxt = str;
    if (event != null)
        newTxt = event.target.innerText;

    typeTxt.innerText = removeCommas(typeTxt.innerText.toString());
    newTxt = removeCommas(newTxt);

    let newTxtLen = newTxt.length;
    let typeTextLen = typeTxt.innerText.toString().length;
    let newTxtHasDec = newTxt.includes(".");
    let typeTextHasDac = typeTxt.innerText.toString().includes(".");

    let charLimit = 16;
    if ((merge && typeTextHasDac) ||
        (!merge && newTxtHasDec))
    {
        charLimit = 17;
    }
    if ((merge && typeTxt.innerText.toString().slice(0,2) == "0.") ||
        !merge && newTxt.slice(0,2) == "0.")
    {
        charLimit = 18;
    }

    if ( merge &&
        ((newTxtHasDec && typeTextHasDac) ||
         (newTxtLen + typeTextLen > charLimit))
    ) {
        typeTxt.innerText = addCommas(typeTxt.innerText.toString());
        return;
    }

    if (typeTxt.innerText == "0") {
        if (newTxt[0] == ".")
            typeTxt.innerText += newTxt;
        else
            typeTxt.innerText = newTxt;
    }
    else {
        if (merge)
            typeTxt.innerText += newTxt;
        else
            typeTxt.innerText = newTxt;
    }

    typeTxt.innerText = addCommas(typeTxt.innerText);

    if(operand1 != "") {
        operand2 = removeCommas(typeTxt.innerText);
    }

    lastKey = key.Digit;
}

const removeCommas = (str) => {
    let result = str;
    if (str.includes(",")) {
        result = "";
        for (let i = 0; i < str.length; i++) {
            if (str[i] != ",")
                result += str[i];
        }
    }
    return result;
}

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

    for (let i = 0; i < temp.length; i++) {
        if (i > 0 && (temp.length - i) % 3 == 0) {
            result += ",";
        }
        result += temp[i];
    }

    if (decIdx != -1)
        result += str.slice(decIdx, str.length);

    return result;
}

const handleKeys = (event) => {

    if ("0123456789.".includes(event.key.toString())) {
        type(null, event.key.toString(), true);
    }

    else if (event.key == "Backspace") {
        handleBackspace();
    }

    else if (event.key == "Delete") {
        typeTxt.innerText = "0";
    }

    else if (event.key == "Escape") {
        clearAllDisplay();
    }

    else if (event.key == "Enter" || event.key == "=") {
        handleEqualBtn();
    }

    else if (event.key == "+") {
        handleBasicOp("+", op.Add);
    }

    else if (event.key == "-") {
        handleBasicOp("-", op.Subtract);
    }

    else if (event.key == "*") {
        handleBasicOp("*", op.Multiply);
    }

    else if (event.key == "/") {
        handleBasicOp("/", op.Divide);
    }

    // IN STANDARD  
    // q for square
    // r for reciprocal
    // Shift+2 for square root

}

const handleBackspace = () => {

    let temp = typeTxt.innerText.toString();
    removeCommas(temp);
    let len = temp.length;

    if (len > 1) {
        temp = temp.slice(0,len-1);
    }
    else if (len = 1 && temp != "0") {
        temp = "0";
    }

    typeTxt.innerText = addCommas(temp);
}


// HANDLING OPERTORS:
// *****************

const op = Object.freeze({
    Add: "add",
    Subtract: "subtract",
    Multiply: "multiply",
    Divide: "divide",
    None: "none"
});

const handleNegateOp = () => {
    let str = typeTxt.innerText.toString();
    if (str == "0") {
        return;
    }
    if (str[0] != "-") {
        typeTxt.innerText = "-" + str;
    }
    else {
        typeTxt.innerText = str.slice(1,str.length);
    }
}

const handleBasicOp = (symbol, lastOp) => {
    let str = typeTxt.innerText.toString();
    let expStr = expTxt.innerText.toString();
    let clearedStr = removeCommas(str);

    if (operand1 == "" || expStr.includes("=")) {
        expTxt.innerText = clearedStr + " " + symbol;
    }

    if (operand1 == "") {
        operand1 = clearedStr;
    }
    else if(operand2 != "" && lastKey != key.Equal) {
        performOperations();
    }

    lastOperator = lastOp;
    lastKey = key.Operator;
}

const performOperations = (isEqualPressed = false) => {

    let op1 = parseFloat(operand1);
    let op2 = parseFloat(operand2);
    let result = "";
    let symbol = "";

    switch(lastOperator) {
        case op.Add:
            result = op1 + op2;
            symbol = "+";
            break;

        case op.Subtract:
            result = op1 - op2;
            symbol = "-";
            break;

        case op.Multiply:
            result = op1 * op2;
            symbol = "*";
            break;

        case op.Divide:
            if (op2 != 0) {
                result = op1 / op2;
                symbol = "/";                
            }
            else {
                typeTxt.innerText = "Cannot divide by zero";
            }
            break;
    }

    if (result !== "") {
        if (isEqualPressed) {
            expTxt.innerText = `${operand1} ${symbol} ${operand2} =`;
        }
        else {
            expTxt.innerText = result + " " + symbol;
            operand2 = "";
        }
        operand1 = result;
        typeTxt.innerText = result + "";
    }
}


// HANDLING EQUAL BUTTON:
// *********************

const handleEqualBtn = () => {
    if (operand1 == "") {
        expTxt.innerText = typeTxt.innerText + " =";
    }
    else {
        if (operand2 == "" || lastKey == key.Operator)
            operand2 = removeCommas(typeTxt.innerText);
        performOperations(true);
    }
    lastKey = key.Equal;
}

// HANDLING DISPLAY:
// ****************

const clearAllDisplay = () => {
    expTxt.innerText = "";
    typeTxt.innerText = "0";
    operand1 = "";
    operand2 = "";
    lastOperator = op.None;
}

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


// HANDLING EVENTS:
// ****************

window.addEventListener("resize", adjustResultTxt);
document.addEventListener("keydown", handleKeys);
for (let btn of typeBtns) {
    btn.addEventListener("click", type);
}

backBtn.addEventListener("click", handleBackspace);
clearEntryBtn.addEventListener("click", () => {
        typeTxt.innerText = "0";
})
clearAllBtn.addEventListener("click", clearAllDisplay);

plusBtn.addEventListener("click", () => handleBasicOp("+", op.Add));
minBtn.addEventListener("click", () => handleBasicOp("-", op.Subtract));
mulBtn.addEventListener("click", () => handleBasicOp("*", op.Multiply));
divBtn.addEventListener("click", () => handleBasicOp("/", op.Divide));
signBtn.addEventListener("click", handleNegateOp);

equalBtn.addEventListener("click", handleEqualBtn);

/* 

In case of error, pressing or clicking any button clears the display + shows the digit if that was the pressed button.
result must not be editable with backspace.
when exp contains final result, having =, pressing any digit should clear the exp.
overflow: after 8.507648470899241e+9999
*/