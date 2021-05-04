import {addDays} from "date-fns";
import {v4 as uuidv4} from "uuid";

const content = document.getElementById("content");

const date = new Date();

const tomorrow = addDays(date, 1)
console.log(date);

class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
        this.id = "11";
        // uuidv4();
    }

    createTask(desc, due) {
        let task = new Task(desc, due);
        let array = this.tasks;
        array.push(task);
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

    const create = (name) => {
        let project = new Project(name);
        projectArr.push(project);
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
    }
})();

const dom = (() => {

    //deletes all from content container
    const del = () => {
        while(content.lastChild) content.removeChild(content.lastChild);
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

    const loadHome = () => {
        let array = projects.getProjectArr();
        array.forEach(arrItem => {
            const project = createNote(arrItem);
        });


    }

    

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

       

    }

    return {
        del,
        loadProjectView,
        createNote,
        loadHome,
    }
})();

const listener = (() => {
    
    const maincontent = () => {
        content.addEventListener("click", (e) => {
            if (e.target.class === "addProject" || "plus") {
                console.log("change page")
                dom.loadTaskView();
            }
        })
    }

    return {
        maincontent,
    }
})();



projects.create("website");
projects.create("project");






console.log(projects.getProjectArr());

console.log(projects.find("11"));

let steve = projects.find("11");

steve.createTask("ok one tow", "19/02/12");
steve.createTask("ok one tow", "19/02/12");
steve.createTask("ok one tow", "19/02/12");


dom.loadHome();

dom.loadProjectView("11");


// projects.find.createTask("hello", "13/07/20", "HI");
