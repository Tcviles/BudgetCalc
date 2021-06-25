const BASE_URL = "http://localhost:3000"
const BUDGET_URL = `${BASE_URL}/budgets`
const USER_URL = `${BASE_URL}/users`
const JOB_URL = `${BASE_URL}/jobs`
const DEBT_URL = `${BASE_URL}/debts`
const EXPENSE_URL = `${BASE_URL}/expenses`

const mainBody = document.querySelector("main")
const budgetCard = document.querySelector(".budgetCard")
const budgetTitleDiv = document.querySelector(".budgetTitle")
const incomeDiv = document.querySelector(".incomeCard")
const usersDiv = document.querySelector(".usersCard")
const debtDiv = document.querySelector(".debtCard")
const expensesDiv = document.querySelector(".expenseCard")

function createDiv(className, idName = ""){
  let div = document.createElement("div")
  div.classList.add(className)
  div.id = idName

  return div
}

function createButton(className, buttonText, buttonEventFn){
  let button = document.createElement("button")
  button.classList.add(className)
  button.innerText = buttonText
  button.onclick = clickEvent => buttonEventFn(clickEvent.target)

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

function createInput(className, type="text", inputName="", value= "", placeholder = "") {
  let input = document.createElement("input")
  input.classList.add(className)
  input.type = type
  input.name = inputName
  input.value = value
  input.placeholder = placeholder

  return input
}

function createForm(className, formHeadingText, inputs) {
  let form = document.createElement("form")
  form.classList.add(className)

  let formHeading = document.createElement("h3")
  formHeading.innerText = formHeadingText
  form.append(formHeading)

  inputs.forEach(input => form.append(input))

  return form
}

function getId(element){
  let id = ""
  while (element.id == "") {
    element = element.parentElement
  }
  return element.id
}

function generateBudgets() {
  mainBody.innerHTML = ""

  fetch(BUDGET_URL)
  .then(res=>res.json())
  .then(json=>json.forEach(budgetInfo=>{
    new Budget(budgetInfo)
  }))
}

class Budget {
  constructor (budgetInfo) {
    this.id = budgetInfo.id
    this.priority = budgetInfo.priority
    this.users = budgetInfo.users
    this.debts = budgetInfo.debts
    this.expenses = budgetInfo.expenses
    this.generateBudgetCard()
  }

  generateBudgetCard(){  
    budgetCard.id = this.id
    this.generateBudgetTitle()
    budgetCard.append(this.generateIncomeCard())
    budgetCard.append(this.generateDebtCard())
    budgetCard.append(this.generateExpenseCard())
    
    mainBody.append(budgetCard)
  }

  generateBudgetTitle(){
    budgetTitleDiv.append(createParagraph("budgetTitle","What is this budgets priority?"))
    budgetTitleDiv.append(createButton("priority", this.priority, this.togglePriority, this))

    budgetCard.append(budgetTitleDiv)
  }
  
  togglePriority(event) {
    let updateBudgetUrl = `${BUDGET_URL}/${getId(event)}`
    if (event.innerText == "Interest") {
      event.innerText = "Payoff"
    } else {
      event.innerText = "Interest"
    }

    let formData = {
      "priority": event.innerText,
    };
  
    let configObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    }
  
    return fetch(updateBudgetUrl,configObj)
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(error => alert("There was an error: "+error.message+"."));
  }

  generateIncomeCard() {
    incomeDiv.append(createParagraph("totalIncome", `Total Income - ${this.users.reduce((a,b)=>parseInt(a.income) + parseInt(b.income))}`))
    incomeDiv.append(this.generateUsersCard())
    incomeDiv.append(createButton("addUser", "Add Income User", this.toggleUserForm, this))
    incomeDiv.append(this.createNewUserForm())

    return incomeDiv
  }

  generateUsersCard() {
    this.users.forEach (userInfo => {
      new User(userInfo.id, userInfo.name, userInfo.jobs, this.id)
    })

    return usersDiv
  }

  toggleUserForm() {
    const newUserForm = document.getElementById("newUserForm")
    
    if (newUserForm.classList.contains("hidden")) {
      incomeDiv.style.gridTemplateRows = "70px auto 30px auto"
      newUserForm.classList.remove("hidden")
    } else {
      incomeDiv.style.gridTemplateRows = "70px auto 30px"
      newUserForm.classList.add("hidden")
    }
  }

  createNewUserForm(){
    let userFormContainer = createDiv("formContainer")
    userFormContainer.id = "newUserForm"
    userFormContainer.classList.add("hidden")

    let nameInput = createInput("input-text","text","name","","Enter the new users name...")
    let submitUser = createInput("submitNewUser", "submit", "submit", "Submit New User!")
    
    let userForm = createForm("addUserForm","Add a new user!", [nameInput,submitUser])
    userFormContainer.append(userForm)
    
    userFormContainer.addEventListener('submit', newUserEvent => {
      newUserEvent.preventDefault()
      let newUserName = newUserEvent.target.name.value;
      if (newUserName) {
        new User("",newUserName, [], this.id)
        this.toggleUserForm()
      }
    })
    return userFormContainer
  }

  generateDebtCard(){
    debtDiv.append(this.generateInnerDebtDiv())
    debtDiv.append(createButton("addDebt", "Add A Debt", this.addDebt, this))

    return debtDiv
  }

  generateInnerDebtDiv() {
    let innerDebtDiv = createDiv("innerDebtDiv")
    innerDebtDiv.append(createParagraph("debts","Debts / Loan Payments with Balance"))

    let debtList = document.createElement("ul")

    this.debts.forEach (debtInfo => {
      debtList.append(new Debt(debtInfo).generateDebtItem())
    })

    innerDebtDiv.append(debtList)

    return innerDebtDiv
  }

  addDebt(event, budgetObj) {
    console.log(event.target)
  }

  generateExpenseCard(){
    expensesDiv.append(this.generateInnerExpenseDiv())
    expensesDiv.append(createButton("addExpense", "Add Expense", this.addExpense, this))

    return expensesDiv
  }

  generateInnerExpenseDiv() {
    let innerExpenseDiv = createDiv("innerExpenseDiv")
    innerExpenseDiv.append(createParagraph("expenses","Expenses / Subscription Payments"))

    let expenseList = document.createElement("ul")

    this.expenses.forEach (expenseInfo => {
      expenseList.append(new Expense(expenseInfo).generateExpenseItem())
    })

    innerExpenseDiv.append(expenseList)

    return innerExpenseDiv
  }
  
  addExpense(event, budgetObj) {
    console.log(event.target)
  }
}

