const tasksDOM = document.querySelector('.tasks');
const loadingDOM = document.querySelector('.loading-text');
const formDOM = document.querySelector('.task-form');
const taskInputDOM = document.querySelector('.task-input');
const formAlertDOM = document.querySelector('.form-alert');
const openHamDOM = document.querySelector('#openHam');
const closeHamDOM = document.querySelector('#closeHam');
const navigationItemsDOM = document.querySelector('#navigation-items');
// Load tasks from /api/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible'
  try {
    const {
      data: { tasks },
    } = await axios.get('/api/v1/tasks')
    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>'
      loadingDOM.style.visibility = 'hidden'
      return
    }
    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, name } = task;
        const buttonClass = completed ? 'undo-btn' : 'check-btn';
        const iconClass = completed ? 'fas fa-undo' : 'fas fa-check';
        return `<div class="single-task ${completed && 'task-completed'}">
<h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
<div class="task-links">

<!-- edit link -->
<a href="task.html?id=${taskID}"  class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- Completed/Undo link -->
<button type="button" class="${buttonClass}" data-id="${taskID}">
<i class="${iconClass}"></i>
</button>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
</div>
</div>`
      })
      .join('')
    tasksDOM.innerHTML = allTasks
  } catch (error) {
    console.error(error);
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
  loadingDOM.style.visibility = 'hidden'
}

showTasks()

// delete task /api/tasks/:id

tasksDOM.addEventListener('click', async (e) => {
  const el = e.target
  if (el.parentElement.classList.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible'
    const id = el.parentElement.dataset.id
    try {
      await axios.delete(`/api/v1/tasks/${id}`)
      showTasks()
    } catch (error) {
      console.log(error)
    }
  } else if (el.parentElement.classList.contains('check-btn')) {
    loadingDOM.style.visibility = 'visible';
    const id = el.parentElement.dataset.id;
    try {
      await axios.patch(`/api/v1/tasks/${id}`, { completed: true });
      el.parentElement.classList.add('task-completed');
      el.innerHTML = '<i class="fas fa-undo></i>"';
      el.classList.replace('check-btn', 'undo-btn');
      showTasks();
    } catch (error) {
      console.log(error);
    }
  } else if (el.parentElement.classList.contains('undo-btn')) {
    loadingDOM.style.visibility = 'visible';
    const id = el.parentElement.dataset.id;
    try {
      await axios.patch(`/api/v1/tasks/${id}`, { completed: false });
      el.parentElement.classList.remove('task-completed');
      // Change back to a "check" button
      el.innerHTML = '<i class="fas fa-check"></i>';
      el.classList.replace('undo-btn', 'check-btn');
      showTasks();
    } catch (error) {
      console.log(error);
    }
  }
  loadingDOM.style.visibility = 'hidden'
})

// form

formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const name = taskInputDOM.value

  try {
    await axios.post('/api/v1/tasks', { name })
    showTasks()
    taskInputDOM.value = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, task added`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})

// Controls visibility of elements
const hamburgerEvent = (nav, close, open) => {
  navigationItemsDOM.style.display = nav;
  closeHamDOM.style.display = close;
  openHamDOM.style.display = open;
}

openHamDOM.addEventListener('click', () => hamburgerEvent("flex", "block", "none"));
closeHamDOM.addEventListener('click', () => hamburgerEvent("none", "none", "block"));