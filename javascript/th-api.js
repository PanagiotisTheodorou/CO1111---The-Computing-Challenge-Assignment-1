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

    questionElement.innerHTML = `
        <p>Question: ${reply.questionText}</p>
        <br> 
    `;

    answerElement = document.getElementById("answerForm");

    if (reply.questionType === "INTEGER"){
        answerElement.innerHTML = `
            <input type="number" name="answer" required> 
            <button onclick="sendAnswer(); return false" type="submit"></button>
        `;
    }
    if (reply.questionType === "BOOLEAN"){
        answerElement.innerHTML = `
            <label>True</label>
            <input type="radio" name="answer" value="true">
            <label>False</label>
            <input type="radio" name="answer" value="false">
            <button onclick="sendAnswer(); return false" type="submit">send answer</button>
        `;
    }
    if (reply.questionType === "MCQ"){
        answerElement.innerHTML = `
            <label>A</label>
            <input type="radio" name="answer" value="A">
            <label>B</label>
            <input type="radio" name="answer" value="B">
            <label>C</label>
            <input type="radio" name="answer" value="C">
            <label>D</label>
            <input type="radio" name="answer" value="D"> 
            <button onclick="sendAnswer(); return false" type="submit"></button>
        `;
    }
    if (reply.questionType === "TEXT"){
        answerElement.innerHTML = `
            <input type="text" name="answer" required> 
            <button onclick="sendAnswer(); return false" type="submit"></button>
        `;
    }


}

async function sendAnswer() {
    let answer = document.answerForm.answer.value;
    if (answer.length === 0) {
        alert("gay");
    } else {
        let sessionID = sessionStorage.getItem('session-id');
        const reply = await fetch(`${TH_BASE_URL}answer?session=${sessionID}&answer=${answer}`)
        const json = await reply.json();
        if(json.status === "OK"){
            showQuestions();
        }else {
            alert(json.errorMessages[0]);
        }
    }
}

function canSkip(reply) {
    if (reply.canBeSkipped === true) {
        skipQuestion();
    }else {
        alert("Question cannot be skipped");
    }
}

async function skipQuestion() {
    const reply = await fetch(`${TH_BASE_URL}skip?session=${sessionID}`);
    const json = await reply.json();
}

async function showQuestions(){
    let sessionID = sessionStorage.getItem('session-id');
    console.log(sessionID);
    const reply = await fetch(`${TH_BASE_URL}question?session=${sessionID}`);
    const json = await reply.json();
    if(json.status === "OK"){
        Questions(json);
    }else {
        alert(json.errorMessages[0]);
    }
}