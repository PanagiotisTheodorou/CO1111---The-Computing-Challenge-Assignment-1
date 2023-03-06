const TH_BASE_URL = "https://codecyprus.org/th/api/"; // the true API base url
let treasureHuntID;

let currentQuestion;

async function doList() {

    const reply = await fetch(TH_BASE_URL + "list");
    const json = await reply.json();

    let treasureHuntsArray = json.treasureHunts;
    let listHtml = "<ul>";
    for (let i = 0; i < treasureHuntsArray.length; i++) {
        listHtml +=
            `<li><b>${treasureHuntsArray[i].name}</b><br/><i>
            ${treasureHuntsArray[i].description}</i><br/>
            <button type='submit' onclick='select("${treasureHuntsArray[i].uuid}");return false'>Select</button></li>
            `;
    }
    listHtml += "</ul>";

    document.getElementById("treasureHunts").innerHTML = listHtml;
}

let userName;

function select(uuid) {
    treasureHuntID = uuid;
    sessionStorage.setItem('treasure-hunt-id', uuid);
    modal.style.display = "block";
}

let modal = document.getElementById("modalForm");
// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
function closeModal() {
    modal.style.display = "none";
}
// When the user clicks anywhere outside the modal, close it
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

async function startSession() {
    let nameEl = document.getElementById("userName").value;
    let treasureID = sessionStorage.getItem('treasure-hunt-id');
    const reply = await fetch(`${TH_BASE_URL}start?player=${nameEl}&app=Team4App&treasure-hunt-id=${treasureID}`);
    const json = await reply.json();
    sessionStorage.setItem('session-id', json.session);
    console.log(json);

    if (json.status === "OK") {
        location.href = "hunt.html";
    } else {
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

    if (reply.currentQuestionIndex === reply.numOfQuestions) {
        answerElement.innerHTML = `
        <p>Congratulations, you have reached the end of the hunt</p>
        `;
        questionElement.innerHTML = "";
    } else {
        if (reply.questionType === "INTEGER") {
            answerElement.innerHTML = `
            <input type="number" name="answer" required> 
            <br>
            <p>Submit your answer by clicking the button: </p>
            <button onclick="sendAnswer(); return false" type="submit">Submit</button>
        `;
        }
        if (reply.questionType === "BOOLEAN") {
            answerElement.innerHTML = `
            <label>True</label>
            <input type="radio" name="answer" value="true">
            <label>False</label>
            <input type="radio" name="answer" value="false">
            <br>
            <p>Submit your answer by clicking the button: </p>
            <button onclick="sendAnswer(); return false" type="submit">Submit</button>
        `;
        }
        if (reply.questionType === "MCQ") {
            answerElement.innerHTML = `
            <label>A</label>
            <input type="radio" name="answer" value="A">
            <label>B</label>
            <input type="radio" name="answer" value="B">
            <label>C</label>
            <input type="radio" name="answer" value="C">
            <label>D</label>
            <input type="radio" name="answer" value="D"> 
            <br>
            <p>Submit your answer by clicking the button: </p>
            <button onclick="sendAnswer(); return false" type="submit">Submit</button>
        `;
        }
        if (reply.questionType === "TEXT") {
            answerElement.innerHTML = `
            <input type="text" name="answer" required> 
            <br>
            <p>Submit your answer by clicking the button: </p>
            <button onclick="sendAnswer(); return false" type="submit">Submit</button>
        `;
        }
    }
}

async function getScore() {
    let sessionID = sessionStorage.getItem('session-id');
    const reply = await fetch(`${TH_BASE_URL}score?session=${sessionID}`);
    const json = await reply.json();
    console.log(json);
    displayScore(json.score);
}

function displayScore(score) {
    let scoreElement = document.getElementById("score");

    scoreElement.innerHTML = `
        <p>Score: ${score}</p>
    `;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => sendPosition(position));
    } else {
        alert("Geolocation is not supported by your browser");
    }
}

async function sendPosition(position) {
    let sessionID = sessionStorage.getItem('session-id');
    const reply = await fetch(`${TH_BASE_URL}location?session=${sessionID}&latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`);
    const json = await reply.json();
    console.log(json);
}

async function sendAnswer() {
    let answer = document.answerForm.answer.value;
    if (answer.length === 0) {
        alert("Answer is not provided!!!");
    } else {
        if (currentQuestion.requiresLocation === true) {
            getLocation();
            console.log("answer");
        }
        let sessionID = sessionStorage.getItem('session-id');
        const reply = await fetch(`${TH_BASE_URL}answer?session=${sessionID}&answer=${answer}`);
        const json = await reply.json();
        if (json.status === "OK") {
            showQuestions();
        } else {
            alert(json.errorMessages[0]);
        }
    }
}

function canSkip() {
    if (currentQuestion.canBeSkipped === true) {
        skipQuestion();
    } else {
        alert("Question cannot be skipped");
    }
}

async function skipQuestion() {
    let sessionID = sessionStorage.getItem('session-id');
    const reply = await fetch(`${TH_BASE_URL}skip?session=${sessionID}`);
    const json = await reply.json();
    if (json.status === "OK") {
        showQuestions();
    } else {
        alert("Did not skip");
    }
}

let hasStarted = false;

async function showQuestions() {
    if (document.getElementById("showQuestions").style.display !== "none") {
        document.getElementById("showQuestions").style.display = "none";
    }
    if (!hasStarted) {
        setInterval(getLocation, 30001);
        hasStarted = true;
    }
    let sessionID = sessionStorage.getItem('session-id');
    console.log(sessionID);
    const reply = await fetch(`${TH_BASE_URL}question?session=${sessionID}`);
    const json = await reply.json();
    if (json.status === "OK") {
        currentQuestion = json;
        Questions(json);
        getScore();
        updateProgressBar(json.currentQuestionIndex, json.numOfQuestions);
    } else {
        alert(json.errorMessages[0]);
    }
}

function updateProgressBar(current, total) {
    let progress = document.getElementById("bar");
    let width = Math.round((current / total) * 100);
    progress.style.width = width + "%";
}

async function getLeaderboard() {
    let sessionID = sessionStorage.getItem('session-id');
    const reply = await fetch(`${TH_BASE_URL}leaderboard?session=${sessionID}&sorted=true&limit=10`);
    const json = await reply.json();
    if (json.status === "OK") {
        showLeaderboard(json);
    }else {
        alert("error");
    }
}

function showLeaderboard(reply) {
    let leaderboard = document.getElementById("leaderboard");
    let modalLeaderboard = document.getElementById("modalLeaderboard");
    for (let i=0; i<reply.limit - 1; i++) {
        leaderboard.innerHTML += `
           ${reply.leaderboard[i].player} - ${reply.leaderboard[i].score} - ${reply.leaderboard[i].completionTime}
    `;
    }
    modalLeaderboard.style.display = "block";
}

window.onclick = function (event) {
    let modalLeaderboard = document.getElementById("modalLeaderboard");
    if (event.target === modalLeaderboard) {
        modalLeaderboard.style.display = "none";
    }
}