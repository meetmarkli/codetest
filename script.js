let lastFlipperId = "";//最后点击的牌ID
let showScore = 0; //显示分数
let score = 0;//实际分数
let sumScore;//总分数
let time = 60;//时间（s）
let arrLength = 4;//牌的数目
let level = 1;//
let statsButton = $(".game-stats__button");
let gameBoard = $(".game-board");
let levelDisplay = $(".game-stats__level--value")
let countDown;

loadPage();
function loadPage() {
    levelDisplay.text(level);
    var html = "";
    html += `<div class="game-instruction">
                <h3 class="game-instruction__header">Instruction</h3>
                <p class="game-instruction__content">
                - Click on the card to view the back face of the card. <br />
                - Get two exact same card to score.<br />- Score are based on the time
                and level. <br />- You only have 60s for each level. <br />- There are
                 three levels, '2x2', '4x4' and '6x6'. <br />- Press 'Start Game'
                button when you are ready.
                </p>
            </div>`;
    $(".game-board").html(html);

}


/*******************************************
/     game process
/******************************************/

function setLayout() {
    if (level === 1) {
        gameBoard.css("grid-template-columns", "1fr 1fr");
    } else if(level === 2){
        gameBoard.css("grid-template-columns", "1fr 1fr 1fr 1fr");
    } else if(level === 2){
        gameBoard.css("grid-template-columns", "1fr 1fr 1fr 1fr 1fr 1fr");
    }
}
function setGame() {
    setLayout()
    levelDisplay.text(level);
    // console.log(statsButton[0].innerHTML);
    if (statsButton[0].innerHTML === "New Game") {
        //点击start后改变gameboard CSS排版
        
        
        statsButton.text("End Game");


        //设置初始分数，时间
        $("#score").text(score);
        setTime();
        initGame();
        $(".front").bind("click", function () {
            let node = $(this);
            overturn(node);
        });

    }else{
        // 此处需要将timeOut清除先，否则计时器会每秒走两次
        clearTimeout(countDown);
        alert("Congratulations! Your score is " + showScore + ".");
        $(".flipper").css("transform", "rotateY(0deg)");
        $("#time").text(time + "s");
        $("#score").text(showScore);
        statsButton.text("New Game");
        initGame();
        
    }


}




//点击翻牌
function overturn(node) {
    let flipper = $(node).closest(".flipper");
    let currFlipperId = flipper.attr('id');
    //牌翻面
    flipper.css("transform", "rotateY(-180deg)");

    //判断是否是第一次点击
    if (lastFlipperId === "") {
        lastFlipperId = currFlipperId;
    } else {//
        let lastNode = $("#" + lastFlipperId);
        let currNode = $("#" + currFlipperId);

        let lastValue = lastNode.attr("data-value");
        let currValue = currNode.attr("data-value");
        //判断两次点击值是否相等
        if (lastValue === currValue) {
            lastNode.unbind("click");
            currNode.unbind("click");
            lastFlipperId = "";
            score++;
            showScore += Math.pow(level, 2) * time;
            $("#score").text(showScore);
        } else {
            // 如果值不相等，先解绑所有click事件，在1.5秒翻牌，
            //此处注意需要将重新绑定事件写在settimeout里面，因为set是异步的，不是按顺序执行
            //写在外面，则此功能实现不了
            $(".front").each(function(){
                $(this).unbind("click");
            });

            setTimeout(function () {
                
                lastNode.css("transform", "rotateY(0deg)");
                currNode.css("transform", "rotateY(0deg)");
                $(".front").bind("click", function () {
                    let node = $(this);
                    overturn(node);
                });

            }, 1500);

            

            lastFlipperId = "";
        }
    }

}

function setTime() {
    if (time === 0) {
        alert("game over! Your score is " + showScore + ".");
        $(".flipper").css("transform", "rotateY(0deg)");
        
        $(".front").each(function(){
            $(this).unbind("click");
        });
        statsButton.text("New Game");
        $("#time").text(time + "s");
        $("#score").text(showScore);
    } else {

        if (score === 2) {
            alert("congratulation！！NEXT LEVEL");
           
            arrLength = 16;
            level = 2;
            setGame();
            statsButton.click();
            score = 3;

        } else if (score === 11) {
            alert("congratulation！！NEXT LEVEL");
            arrLength = 36;
            level = 3;
            setGame();
            statsButton.click();


        } else {
            time--;
            $("#time").text(time + "s");
            countDown = setTimeout(function () {
                setTime()
            }, 1000);
        }

    }
    
}

// 初始游戏
function initGame() {
    time = 60;
    score = 0;
    $("#score").text(score);

    var html = "";
    var arr = shuffleArray(createOrderArr(arrLength));
    for (var i = 0; i < arr.length; i++) {
        var dataVal = Math.ceil(arr[i] / 2);
        html += `<div class="flipper" id=${i} data-value=${dataVal}>
                    <div class="front">
                        <img src="./css/icons/m.png" alt="">
                    </div>
                    <div class="back">
                        <img src="./css/icons/${dataVal}.svg" alt="">
                    </div>
                </div>`;
    }
    $(".game-board").html(html);
}

//根据参数创建数组
function createOrderArr(arrLength) {
    var arr = [];
    for (var i = 0; i < arrLength; i++) {
        arr.push(i + 1);
    }
    return arr;
}

//随机打乱数组
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}