const app = document.querySelector("#app");
const formFind = document.querySelector(".js-task-adding-form");
const apikey = "0fe3a39f-e3bf-44a6-9241-c2b270466550";

function renderTasks(id, title, status, description){
    let totalTime = 0;
    let section = document.createElement("section");
    section.className = "card mt-5 shadow-sm";
    app.appendChild(section);

    let divHeader = document.createElement("div");
    divHeader.className = "card-header d-flex justify-content-between align-items-center";
    section.appendChild(divHeader);

    let divTitle = document.createElement("div");
    divHeader.appendChild(divTitle);

    let h5 = document.createElement("h5");
    h5.innerText = title;
    divTitle.appendChild(h5);

    let h6 = document.createElement("h6");
    h6.className = "card-subtitle text-muted";
    h6.innerText = description;
    divTitle.appendChild(h6);

    let divButton = document.createElement("div");
    divHeader.appendChild(divButton);
    if(status=="open") {

        let finButton = document.createElement("button");
        finButton.className = "btn btn-dark btn-sm js-task-open-only";
        finButton.innerText = "Finish";
        divButton.appendChild(finButton);

        finButton.addEventListener("click",function (event){
            divButton.style.visibility = "hidden";

            let divSure = document.createElement("div");
            divHeader.appendChild(divSure);

            let sureButton = document.createElement("button");
            sureButton.className = "btn btn-outline-success mr-2";
            sureButton.innerText = "Finish";
            divSure.appendChild(sureButton);

            let cancelButton = document.createElement("button");
            cancelButton.className = "btn btn-outline-warning";
            cancelButton.innerText = "Cancel";
            divSure.appendChild(cancelButton);

            cancelButton.addEventListener("click",function (event){
                divSure.parentElement.removeChild(divSure);
                divButton.style.visibility = "visible";
            });
            sureButton.addEventListener("click",function (event){
                apiUpdateTask(id,title,description,"closed").then(function (){
                    section.querySelectorAll(".js-task-open-only").forEach(function (element){
                        element.parentElement.removeChild(element);
                    })})
                divSure.parentElement.removeChild(divSure);
                divButton.style.visibility = "visible";
            })
        });
        let editButton = document.createElement("button");
        editButton.className = "btn btn-outline-info btn-sm js-task-open-only ml-2";
        editButton.innerText = "Edit";
        divButton.appendChild(editButton);

        editButton.addEventListener("click",function (event){
            divButton.style.visibility = "hidden"

            let divFormEdit = document.createElement("div")
            divHeader.appendChild(divFormEdit)

            let formEdit = document.createElement("form");
            divFormEdit.appendChild(formEdit)

            let divInput = document.createElement("div");
            divInput.className = "form-group";
            formEdit.appendChild(divInput);

            let firstInDiv = document.createElement("div");
            firstInDiv.className = "form-group";
            divInput.appendChild(firstInDiv);

            let inputTitle = document.createElement("input");
            inputTitle.type = "text";
            inputTitle.minLength = 5;
            inputTitle.placeholder = "Task title";
            firstInDiv.appendChild(inputTitle);

            let secondInDiv = document.createElement("div");
            divInput.appendChild(secondInDiv);

            let inputDesc = document.createElement("input");
            inputDesc.type = "text";
            inputDesc.placeholder = "Task description";
            secondInDiv.appendChild(inputDesc);

            let divBut = document.createElement("div");
            formEdit.appendChild(divBut);

            let butEdit = document.createElement("button");
            butEdit.innerText = "Submit";
            butEdit.className = "btn btn-outline-success btn-sm mr-2";
            divBut.appendChild(butEdit);

            let butCancel = document.createElement("button");
            butCancel.innerText = "Cancel";
            butCancel.className = "btn btn-outline-danger btn-sm mr-2";
            divBut.appendChild(butCancel);
            butEdit.addEventListener("click",function (event){
                event.preventDefault();
                divFormEdit.parentElement.removeChild(divFormEdit);
                divButton.style.visibility = "visible";
                apiUpdateTask(id,inputTitle.value,inputDesc.value).then(function (response){
                    h5.innerText = response.data.title;
                    h6.innerText = response.data.description
                })
            })
            butCancel.addEventListener("click",function (event){
                event.preventDefault();
                divFormEdit.parentElement.removeChild(divFormEdit);
                divButton.style.visibility = "visible";
            })});
    };
    let delButton = document.createElement("button");
    delButton.className = "btn btn-outline-danger btn-sm ml-2";
    delButton.innerText = "Delete";
    divButton.appendChild(delButton);

    delButton.addEventListener("click", function() {
        divButton.style.visibility = "hidden";

        let divSure = document.createElement("div");
        divHeader.appendChild(divSure);

        let sureButton = document.createElement("button");
        sureButton.className = "btn btn-outline-success mr-2";
        sureButton.innerText = "Delete";
        divSure.appendChild(sureButton);

        let cancelButton = document.createElement("button");
        cancelButton.className = "btn btn-outline-warning";
        cancelButton.innerText = "Cancel";
        divSure.appendChild(cancelButton);

        cancelButton.addEventListener("click",function (event){
            divSure.parentElement.removeChild(divSure);
            divButton.style.visibility = "visible";
        });
        sureButton.addEventListener("click",function (event){
            apiDeleteTask(id).then(function() {
                section.parentElement.removeChild(section);
            })
            divSure.parentElement.removeChild(divSure);
            divButton.style.visibility = "visible";
        })});

    let ul = document.createElement("ul");
    ul.className = "list-group list-group-flush";
    section.appendChild(ul);

    apiListOperationsForTask(id).then(function(response) {
        return new Promise(function (resolve,reject){
            let totalTimeTask = 0;
            response.data.forEach(function(operation){
                renderOperation(ul, operation.description,operation.timeSpent,operation.id,status);
                totalTimeTask +=operation.timeSpent;
            })
            resolve(totalTimeTask);
        })})
    if(status=="open") {
        let divS = document.createElement("div");
        divS.className = "card-body js-task-open-only";
        section.appendChild(divS);

        let form = document.createElement("form");
        divS.appendChild(form);

        let divForm = document.createElement("div");
        divForm.className = "input-group";
        form.appendChild(divForm);

        let input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Operation description";
        input.className = "form-control";
        input.minLength = 5;
        divForm.appendChild(input);

        form.addEventListener("submit",function (event){
            event.preventDefault();
            let desc = input.value;
            input.value = "";
            apiCreateOperationForTask(id,desc).then(function (response){
                renderOperation(ul,response.data.description,response.data.timeSpent,response.data.id,"open");
            })});
        let divButtForm = document.createElement("div");
        divButtForm.className = "input-group-append";
        divForm.appendChild(divButtForm);

        let infoButton = document.createElement("button");
        infoButton.className = "btn btn-info";
        infoButton.innerText = "Add";
        divButtForm.appendChild(infoButton);
    }};
