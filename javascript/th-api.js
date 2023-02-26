const TH_BASE_URL = "https://codecyprus.org/th/api/"; // the true API base url

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
        sessionStorage.setItem('id', uuid);
        sessionStorage.setItem('name', nameEl.value);
        location.href = "hunt.html";
    }
}

let id;

async function startSession() {
    userName = sessionStorage.getItem('name');
    id = id =sessionStorage.getItem('id');
    const url = TH_BASE_URL + "start"
    //get session id from session storage
    //send session id and name with async await (fetch)

    // const reply = await fetch(url, data={userName, id});
    const reply = await fetch(`${TH_BASE_URL}start?player=${userName}&app=Team4App&treasure-hunt-id=${id}`);
    //get reply
    const session = await reply.json();
    // const json = await reply.json(url, {
    //     method: "POST"
    // });
    console.log(session);
    showQuestions(session);
    //do accordingly
}

// because i have the n umber of questions i can now make a for loop to go through them all
async function showQuestions(sessionInfo){
    const url = TH_BASE_URL + "question";
    const reply = await fetch(`${url}?player=${userName}&app=Team4App&treasure-hunt-id=${id}`);
    const question = await reply.json();
    console.log(question);
}

