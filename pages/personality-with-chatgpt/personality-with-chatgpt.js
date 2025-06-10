/* 要素のフェードイン */
assignFadein();
function assignFadein() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                obs.unobserve(entry.target);
            }
        });
    });
    document.querySelectorAll('.fadein').forEach(elem => observer.observe(elem));
};

/**
 * 質問,回答,分析のJSONデータ
 * @example <caption>JSON format</caption>
 * |{
 * |    "questions": [
 * |        {
 * |            "question": "質問文...",
 * |            "answer": "回答文...",
 * |            "analysis": "回答に対するChatGPTの分析..."
 * |        },
 * |        {
 * |            "question": "analysisはnullになることもあるよ",
 * |            "answer": "そうなんだ。",
 * |            "analysis": null
 * |        },
 * |        {...}
 * |    ]
 * |}
 */
let qaJson;
/* Q&Aをfetch */
(function () {
    fetch("./cGPT_QA.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("response was not ok");
            }
            return response.json();
        }).then(data => {
            console.log("data/json Loaded ->");
            console.log(data);
            qaJson = data;
            return qaJson;
        }).then(qaJson => {
            createQA(qaJson);
            assignFadein();
        }).catch(error => {
            console.error("Some Error: ", error);
        });
}());

/* 要素を作る */
function createQA(qaJson) {
    const qa = document.querySelector('#qa');
    const qaArray = qaJson["questions"];
    const questions = [];
    // iは1~、0にはヘッダみたいなのが居るので。
    for (let i = 1; i < qaArray.length; i++) {
        /*(emmet)
        (.qa-box.fadein>
            .qa-question>
                .qa-head>
                    img.gpt-chaticon[src="../img/OpenAI-white-monoblossom.svg" alt="chatGPT" title="ChatGPT"]
                    +{&nbsp;}
                    +span{Q$.}
                ^.text{ココに質問文...}
            ^.qa-answer>
                .qa-head.right>
                    span{A$.}
                    +{&nbsp;}
                    +img.oignon-chaticon[src="../img/oignon.png" alt="oignon" title="Oignon"]
                ^.text{ココに回答文...}
            ^.qa-analysis>
                .qa-head>
                    img.gpt-chaticon[src="../img/OpenAI-white-monoblossom.svg" alt="chatGPT" title="ChatGPT"]
                    +{&nbsp;}
                    +span{分析}
                ^.text{ココに分析文...}
        )*n
        これをゴリゴリモリモリムキムキに書いていきます
        */
        // .qa-box
        questions[i] = document.createElement('div');
        questions[i].setAttribute('class', "qa-box fadein");

        // .qa-box > .qa-question
        const qa_question = document.createElement('div');
        qa_question.setAttribute('class', "qa-question");
        // .qa-box > .qa-question > .qa-head
        const qa_head1 = document.createElement('div');
        qa_head1.setAttribute('class', "qa-head");
        // .qa-box > .qa-question > .qa-head > .gpt-chaticon
        const gpt_chaticon = document.createElement('img'); // 共有 要clone
        gpt_chaticon.setAttribute('class', "gpt-chaticon");
        gpt_chaticon.setAttribute('src', "./images/OpenAI-white-monoblossom.svg");
        gpt_chaticon.setAttribute('alt', "chatGPT");
        gpt_chaticon.setAttribute('title', "ChatGPT");
        // .qa-box > .qa-question > .qa-head > "&nbsp;"
        const nbsp = document.createTextNode('\u00A0'); // 共有 要clone
        // .qa-box > .qa-question > .qa-head > span
        const span1 = document.createElement('span');
        span1.textContent = "Q" + i + ".";
        // .qa-box > .qa-question > .qa-head{.gpt-chaticon,"&nbsp;",span}
        qa_head1.appendChild(gpt_chaticon.cloneNode(true));
        qa_head1.appendChild(nbsp.cloneNode(true));
        qa_head1.appendChild(span1);
        // .qa-box > .qa-question > .text
        const text1 = document.createElement('div');
        text1.setAttribute('class', "text");
        text1.innerHTML = qaArray[i]["question"];
        // .qa-box > .qa-question{.qa-head, .text}
        qa_question.appendChild(qa_head1);
        qa_question.appendChild(text1);

        // .qa-box > .qa-answer
        const qa_answer = document.createElement('div');
        qa_answer.setAttribute('class', "qa-answer");
        // .qa-box > .qa-answer > .qa-head
        const qa_head2 = document.createElement('div');
        qa_head2.setAttribute('class', "qa-head right");
        // .qa-box > .qa-answer > .qa-head > span
        const span2 = document.createElement('span');
        span2.textContent = "A" + i + ".";
        // .qa-box > .qa-answer > .qa-head > .oignon-chaticon
        const oignon_chaticon = document.createElement('img');
        oignon_chaticon.setAttribute('class', "oignon-chaticon");
        oignon_chaticon.setAttribute('src', "./images/oignon.png");
        oignon_chaticon.setAttribute('alt', "oignon");
        oignon_chaticon.setAttribute('title', "Oignon");
        // .qa-box > .qa-answer > .qa-head{span,"&nbsp;",.oignon-chaticon}
        qa_head2.appendChild(span2);
        qa_head2.appendChild(nbsp.cloneNode(true));
        qa_head2.appendChild(oignon_chaticon);
        // .qa-box > .qa-answer > .text
        const text2 = document.createElement('div');
        text2.setAttribute('class', "text");
        text2.innerHTML = qaArray[i]["answer"];
        // .qa-box > .qa-answer{.qa-head, .text}
        qa_answer.appendChild(qa_head2);
        qa_answer.appendChild(text2);

        // .qa-box > .qa-analysis
        const qa_analysis = document.createElement('div');
        qa_analysis.setAttribute('class', "qa-analysis");
        if (qaArray[i]["analysis"] !== null) {
            // .qa-box > .qa-analysis > .qa-head
            const qa_head3 = document.createElement('div');
            qa_head3.setAttribute('class', "qa-head");
            // .qa-box > .qa-analysis > .qa-head > span
            const span3 = document.createElement('span');
            span3.textContent = "分析";
            // .qa-box > .qa-analysis > .qa-head{.gpt-chaticon,"&nbsp;",span}
            qa_head3.appendChild(gpt_chaticon.cloneNode(true));
            qa_head3.appendChild(nbsp.cloneNode(true));
            qa_head3.appendChild(span3);
            // .qa-box > .qa-analysis > .text
            const text3 = document.createElement('div');
            text3.setAttribute('class', "text");
            text3.innerHTML = qaArray[i]["analysis"];
            // .qa-box > .qa-analysis{.qa-head, .text}
            qa_analysis.appendChild(qa_head3);
            qa_analysis.appendChild(text3);
        }

        // .qa-box{.qa-question,qa-answer,<Optional>(qa-analysis)}
        questions[i].appendChild(qa_question);
        questions[i].appendChild(qa_answer);
        if (qaArray[i]["analysis"] !== null) {
            questions[i].appendChild(qa_analysis);
        }
    }
    for (let i = 0; i < questions.length; i++) {
        if (questions[i] !== undefined) {
            qa.appendChild(questions[i]);
        }
    }
}