class User {
  constructor (userId="", firstName, jobs = [], budgetId){
    this.id = userId
    this.name = firstName
    this.jobs = jobs
    this.budgetId = budgetId
    if (userId == "") {
      return this.submitNewUserReq()
    } else {
      return this.generateUserCard()
    }
  }

  get income(){
    let income = 0
    this.jobs.forEach(job => {
      income += parseInt(job.pay_amount * job.pay_frequency)
    })
    return income
  }

  generateUserCard() {
    let userCard = createDiv("userCard",this.id)

    userCard.append(createParagraph("userName",`${this.name} - Income ${this.income}`))
    userCard.append(createButton("deleteUser", "Remove User", this.removeUserReq, this))

    let jobList = document.createElement("ul")
    this.jobs.forEach(jobInfo => {
      jobList.append(new Job(jobInfo).generateJobItem())
    })
    userCard.append(jobList)
    userCard.append(createButton("addIncome", "Add A Source Of Income", this.addJob, this))

    usersDiv.style.gridTemplateColumns+=" auto"

    usersDiv.append(userCard)
  }

  submitNewUserReq(){
    let formData = {
      "name": this.name,
      "jobs": this.jobs,
      "budgetId": this.budgetId
    };
  
    let configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    }
  
    return fetch(USER_URL,configObj)
      .then(response => response.json())
      .then(json => {
        new User(json.id, json.name, json.jobs, json.budgetId)
      })
      .catch(error => alert("There was an error: "+error.message+"."));
  }

  removeUserReq(button){
    let deleteUserUrl = `${USER_URL}/${getId(button)}`

    let configInfo = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: ""
    }
    
    return fetch(deleteUserUrl, configInfo)
      .then(resp => resp.json())
      .then(json => {
        if (json.error) {
          console.log(json)
        } else {
          let cards = document.querySelectorAll("div.userCard")
          usersDiv.style.gridTemplateColumns = ""
          cards.forEach(card => {
            if (card.id == json.id) {
              card.remove()
            } else {
              usersDiv.style.gridTemplateColumns+=" auto"
            }
          })
        }
      })
      .catch(error => console.log(error.message));
  }
  
  addJob(targetInfo, userObj){
    console.log(targetInfo, userObj)
  }
}

class Job {
  constructor(jobInfo){
    this.id = jobInfo.id
    this.company = jobInfo.company
    this.pay_frequency = jobInfo.pay_frequency
    this.pay_amount = jobInfo.pay_amount
  }

  generateJobItem() {
    let income = parseInt(this.pay_amount * this.pay_frequency)
    return createLi(`job${this.id}`, `${this.company} - ${income}`)
  }
}
class Debt {
  constructor(debtInfo){
    this.name = debtInfo.name
    this.balance = debtInfo.balance
    this.minimum_payment = debtInfo.minimum_payment
    this.payment_date = debtInfo.payment_date
  }

  generateDebtItem() {
    return createLi(`debt${this.id}`, `${this.name} - ${this.balance}`)
  }
}
class Expense {
  constructor(expenseInfo){
    this.name = expenseInfo.name
    this.minimum_payment = expenseInfo.minimum_payment
  }
  
  generateExpenseItem() {
    return createLi(`debt${this.id}`, `${this.name} - ${this.minimum_payment}`)
  }
}

document.addEventListener('DOMContentLoaded', ()=>{generateBudgets()})