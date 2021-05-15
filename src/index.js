import { addDays, isToday, format, parseISO, } from "date-fns";
import { v4 as uuidv4 } from "uuid";

const content = document.getElementById("content");

let recentProjectUUID = "";

const today = new Date();
const tomorrow = addDays(today, 1);
console.log(tomorrow);
let tmrw = format(tomorrow, "yyyy-MM-dd");
console.log(tmrw);

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

    // createTask(desc, due) {
    //     let task = new Task(desc, due);
    //     let array = this.tasks;
    //     array.push(task);
    //     data.save();
    // }

    // deleteTask(taskUUID) {
    //     let index = this.tasks.findIndex(k => k.id === taskUUID);
    //     if (index === -1) alert("task not found")
    //     this.tasks.splice(index, 1);

    // }

    // tasksNum() {
    //     let array = this.tasks;
    //     return array.length
    // }

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
        data.save()
        dom.tracker();
    }

    const create = (name) => {
        let project = new Project(name);
        projectArr.unshift(project);
        data.save();
        dom.tracker();
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

    const createTask = (projectUUID, desc, due) => {
        let project = projectArr.find(obj => obj.id === projectUUID); //find project
        let task = new Task(desc, due);
        let array = project.tasks;
        array.unshift(task);
        data.save();
        dom.tracker();
    }


    const findTask = (projectUUID, taskUUID) => {
        let project = projectArr.find(obj => obj.id === projectUUID);
        let tasksArr = project.tasks;
        let task = tasksArr.find(obj => obj.id === taskUUID);
        return task;

    }
    const toggleCompTask = (projectUUID, taskUUID) => {
        let task = findTask(projectUUID, taskUUID);
        task.complete = task.complete ? task.complete = false : task.complete = true;
        console.log(task);
        data.save();
        dom.tracker();
    }

    const snooze = (projectUUID, taskUUID) => {
        let task = findTask(projectUUID, taskUUID);
        console.log(task);
        let nextDay = addDays(parseISO(task.due), 1);
        task.due = format(nextDay, "yyyy-MM-dd")
        data.save();
        dom.tracker();

    }

    const returnCompTasks = () => {
        let totalTasks = 0;
        let completedTasks = 0;
        projectArr.forEach(obj => {
            let tasks = obj.tasks;
            totalTasks += tasks.length;
            console.log(tasks.length);
            tasks.forEach(obj => {
                if (obj.complete === true) completedTasks += 1;
            });
        });

        return `${completedTasks} / ${totalTasks} completed`
        // return completedTasks + " / " + totalTasks + " completed";
    }



    return {
        getProjectArr,
        create,
        find,
        del,
        setProjectArr,
        createTask,
        toggleCompTask,
        snooze,
        returnCompTasks,
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
                let unformattedDate = parseISO(taskObj[key]);
                date.textContent = `${format(unformattedDate, "dd/MM/yyyy")}`;
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
                    task.setAttribute("class", "task strikethrough");
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
        delBTN.setAttribute("class", "delBTN");
        notepad.appendChild(delBTN);
        let title = document.createElement("h2"); //create title so i can add uuid to id
        for (let key in project) {

            if (key === "name") {
                title.textContent = `${project[key]}`;
                title.setAttribute("class", "title");
                notepad.appendChild(title);
                continue;
            }
            if (key === "id") {
                notepad.setAttribute("id", project[key]);
                title.setAttribute("id", project[key]);
                delBTN.setAttribute("id", project[key]);
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
        projectSubmitBTN.setAttribute("class", "hvr-forward");
        projectSubmitBTN.textContent = "create"
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


    }


    const enterTask = () => {
        console.log("project enter fired");
        let project = document.getElementById(recentProjectUUID);
        const holder = document.createElement("div");
        holder.setAttribute("class", "task")

        const desc = document.createElement("input");
        desc.setAttribute("type", "text");
        desc.setAttribute("id", "desc");
        desc.setAttribute("class", "desc");
        const due = document.createElement("input");
        due.setAttribute("type", "date");
        due.setAttribute("id", "due");
        due.setAttribute("class", "due");

        due.setAttribute("value", tmrw);

        const enterBTN = document.createElement("button");
        enterBTN.setAttribute("id", "enterBTN");

        holder.appendChild(desc);
        holder.appendChild(due);
        holder.appendChild(enterBTN);

        let firstChild = project.firstChild;
        firstChild.before(holder);


    }

    const saveAddProject = () => {
        newProjectNote = document.getElementById("addProject");
    }

    const loadAddProject = () => {
        content.appendChild(newProjectNote);
    }

    const refreshHome = () => {
        del();
        loadAddProject();
        loadHome();
    }

    const tracker = () => {
        let tracker = document.getElementById("tracker");
        tracker.textContent = projects.returnCompTasks();
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
        refreshHome,
        tracker,
    }
})();

//EVENT LISTENERS

const listener = (() => {

    const mainContent = () => {
        content.addEventListener("click", (e) => {

            if (e.target.id === "plus" || e.target.id === "addProject") {
                console.log(e.target.id);
                dom.enterProject();
            }

            if (e.target.className === "project" || e.target.className === "title") { //|| e.target.parentNode.parentNode.className === "project"  
                console.log(e.target.id);
                console.log(e.target.parentNode.id);
                dom.loadProjectView(e.target.id);
            }

            //delete button - works for project view too
            if (e.target.className === "delBTN") {
                console.log("delete button fired");
                projects.del(e.target.id);
                dom.refreshHome();
                canAddTask = true;
                data.save();
                dom.tracker();

            }


        })
    }

    const navbar = () => {
        let nav = document.getElementById("header");
        nav.addEventListener("click", (e) => {
            if (e.target.id === "title") {
                console.log("navbar listener firing");
                dom.refreshHome();
                canAddTask = true;
            }
            if (e.target.id === "reset") {
                console.log("reset");
                projects.setProjectArr([]);
                dom.refreshHome();
                canAddTask = true;
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
            if (e.target.id === "newBTN" && canAddTask) { //opens input to open task
                dom.enterTask();
                canAddTask = false;
            }

            if (e.target.id === "enterBTN") {               //creates new task on submit btn
                console.log("submit new task fired");
                let descInput = (document.getElementById("desc")).value;
                let dueInput = (document.getElementById("due")).value;
                console.log(dueInput);
                //only if both have value will it submit
                if (descInput && dueInput) {
                    console.log("will submit  new task")
                    projects.createTask(recentProjectUUID, descInput, dueInput);
                    dom.loadProjectView(recentProjectUUID);
                    canAddTask = true;

                    //test
                    console.log(projects.find(recentProjectUUID));


                } else {
                    console.log("both must be entered");
                    // .setAttribute("class", "highlight");

                }
            }

            //close button
            if (e.target.id === "closeBTN") {
                console.log("close project button fired");
                dom.refreshHome();
                canAddTask = true;
            };

            //checkbox 
            if (e.target.className === "complete") {
                let taskUUID = e.target.parentNode.id;
                let projectUUID = e.target.parentNode.parentNode.id;
                projects.toggleCompTask(projectUUID, taskUUID);
            }

            //click on date snoozes by day
            if (e.target.className === "due") {
                let taskUUID = e.target.parentNode.id;
                let projectUUID = e.target.parentNode.parentNode.id;
                projects.snooze(projectUUID, taskUUID);
                dom.refreshHome();

            }


        })
    }

    const all = () => {
        mainContent();
        enterProject();
        navbar();
        projectView();
    }



    return {
        mainContent,
        enterProject,
        navbar,
        projectView,
        all,
    }
})();


// DATA SAVING

const data = (() => {

    const save = () => {
        let projectArr = projects.getProjectArr();
        if (typeof (Storage) !== "undefined") {
            window.localStorage.setItem("projectArr", JSON.stringify(projectArr))
        } else {
            alert("Local storage is not supported - changes will not be saved!")
        }
    }

    const load = () => {
        if (JSON.parse(window.localStorage.getItem("projectArr"))) {
            let arr = JSON.parse(window.localStorage.getItem("projectArr"));
            projects.setProjectArr(arr);
        } else {
            projects.create("Add tasks to me!");
        }
    }

    return {
        save,
        load,
    }
})();




(function init() {
    data.load();
    dom.loadHome();
    dom.saveAddProject();
    listener.all();
})();




