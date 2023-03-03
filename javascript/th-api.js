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
        location.href = "hunt.html";
    }
}

async function startSession(treasureHuntID, playerName) {
    const reply = await fetch(`${TH_BASE_URL}start?player=${playerName}&app=Team4App&treasure-hunt-id=${treasureHuntID}`);
    const session = await reply.json().session;
    sessionStorage.setItem('session-id', session);
    console.log(session);
}

async function showQuestions(){
    let sessionID = sessionStorage.getItem('session-id');
    console.log(sessionID);
    const reply = await fetch(`${TH_BASE_URL}question?session=${sessionID}`);
    const json = await reply.json();
    console.log(json);
}