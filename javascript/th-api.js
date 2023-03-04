const TH_BASE_URL = "https://codecyprus.org/th/api/"; // the true API base url
let treasureHuntID;

async function doList() {

    const reply = await fetch(TH_BASE_URL + "list");
    const json = await reply.json();

    let treasureHuntsArray = json.treasureHunts;
    let listHtml = "<ul>";
    for (let i = 0; i < treasureHuntsArray.length; i++) {
        listHtml +=
            `<li><b>${treasureHuntsArray[i].name}</b><br/><i>
            ${treasureHuntsArray[i].description}</i><br/>
            <button type='submit' onclick='select("${treasureHuntsArray[i].uuid}");return false'>Start</button></li>
            `;
    }
    listHtml += "</ul>";

    document.getElementById("treasureHunts").innerHTML = listHtml;
}

let userName;

function select(uuid) {
    let nameEl = document.getElementById("userName");
    if (nameEl.value === "") {
        alert("incorect");
    } else {
        treasureHuntID = uuid;
        sessionStorage.setItem('treasure-hunt-id', uuid);
        sessionStorage.setItem('player-name', nameEl.value);
        startSession(uuid, nameEl.value);
    }
}

async function startSession(treasureHuntID, playerName) {
    const reply = await fetch(`${TH_BASE_URL}start?player=${playerName}&app=Team4App&treasure-hunt-id=${treasureHuntID}`);
    const json = await reply.json();
    sessionStorage.setItem('session-id', json.session);
    console.log(json);

    if(json.status === "OK"){
        location.href = "hunt.html";
    }else {
        alert(json.errorMessages[0]);
    }
}

function Questions(reply) {
    questionElement = document.getElementById("question");

    questionInfo = document.createElement("div");
    questionInfo.id = "questionInfo";
    questionInfo.innerHTML = `
        <p>Question: ${reply.questionText}</p>
        <br> 
    `;

    answerElement = document.createElement("div");
    answerElement.id = "answer";
    if (reply.questionType === "INTEGER"){
        answerElement.innerHTML += `
            <input type="number" required> 
            <button onclick="idk()"></button>
        `;
    }

    questionElement.appendChild(questionInfo);
    questionElement.appendChild(answerElement);
}

function idk() {
    var userAnswer = document.getElementById("answerElement");
    console.log(userAnswer);
}

function skipQuestion(reply) {
    if (reply.canBeSkipped === true) {
        // skip question
    } else {
        alert("Question cannot be skipped");
    }
}

async function showQuestions(){
    let sessionID = sessionStorage.getItem('session-id');
    console.log(sessionID);
    const reply = await fetch(`${TH_BASE_URL}question?session=${sessionID}`);
    const json = await reply.json();
    console.log(json);
    Questions(json);
}