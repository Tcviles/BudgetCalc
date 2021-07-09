const BASE_URL = "http://localhost:3000"
const BUDGET_URL = `${BASE_URL}/budgets`
const USER_URL = `${BASE_URL}/users`
const JOB_URL = `${BASE_URL}/jobs`
const DEBT_URL = `${BASE_URL}/debts`
const EXPENSE_URL = `${BASE_URL}/expenses`
const JSON_Headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }

function createDiv(classNames, idName = ""){
  let div = document.createElement("div")
  classNames.forEach(className => div.classList.add(className))
  div.id = idName

  return div
}

function createButton(className, buttonText, buttonEventFn=""){
  let button = document.createElement("button")
  button.classList.add(className)
  button.innerText = buttonText
  if (buttonEventFn != "") {
    button.onclick = clickEvent => buttonEventFn(clickEvent.target)
  }

  return button
}

function createParagraph(className, pText){
  let p = document.createElement("p")
  p.classList.add(className)
  p.innerText = pText

  return p
}

function createLi(id, liText) {
  let li = document.createElement("li")
  li.id = id
  li.innerText = liText

  return li
}

function createOption(value, type, text) {
  let option = document.createElement("option")
  option.setAttribute("type", type)
  option.setAttribute("value", value)
  option.innerText = text

  return option
}

function toggleHidden(form){
  if (form.classList.contains("hidden")) return form.classList.remove("hidden")
  if (!form.classList.contains("hidden")) return form.classList.add("hidden")
}

function showForm(form) {
  if (form.classList.contains("hidden")) return form.classList.remove("hidden")
}

function hideForm(form){
  if (!form.classList.contains("hidden")) return form.classList.add("hidden")
}