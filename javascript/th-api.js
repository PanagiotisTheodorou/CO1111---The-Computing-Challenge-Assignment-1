const TH_BASE_URL = "https://codecyprus.org/th/api/"; // the true API base url
let id;

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
        id = uuid;
        sessionStorage.setItem('id', uuid);
        sessionStorage.setItem('name', nameEl.value);
        location.href = "hunt.html";
    }
}

async function startSession() {
    userName = sessionStorage.getItem('name');
    const reply = await fetch(`${TH_BASE_URL}start?player=${userName}&app=Team4App&treasure-hunt-id=${id}`);
    const session = await reply.json();
    console.log(session);
}

async function showQuestions(){
    let sessionID = sessionStorage.getItem('id');
    const reply = await fetch(`${TH_BASE_URL}question?session=${sessionID}`);
    const json = await reply.json();
    console.log(json);
}