//https://docs.djangoproject.com/en/4.1/howto/csrf/#using-csrf-protection-with-ajax
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


let csrftoken = getCookie('csrftoken');

// update the status of task
document.addEventListener('click', function (e) {
    if (Array.from(e.target.classList).includes('status')) {
        let fetchOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
            body: JSON.stringify({ id: e.target.getAttribute("name").split("task-")[1], status: e.target.checked ? "True" : "False" })
        };
        fetch('/task/update/', fetchOptions)
            .then(response => response.json())
            .then(data => {
                if(data.success)
                    updateTaskList()
            } );
    } 
}, false);

// request to delete the task
document.addEventListener('click', function (e) {
    if (Array.from(e.target.classList).includes('delete-button')) {
        let fetchOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
            body: JSON.stringify({ id: e.target.parentElement.getAttribute("id").split("task-")[1] })
        };
        fetch('/task/delete/', fetchOptions)
            .then(response => response.json())
            .then(data => {
                if(data.success)
                    updateTaskList()
            });
    } 
}, false);


function updateTaskList() {
    fetch('/task/get-tasks/')
    .then(response => response.json())
    .then(data => {
        let domString = "<ul>";
        data.forEach(task => {
            domString += `
                <li class="card ` + (task.fields.status == "Complete" ? 'completed' : '') + `" id="task-${task.pk}">
                    <div class="task-info">
                        <span><input type="checkbox" name="task-${task.pk}" class="status" ` + (task.fields.status == "Complete" ? 'checked' : '') + `/> ${task.fields.detail} </span>
                        <span class="task-category">${task.fields.category}</span>
                    </div>
                    <span class="delete-button">X</span>
                </li>
            `;
        });
        domString += "</ul>";
        document.querySelector(".list-section").innerHTML = domString;
    } );
    displayChart();
}


function displayChart() {
    
    fetch("/task/get-chart-data")
    .then(response => response.json())
    .then(dataArr => {

        chart.options.data[0].dataPoints = [];
        chart.options.data[1].dataPoints = [];

        dataArr.forEach(data => {
            chart.options.data[0].dataPoints.push({ label: data["category"], y: data["complete"] })
            chart.options.data[1].dataPoints.push({ label: data["category"], y: data["incomplete"] })
        });

        chart.render()
    })
}

var dps = { "complete": [], "incomplete": []}, chart;

chart = new CanvasJS.Chart("chartContainer", {
    theme: "light2",
    animationEnabled: true,
    title: {
      text: "Task Status Based on Category"
    },
    toolTip: {
        shared: true
    },
    data:[{
        name: "Complete",
        type: "stackedColumn100",
        showInLegend: true,
        dataPoints: dps["complete"]
    },{
        name: "Incomplete",
        type: "stackedColumn100",
        showInLegend: true,
        dataPoints: dps["incomplete"]
    }]
});

displayChart();








