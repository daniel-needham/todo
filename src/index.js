import { addDays, isToday, format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

const content = document.getElementById("content");

let recentProjectUUID = "";

const today = new Date();
const tomorrow = addDays(today, 1);

//json help
(function(){
    // Convert array to object
    var convArrToObj = function(array){
        var thisEleObj = new Object();
        if(typeof array == "object"){
            for(var i in array){
                var thisEle = convArrToObj(array[i]);
                thisEleObj[i] = thisEle;
            }
        }else {
            thisEleObj = array;
        }
        return thisEleObj;
    };
    var oldJSONStringify = JSON.stringify;
    JSON.stringify = function(input){
        if(oldJSONStringify(input) == '[]')
            return oldJSONStringify(convArrToObj(input));
        else
            return oldJSONStringify(input);
    };
})();

class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
        this.id = uuidv4();

        this.storeId = function () {
            let id = this.id;
            recentProjectUUID = id;
            console.log(recentProjectUUID)
        };

        this.storeId();
    }

    createTask(desc, due) {
        let task = new Task(desc, due);
        let array = this.tasks;
        array.push(task);
        data.save();
    }

    deleteTask(taskUUID) {
        let index = this.tasks.findIndex(k => k.id === taskUUID);
        if (index === -1) alert("task not found")
        this.tasks.splice(index, 1);

    }

    tasksNum() {
        let array = this.tasks;
        return array.length
    }

}

class Task {
    constructor(desc, due) {
        this.desc = desc;
        this.due = due;
        this.id = uuidv4();
        this.complete = false;
    }
}

//PROJECT MODULE

const projects = (() => {

    let projectArr = [];

    const getProjectArr = () => {
        return projectArr;
    }

    const setProjectArr = (arr) => {
        projectArr = arr;
    }

    const create = (name) => {
        let project = new Project(name);
        projectArr.push(project);
        data.save();
    }

    const find = (projectUUID) => {
        return projectArr.find(obj => obj.id === projectUUID);
    } //finds project based on UUID - object functions can then be used on it

    const del = (projectUUID) => {
        let index = projectArr.findIndex(obj => obj.id === projectUUID);
        if (index === -1) alert("project not found");
        console.log(index);
        projectArr.splice(index, 1);
    }


    return {
        getProjectArr,
        create,
        find,
        del,
        setProjectArr,
    }
})();

// DOM HANDLING

const dom = (() => {
    //holds new project dom item
    let newProjectNote = "";

    //deletes all from content container
    const del = () => {
        while (content.lastChild) content.removeChild(content.lastChild);
    }

    //loads home
    const loadHome = () => {
        let array = projects.getProjectArr();
        array.forEach(arrItem => {
            const project = createNote(arrItem);
        });
    }


    //create tasks elements inside project element
    const createTasks = (taskObj) => {
        let task = document.createElement("div");
        task.setAttribute("class", "task");
        for (let key in taskObj) {
            if (key === "id") {
                task.setAttribute("id", taskObj[key]);
                continue;
            }
            if (key === "desc") {
                let desc = document.createElement("p");
                desc.textContent = `${taskObj[key]}`;
                desc.setAttribute("class", "desc");
                task.appendChild(desc);
                continue;
            }
            if (key === "due") {
                let date = document.createElement("p");
                date.textContent = `${taskObj[key]}`;
                date.setAttribute("class", "due");
                task.appendChild(date);
                continue;
            }
            if (key === "complete") {
                let complete = document.createElement("input");
                complete.setAttribute("class", "complete");
                complete.setAttribute("type", "checkbox")
                if (taskObj[key] === true) {
                    complete.setAttribute("checked", "checked")
                    console.log("checked")
                }
                task.appendChild(complete);
                continue;
            }
        }
        return task;
    }

    //creates Project dom element
    const createNote = (project) => {
        let notepad = document.createElement("div");
        notepad.setAttribute("class", "project");
        let delBTN = document.createElement("button");
        delBTN.setAttribute("id", "delBTN");
        notepad.appendChild(delBTN);
        for (let key in project) {

            if (key === "id") {
                notepad.setAttribute("id", project[key]);
                continue;
            }
            if (key === "name") {
                let title = document.createElement("h2");
                title.textContent = `${project[key]}`;
                title.setAttribute("class", "title");
                notepad.appendChild(title);
                continue;
            }
            if (key === "tasks") {
                let arr = project[key];
                arr.forEach(taskObj => {
                    let task = createTasks(taskObj);
                    notepad.appendChild(task);
                });
            }
        }

        content.appendChild(notepad);

    }

    const enterProject = () => {
        del();
        let input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("id", "projectInput");
        let projectSubmitBTN = document.createElement("button");
        projectSubmitBTN.setAttribute("id", "projectSubmitBTN");
        content.appendChild(input);
        content.appendChild(projectSubmitBTN);


    }

    //project view
    const loadProjectView = (projectUUID) => {
        del();
        let projectObj = projects.find(projectUUID);
        let projectView = createNote(projectObj);
        projectView = document.getElementById(projectUUID);
        projectView.setAttribute("class", "projectView");
        let newBTN = document.createElement("button");
        newBTN.setAttribute("id", "newBTN");
        projectView.appendChild(newBTN);
        let closeBTN = document.createElement("button");
        closeBTN.setAttribute("id", "closeBTN");
        projectView.appendChild(closeBTN);
        
        //pushes projectUUID to a var so tasks can be added
        recentProjectUUID = projectUUID;

        //triggers event listener for this view
        listener.projectView();


    }


    const enterTask = () => {
        console.log("project enter fired");
        let project = document.getElementById(recentProjectUUID);

        let desc = document.createElement("input");
        desc.setAttribute("type", "text");
        desc.setAttribute("id", "desc");
        desc.setAttribute("class", "desc");
        let due = document.createElement("input");
        due.setAttribute("type", "date");
        due.setAttribute("id", "due");
        due.setAttribute("class", "due");
        let tmrw = format(tomorrow, "yyyy-mm-dd");
        due.setAttribute("value", tmrw);

        let enterBTN = document.createElement("button");
        enterBTN.setAttribute("id", "enterBTN");

        project.appendChild(desc);
        project.appendChild(due);
        project.appendChild(enterBTN);

    }

    const saveAddProject = () => {
        newProjectNote = document.getElementById("addProject");
    }

    const loadAddProject = () => {
        content.appendChild(newProjectNote);
    }

    return {
        del,
        loadProjectView,
        createNote,
        loadHome,
        enterProject,
        enterTask,
        saveAddProject,
        loadAddProject,
    }
})();

