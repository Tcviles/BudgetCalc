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
const spendingDiv = document.querySelector(".spendingCard")
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

function generatePage() {
  fetch(BUDGET_URL)
  .then(res=>res.json())
  .then(json=>json.forEach(budgetInfo=>{
    new Budget(budgetInfo)
    new User(budgetInfo.users,"","",[],budgetInfo.id)
    // new Debt(budgetInfo.id).generateSpendingCard(budgetInfo.debts, budgetInfo.expenses)
  }))
}

class Budget {
  priorityButton = budgetTitleDiv.querySelector("button.priority")
  
  constructor (budgetInfo) {
    this.id = budgetInfo.id
    this.priority = budgetInfo.priority
    this.generateBudgetCard()
  }

  generateBudgetCard(){  
    budgetCard.id = this.id
    this.generateBudgetTitle()
    // this.generateIncomeCard()
    // this.generateDebtCard()
    // this.generateExpenseCard()
  }

  generateBudgetTitle(){
    this.priorityButton.innerText = this.priority
    this.priorityButton.onclick = () => this.togglePriority()
  }
  
  togglePriority() {
    if (this.priorityButton.innerText == "Interest") {
      this.priorityButton.innerText = "Payoff"
    } else {
      this.priorityButton.innerText = "Interest"
    }
    
    this.sendPriorityUpdate()
  }

  sendPriorityUpdate() {
    let updateBudgetUrl = `${BUDGET_URL}/${this.id}`

    let formData = {
      "priority": this.priorityButton.innerText
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

}

class User {
  newUserForm = document.getElementById("newUserForm")
  incomeCardContent = document.getElementById("incomeCardContent")
  
  constructor (userId = "", firstName="",  income=0, jobs = [], budgetId = ""){
    this.id = userId
    this.name = firstName
    this.income = income
    this.jobs = jobs
    this.budgetId = budgetId
    
    if (Array.isArray(userId)) return this.generateIncomeCard(userId)
    if (userId != "") return this.generateUserCard()
    if (firstName != "") return this.submitNewUserReq()
  }
  
  generateIncomeCard(listOfUsers) {
    incomeDiv.querySelector("p").innerText = `Total Income - ${listOfUsers.reduce((a,b)=>{return a += b.income},0)}`
    document.getElementById("incomeCardDropdown").addEventListener("click", () => this.toggleIncomeContent())
    this.generateUsersCard(listOfUsers)
    this.generateNewUserForm()
  }
  
  generateNewUserForm(){
    newUserForm.addEventListener('submit', newUserEvent => {
      newUserEvent.preventDefault()
      let newUserName = newUserEvent.target.name.value;
      if (newUserName) {
        new User("",newUserName,"",[],this.budgetId)
        this.toggleUserForm()
      }
    })
    incomeDiv.querySelector("button.addUser").onclick = this.toggleUserForm
  }
  
  generateUsersCard(users) {
    users.forEach (userInfo => {
      new User(userInfo.id, userInfo.name, userInfo.income, userInfo.jobs, userInfo.budget_id)
    })
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
  
  toggleIncomeContent(){
    if (incomeCardContent.classList.contains("hidden")) {
      incomeCardContent.classList.remove("hidden")
    } else {
      incomeCardContent.classList.add("hidden")
    }
  }
  
  toggleUserForm() {
    if (newUserForm.classList.contains("hidden")) {
      newUserForm.classList.remove("hidden")
    } else {
      newUserForm.classList.add("hidden")
    }
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
      new User(json.id, json.name, json.income, json.jobs, json.budget_id)
    })
    .catch(error => alert("There was an error: "+error.message+"."));
  }
  
  removeUserReq(button){
    let deleteUserUrl = `${USER_URL}/${getId(button)}`
    const newUserForm = document.getElementById("newUserForm")
    if (!newUserForm.classList.contains("hidden")) {newUserForm.classList.add("hidden")}
    
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

class Expense {
  constructor(budgetId, name, minimum_payment, payment_date){
    this.budgetId = budgetId
    this.name = name
    this.minimum_payment = minimum_payment 
    this.payment_date = payment_date
  }
  
  generateExpenseItem() {
    return createLi(`debt${this.id}`, `${this.name} - ${this.minimum_payment}`)
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

class Debt extends Expense {
  constructor(budgetId, name, minimum_payment, payment_date, balance, interest_rate){
    super(budgetId);
    super(name);
    super(minimum_payment);
    super(payment_date);
    this.balance = balance
    this.interest_rate = interest_rate
  }
  
  generateDebtItem() {
    return createLi(`debt${this.id}`, `${this.name} - ${this.balance}`)
  }

  generateSpendingCard(){
    let debt = new Debt(this.id)
    let expense = new Expense(this.id)
    spendingDiv.querySelector("p").innerText = `Total Spending - ${debt.getTotalMonthlyPayments() + expense.getTotalMonthlyPayments()}`
  //   debt.generateDebtCard(this.debts)
  //   expense.generateExpenseCard(this.expenses)
  //   document.getElementById("spendingCardDropdown").addEventListener("click", () debt.toggleSpendingContent())
  //   // spendingDiv.append(this.generateDebtDiv())
  //   // debtDiv.append(createButton("addDebt", "Add A Debt", this.addDebt, this))\
  }
  
  generateDebtCard(debts) {
    debtDiv.append(createParagraph("debts","Debts / Loan Payments with Balance"))
  
    debts.forEach (debtInfo => {
      new Debt(debtInfo)
    })
  }
  
  addDebt(event, budgetObj) {
    console.log(event.target)
  }
}
  

document.addEventListener('DOMContentLoaded', ()=>{generatePage()})