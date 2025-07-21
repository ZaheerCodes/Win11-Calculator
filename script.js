
const adjustResultTxt = () => {

    let resultTxt = document.querySelector("#result");
    let parent = resultTxt.parentElement;

    let maxFont = 72;
    if(innerHeight < 680)
        maxFont = 48;
    resultTxt.style.fontSize = maxFont + "px";

    while (parseInt(parent.getBoundingClientRect().width) - parseInt(resultTxt.getBoundingClientRect().width) < 24)
    {
        let fontValue = parseInt(getComputedStyle(resultTxt).getPropertyValue("font-size").slice(0,2));
        fontValue -= 1;
        resultTxt.style.fontSize = fontValue + "px";
    }
}

adjustResultTxt();

window.addEventListener("resize", adjustResultTxt);