//EVENT LISTENERS

const listener = (() => {

    const maincontent = () => {
        content.addEventListener("click", (e) => {
            //



            //back to here tmrw - make just the header open the note ??? css hovertoo
            console.log(e.target.id);
            console.log(e.target.parentNode.id)

            //
            if (e.target.id === "plus" || e.target.id === "addProject") {
                console.log(e.target.id);
                dom.enterProject();
                listener.enterProject();
            }

            if (e.target.className === "project" ) { //|| e.target.parentNode.parentNode.className === "project"  
                console.log(e.target.id);
                console.log(e.target.parentNode.id);
                dom.loadProjectView(e.target.id);
            }


        },)
    }

    const navbar = () => {
        let nav = document.getElementById("header");
        nav.addEventListener("click", (e) => {
            if (e.target.id === "title") {
                console.log("navbar listener firing");
                dom.del();
                dom.loadAddProject();
                dom.loadHome();
            }
        })

    }

    const enterProject = () => {
        content.addEventListener("click", (e) => {
            if (e.target.id === "projectSubmitBTN") {
                console.log("submit");
                let projectName = document.getElementById("projectInput").value;
                projects.create([projectName]);
                dom.loadProjectView(recentProjectUUID);

            }
        })
    }


    let canAddTask = true; //only allows one task enter to open

    const projectView = () => {
        content.addEventListener("click", (e) => {
            if (e.target.id === "newBTN" && canAddTask) {
                dom.enterTask();
                canAddTask = false;
            }

            if (e.target.id === "enterBTN") {
                console.log("submit new task fired");
                let descInput = document.getElementById("desc").value;
                let dueInput = document.getElementById("due").value;
                //only if both have value will it submit
                if (descInput && dueInput) {
                    console.log("will submit  new task")
                    let thisProj = projects.find(recentProjectUUID);
                    thisProj.createTask(descInput, dueInput);
                    dom.loadProjectView(recentProjectUUID);
                    canAddTask = true;


                } else {
                    console.log("both must be entered");
                    // .setAttribute("class", "highlight");
                    
                }
                
            }
        })
    }




    return {
        maincontent,
        enterProject,
        navbar,
        projectView,
    }
})();


// DATA SAVING

const data = (() => {

    const save = () => {
        // let projectArr = projects.getProjectArr();
        // if (typeof (Storage) !== "undefined") {
        //     window.localStorage.setItem("projectArr", JSON.stringify(projectArr))
        // } else {
        //     alert("Local storage is not supported - changes will not be saved!")
        // }
    }

    const load = () => {
        // if (JSON.parse(window.localStorage.getItem("projectArr"))) {
        //     let arr = JSON.parse(window.localStorage.getItem("projectArr"));
        //     projects.setProjectArr(arr);
        // }
    }

    return {
        save,
        load,
    }
})();




(function init() {
    data.load();
    createDummys();
    dom.loadHome();
    dom.saveAddProject();
    listener.maincontent();
    listener.navbar();
})();

function createDummys() {
    projects.create("website");
 
    projects.create("book");
    projects.create("study");
}


