var counter = 0;
var clickedFlag = false;
var clickedCard = "";
var timer = 0;
var Main = function() {

    var handleClickingCard = function() {
        $(document).on("click", ".card", function() {
            var $this = $(this);
            if (!$this.hasClass("match") && !$this.hasClass("open")) {
                $this.addClass("open show");
                if (clickedFlag) {
                    var currentCard = $this.find("i").attr("class");
                    if (currentCard === clickedCard) {
                        manageMatchedCards();
                    } else {
                        manageNotMatchedCards(currentCard);
                    }
                    clickedFlag = false;
                } else {
                    clickedFlag = true;
                    clickedCard = $this.find("i").attr("class");
                }
                counter++;
                $(".moves").html(counter);
            }
        });
    };
    var manageMatchedCards = function() {
        $(".card").each(function() {
            var $this = $(this);
            var currentCard = $this.find("i").attr("class");
            if (currentCard === clickedCard) {
                $this.removeClass("open show apply-keyframe");
                $this.addClass("match");
                $this.addClass("apply-keyframe");
            }
        });
        ratePlayer();
        var checkCompleted = checkIfComplete();
        if (checkCompleted) {
            manageModal();
        }
    };
    var manageNotMatchedCards = function(currentCard) {
        $(".card").each(function() {
            var $this = $(this);
            var $current = $this.find("i").attr("class");
            if (($current === currentCard || $current === clickedCard) && $this.hasClass("open")) {
                $this.addClass("apply-keyframe");
                setTimeout(function() {
                    $this.removeClass("apply-keyframe open show");
                }, 700);
            }
        });
    };

    var ratePlayer = function() {
        var matchedCardsCount = 0;
        $(".card").each(function() {
            var $this = $(this);
            if ($this.hasClass("match")) {
                matchedCardsCount++;
            }
        });
        if (matchedCardsCount >= 6 && matchedCardsCount < 12) {
            $(".stars").find("i:last").removeClass("fa-star").addClass("fa-star-o");
        }
        if (matchedCardsCount >= 12) {
            $(".stars").find("i").not("last").removeClass("fa-star").addClass("fa-star-o");
            $(".stars").find("i:first").removeClass("fa-star-o").addClass("fa-star");
        }
    };

    var checkIfComplete = function() {
        var matchFlag = true;
        $(".card").each(function() {
            var $this = $(this);
            if (!$this.hasClass("match")) {
                matchFlag = false;
            }
        });
        return matchFlag;
    };
    var manageModal = function() {
        $("#result-moves").html(counter);
        $("#modal-btn").trigger("click");
    };


    var playGame = function() {
        $(document).on("click", "#play-again-btn", function() {
            Main.resetGame();
        });
        $(document).on("click", "div.restart", function(e) {
            e.preventDefault();
            Main.resetGame();
        });
    };

    var shuffleArrayValues = function() {
        var cardsArray = new Array();
        $(".card").each(function() {
            var $currentIcon = $(this).find("i").attr("class");
            cardsArray.push($currentIcon);
        });
        shuffuledArray = shuffle(cardsArray);
        var html = "";
        for (var i in shuffuledArray) {
            html += '<li class="card"><i class="' + shuffuledArray[i] + '"></i></li>';
        }
        $(".deck").html(html);
    };

    var setTimer = function() {
        setInterval(function() {
            timer++;
            if (timer <= 9) {
                timer = "0" + timer;
            }
            $(".timer").html(" " + timer);
        }, 1000);
    };
    return {
        init: function() {
            shuffleArrayValues();
            handleClickingCard();
            playGame();
            setTimer();
        },
        resetGame: function() {
            shuffleArrayValues();
            counter = 0;
            timer = 0;
            clickedCard = "";
            clickedFlag = false;
            $(".moves").html(counter);
            $(".card").each(function() {
                if ($(this).hasClass("open")) {
                    $(this).removeClass("open show apply-keyframe");
                }
                if ($(this).hasClass("match")) {
                    $(this).removeClass("match apply-keyframe");
                }
            });
            $(".stars").each(function() {
                $(this).find("i").removeClass("fa-star-o").addClass("fa-star");
            });
        }
    };
}();
$(document).ready(function() {
    Main.init();
});