function renderTime(time){
    let h = Math.floor(time/60);
    return h+"h"+" "+(time-h*60)+"m";
};
function renderOperation(ul, name, time, id,status) {

    let newLi = document.createElement("li");
    newLi.className = "list-group-item d-flex justify-content-between align-items-center";
    ul.appendChild(newLi);

    let divF = document.createElement("div");
    divF.innerText = name;
    newLi.appendChild(divF);

    let span = document.createElement("span");
    span.className = "badge badge-success badge-pill ml-2 ";
    span.innerText = renderTime(time);
    divF.appendChild(span);

    let divButton = document.createElement("div");
    divButton.className = "js-task-open-only";
    newLi.appendChild(divButton);
    if (status=="open") {
        let button0h = document.createElement("button");
        button0h.className = "btn btn-outline-warning btn-sm mr-2 js-task-open-only"
        button0h.innerText = "0h";
        divButton.appendChild(button0h);

        button0h.addEventListener("click",function (event){
            time = 0;
            apiUpdateOperation(id, name, time).then(function (response){
                span.innerText = renderTime(response.data.timeSpent);
                time = response.data.timeSpent;
            })});

        let button15m = document.createElement("button");
        button15m.className = "btn btn-outline-success btn-sm mr-2 js-task-open-only";
        button15m.innerText = "+15m";
        divButton.appendChild(button15m);

        button15m.addEventListener("click", function (event) {
            apiUpdateOperation(id, name, time + 15).then(function (response) {
                span.innerText = renderTime(response.data.timeSpent);
                time = response.data.timeSpent;
            })});

        let button1h = document.createElement("button");
        button1h.className = "btn btn-outline-success btn-sm mr-2 js-task-open-only";
        button1h.innerText = "+1h";
        divButton.appendChild(button1h);

        button1h.addEventListener("click", function (event) {
            apiUpdateOperation(id, name, time + 60).then(function (response) {
                span.innerText = renderTime(response.data.timeSpent);
                time = response.data.timeSpent;
            })});

        let buttonEdit = document.createElement("button");
        buttonEdit.className = "btn btn-outline-info js-task-open-only btn-sm mr-2";
        buttonEdit.innerText = "Edit";
        divButton.appendChild(buttonEdit);

        buttonEdit.addEventListener("click",function (event){
            divButton.style.visibility = "hidden";

            let divFormEdit = document.createElement("div")
            newLi.appendChild(divFormEdit)

            let formEdit = document.createElement("form");
            divFormEdit.appendChild(formEdit)

            let inputEdit = document.createElement("input");
            inputEdit.type = "text";
            inputEdit.className = "mr-2"
            inputEdit.minLength = 5;
            inputEdit.placeholder = "Operation description";
            formEdit.appendChild(inputEdit);

            let butEdit = document.createElement("button");
            butEdit.innerText = "Yes";
            butEdit.className = "btn btn-outline-success btn-sm mr-2";
            formEdit.appendChild(butEdit);

            let butCancel = document.createElement("button");
            butCancel.innerText = "No";
            butCancel.className = "btn btn-outline-danger btn-sm mr-2";
            formEdit.appendChild(butCancel);
            butEdit.addEventListener("click",function (event){
                event.preventDefault();
                divFormEdit.parentElement.removeChild(divFormEdit);
                divButton.style.visibility = "visible";
                apiUpdateOperation(id,inputEdit.value).then(function (response){
                    divF.innerText = response.data.description;
                    span.innerText = renderTime(time);
                    divF.appendChild(span);
                })
            })
            butCancel.addEventListener("click",function (event){
                event.preventDefault();
                divFormEdit.parentElement.removeChild(divFormEdit);
                divButton.style.visibility = "visible";
            })});

        let buttonDel = document.createElement("button");
        buttonDel.className = "btn btn-outline-danger btn-sm js-task-open-only";
        buttonDel.innerText = "Delete";
        divButton.appendChild(buttonDel);

        buttonDel.addEventListener("click", function (event) {
            apiDeleteOperation(id).then(function () {
                ul.removeChild(newLi);
            });
        })}};

