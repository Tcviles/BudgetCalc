const BASE_URL = "http://localhost:3000"
const BUDGET_URL = `${BASE_URL}/budgets`
const USER_URL = `${BASE_URL}/users`
const JOB_URL = `${BASE_URL}/jobs`
const DEBT_URL = `${BASE_URL}/debts`
const EXPENSE_URL = `${BASE_URL}/expenses`
const mainBody = document.querySelector("main")

function createDiv(className){
  let div = document.createElement("div")
  div.classList.add(className)

  return div
}

function createButton(className, buttonText, buttonEventFn, parentObj = ""){
  let button = document.createElement("button")
  button.classList.add(className)
  button.innerText = buttonText
  button.onclick = clickEvent => buttonEventFn(clickEvent, parentObj)

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

function addPopup() {
  let modalWindow = createDiv("modal")
  modalWindow.id = "modal1"
  let modalDialog = createDiv("modal-dialog")

  let modalHeader = document.createElement("header")
  modalHeader.classList.add("modal-header")
  let closeModalButton = document.createElement("button")
  closeModalButton.classList.add("close-modal")
  closeModalButton.setAttribute("aria-label","close modal")
  modalHeader.append(closeModalButton)

  modalDialog.append(modalHeader)

  let modalContent = document.createElement("section")
  modalContent.classList.add("modal-content")
  modalDialog.append(modalContent)

  let modalFooter = document.createElement("footer")
  modalFooter.classList.add("modal-footer")
  modalDialog.append(modalFooter)

  modalWindow.append(modalDialog)
  return modalWindow
}

function generateBudgets() {
  mainBody.innerHTML = ""

  fetch(BUDGET_URL)
  .then(res=>res.json())
  .then(json=>json.forEach(budgetInfo=>{
    new Budget(budgetInfo).generateBudgetCard()
  }))
}

class Budget {
  constructor (budgetInfo) {
    this.id = budgetInfo.id
    this.priority = budgetInfo.priority
    this.users = budgetInfo.users
    this.debts = budgetInfo.debts
    this.expenses = budgetInfo.expenses
  }

  generateBudgetCard(){
    let budgetCard = createDiv("budgetCard")
    budgetCard.id = `budget${this.id}`
  
    budgetCard.append(this.generateBudgetTitle())
    budgetCard.append(this.generateUserDiv())
    budgetCard.append(this.generateDebtDiv())
    budgetCard.append(this.generateExpenseDiv())
    
    mainBody.append(budgetCard)
  }

  generateBudgetTitle(){
    let budgetTitleDiv = createDiv("budgetTitle")
    
    budgetTitleDiv.append(createParagraph("budgetTitle","What is this budgets priority?"))
    budgetTitleDiv.append(createButton("priority", this.priority, this.togglePriority, this))

    return budgetTitleDiv
  }
  
  togglePriority(event, budgetObj) {
    console.log(event, budgetObj)
  }

  generateUserDiv() {
    let usersDiv = createDiv("usersCard")

    usersDiv.append(createParagraph("totalIncome", `Total Income - ${this.users.reduce((a,b)=>parseInt(a.income) + parseInt(b.income))}`))
    usersDiv.append(this.generateInnerUserDiv())
    usersDiv.append(createButton("addUser", "Add Income User", this.addUser, this))
    usersDiv.append(addPopup())

    return usersDiv
  }

  generateInnerUserDiv() {
    let innerUserDiv = createDiv("innerUserDiv")

    this.users.forEach (userInfo => {
      innerUserDiv.append(new User(userInfo).generateUserCard())
      innerUserDiv.style.gridTemplateColumns += " auto"
    })

    return innerUserDiv
  }

  addUser(event, budgetObj) {
    console.log(event, budgetObj)
  }

  generateDebtDiv(){
    let debtDiv = createDiv("debtCard")

    debtDiv.append(this.generateInnerDebtDiv())
    debtDiv.append(createButton("addDebt", "Add A Debt", this.addDebt, this))
    debtDiv.append(addPopup())

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

  generateExpenseDiv(){
    let expensesDiv = createDiv("expenseCard")
    
    expensesDiv.append(this.generateInnerExpenseDiv())
    expensesDiv.append(createButton("addExpense", "Add Expense", this.addExpense, this))
    expensesDiv.append(addPopup())

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
  constructor (userInfo){
    this.name = userInfo.name
    this.income = userInfo.income
    this.jobs = userInfo.jobs
  }

  generateUserCard() {
    let userDiv = createDiv("user")

    userDiv.append(createParagraph("userName",`${this.name} - Income ${this.income}`))

    let jobList = document.createElement("ul")
    this.jobs.forEach(jobInfo => {
      jobList.append(new Job(jobInfo).generateJobItem())
    })
    userDiv.append(jobList)
    userDiv.append(createButton("addIncome", "Add A Source Of Income", this.addJob, this))
    userDiv.append(addPopup())

    return userDiv
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
    let income = 0

    if (this.pay_frequency == "weekly") {
      income += parseInt(this.pay_amount)*4.3
    } else {
      let frequency = this.pay_frequency.split(",").length
      let amount = parseInt(this.pay_amount)
      income = frequency*amount
    }

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