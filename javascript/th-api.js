const TH_BASE_URL = "https://codecyprus.org/th/api/"; // the true API base url

async function doList() {

    const reply = await fetch(TH_BASE_URL + "list");
    const json = await reply.json();

    let treasureHuntsArray = json.treasureHunts;
    let listHtml = "<ul>";
    for(let i = 0; i < treasureHuntsArray.length; i++) {
        listHtml +=
            "<li>" + "<b>" + treasureHuntsArray[i].name + "</b><br/>" + "<i>" + treasureHuntsArray[i].description + "</i><br/>" + "<a href=\"javascript:select(\'" + treasureHuntsArray[i].uuid + "\')\">Start</a>" + "</li>";
    }
    listHtml += "</ul>";

    document.getElementById("treasureHunts").innerHTML = listHtml;
}