function apiListOperationsForTask(id) {
    return fetch("https://todo-api.coderslab.pl/api/tasks/"+id+"/operations", {
        method: 'GET',
        headers: {
            Authorization: apikey,}
    }).then(function (resp) {
        if(!resp.ok) {
            console.log("error");
        }return resp.json();
    })};
function apiListTasks() {
    return fetch("https://todo-api.coderslab.pl/api/tasks", {
        headers: {
            Authorization: apikey,}
    }).then(function (resp) {
        if(!resp.ok) {
            console.log("error");
        }return resp.json();
    })};
function apiCreateTask(title, description) {
    return fetch("https://todo-api.coderslab.pl/api/tasks/", {
        headers: {
            Authorization: apikey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, description: description, status: 'open' }),
        method: 'POST'
    }).then(function(resp) {
        if(!resp.ok) {
            console.log("error");
        }return resp.json();
    })};
function apiDeleteTask(taskId) {
    return fetch("https://todo-api.coderslab.pl/api/tasks/" + taskId, {
        headers: {
            Authorization: apikey },
        method: 'DELETE'
    }).then(function (resp) {
        if(!resp.ok) {
            console.log("error");
        }return resp.json();
    })};
function apiDeleteOperation(operationId){
    return fetch("https://todo-api.coderslab.pl/api/operations/" + operationId, {
        headers: {
            Authorization: apikey },
        method: "DELETE"
    }).then(function (resp) {
        if(!resp.ok) {
            console.log("error");
        }return resp.json();
    })};
function apiCreateOperationForTask(id, description){
    return fetch("https://todo-api.coderslab.pl/api/tasks/"+id+"/operations", {
        headers: {
            Authorization: apikey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description, timeSpent: 0 }),
        method: 'POST'
    }).then(function(resp) {
        if(!resp.ok) {
            console.log("error");
        }return resp.json();
    })};
function apiUpdateOperation(id, description, timeSpent){
    return fetch("https://todo-api.coderslab.pl/api/operations/"+id, {
        headers: {
            Authorization: apikey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description, timeSpent: timeSpent }),
        method: 'PUT'
    }).then(function(resp) {
        if(!resp.ok) {
            console.log("error");
        }return resp.json();
    })};
function apiUpdateTask(id, title, description, status){
    return fetch("https://todo-api.coderslab.pl/api/tasks/"+id, {
        headers: {
            Authorization: apikey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, description: description, status: status }),
        method: 'PUT'
    }).then(function(resp) {
        if(!resp.ok) {
            console.log("error");
        }
        return resp.json();
    })};
formFind.addEventListener("submit",function (event){
    event.preventDefault();
    let title = formFind.title.value;
    let description = formFind.description.value;
    formFind.title.value = "";
    formFind.description.value = "";
    apiCreateTask(title, description).then(function(response) {
        renderTasks(response.data.id, response.data.title, response.data.status, response.data.description);
    })});
apiListTasks().then(function(response) {
    response.data.forEach(function(task) {
        renderTasks(task.id, task.title, task.status, task.description);
    })});




