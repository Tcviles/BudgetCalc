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

const spendingDiv = document.querySelector(".spendingCard")
const debtDiv = document.querySelector(".debtCard")
const expensesDiv = document.querySelector(".expenseCard")

function createDiv(className, idName = ""){
  let div = document.createElement("div")
  div.classList.add(className)
  div.id = idName

  return div
}

function createButton(className, buttonText, buttonEventFn=""){
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

function generatePage() {
  fetch(BUDGET_URL)
  .then(res=>res.json())
  .then(json=>json.forEach(budgetInfo=>{
    new Budget(budgetInfo.id, budgetInfo.priority)
    new User(budgetInfo.id).generateIncomeCard(budgetInfo.users)
    // new Debt(budgetInfo.id).generateSpendingCard(budgetInfo.debts, budgetInfo.expenses)
  }))
}

class User {
  newUserForm = document.getElementById("newUserForm")
  incomeCardContent = document.getElementById("incomeCardContent")
  
  constructor (budgetId = "", firstName="",  income=0, jobs = [], userId = ""){
    this.budgetId = budgetId
    this.name = firstName
    this.income = income
    this.jobs = jobs
    this.id = userId
    
    if (userId != "") return this.addUserCard()
    if (firstName != "") return this.submitNewUserReq()
  }
  
  generateIncomeCard(listOfUsers) {
    document.querySelector(".incomeCard p").innerText = `Total Income - ${this.calculateTotalIncome(listOfUsers)}`
    document.getElementById("incomeCardDropdown").onclick = this.toggleIncomeContent
    this.renderUsers(listOfUsers)
    this.renderNewUserForm()
    new Job().renderNewIncomeForm()
  }

  calculateTotalIncome(listOfUsers){
    return listOfUsers.reduce((a,b)=>{return a += b.income},0)
  }
  
  toggleIncomeContent(){
    if (incomeCardContent.classList.contains("hidden")) return incomeCardContent.classList.remove("hidden")
    if (!incomeCardContent.classList.contains("hidden")) return incomeCardContent.classList.add("hidden")
  }
  
  renderUsers(users) {
    users.forEach (user => {
      new User(user.budget_id, user.name, user.income, user.jobs, user.id)
    })
  }

  addUserCard() {
    let userCard = createDiv("userCard",this.id)
    
    userCard.append(createParagraph("userName",`${this.name} - Income ${this.income}`))
    userCard.append(createButton("deleteUser", "Remove User", this.removeUserReq))
    userCard.append(document.createElement("ul"))
    let incomeButton = document.createElement("button")
    incomeButton.classList.add("addIncome")
    incomeButton.innerText = "Add Income"
    userCard.append(incomeButton)
    document.querySelector(".usersCard").append(userCard)

    new Job(this.id).renderJobList(this.jobs)
  }
    
  renderNewUserForm(){
    newUserForm.addEventListener('submit', newUserEvent => {
      newUserEvent.preventDefault()
      let newUserName = newUserEvent.target.name.value;
      if (newUserName) {
        new User(this.budgetId,newUserName)
        this.toggleUserForm()
      }
    })
    document.querySelector("button.addUser").onclick = this.toggleUserForm
  }
    
  toggleUserForm() {
    document.querySelector("#newUserForm .input-text").value = ""
    if (newUserForm.classList.contains("hidden")) return newUserForm.classList.remove("hidden")
    if (!newUserForm.classList.contains("hidden")) return newUserForm.classList.add("hidden")
  }
  
  submitNewUserReq(){
    let formData = {
      "name": this.name,
      "jobs": this.jobs,
      "budgetId": this.budgetId
    };
    
    let configObj = { method: "POST", headers: JSON_Headers, body: JSON.stringify(formData)} 
    
    return fetch(USER_URL,configObj)
    .then(response => response.json())
    .then(json => {
      new User(json.budget_id, json.name, json.income, json.jobs, json.id)
    })
    .catch(error => alert("There was an error: "+error.message+"."));
  }
  
  removeUserReq(button){
    if (!newUserForm.classList.contains("hidden")) {newUserForm.classList.add("hidden")}
    
    let deleteUserUrl = `${USER_URL}/${button.parentElement.id}`
    
    let configObj = { method: "DELETE", headers: JSON_Headers}
    
    return fetch(deleteUserUrl, configObj)
    .then(resp => resp.json())
    .then(json => {
      if (json.error) {
        console.log(json)
      } else {
        let cards = document.querySelectorAll("div.userCard")
        cards.forEach(card => {
          if (card.id == json.id) return card.remove()
        })
      }
    })
    .catch(error => console.log(error.message));
  }
}

class Job {
  newIncomeForm = document.getElementById("newIncomeForm")
  constructor(userId = "", company = "", title = "", payAmount = 0, payFrequency = 0, jobId = ""){
    this.userId = userId
    this.company = company
    this.title = title
    this.payFrequency = payFrequency
    this.payAmount = payAmount
    this.id = jobId
    
    if (jobId != "") return this.addJobItem()
    if (company != "") return this.submitNewJobReq()
  }
  
  renderJobList(jobs) {
    jobs.forEach (job => {
      new Job(job.user_id, job.company, job.title, job.pay_amount, job.pay_frequency, job.id)
    })

    this.getUserCard().querySelector("button.addIncome").addEventListener("click", () => {
      this.setIncomeFormUserId(this.userId);
      this.toggleIncomeForm();
    })
  }

  getUserCard(){
    let collection = document.querySelectorAll(".userCard")
    let userCard = ""
    collection.forEach(object => {
      if (object.id == this.userId) {
        userCard = object
      }
    })
    return userCard
  }
  
  addJobItem() {
    let list = this.getUserCard().querySelector("ul")
    let income = parseInt(this.payAmount * this.payFrequency)
    let listItem = (createLi(`${this.id}`, `${this.company} - ${income}`))
    listItem.append(createButton("remove", "Remove", this.removeIncome))
    
    list.append(listItem)
  }
  
  renderNewIncomeForm(){
    newIncomeForm.addEventListener('submit', newIncomeEvent => {
      newIncomeEvent.preventDefault()
      let company = newIncomeEvent.target.company.value;
      let title = newIncomeEvent.target.title.value;
      let payFrequency = newIncomeEvent.target.payFrequency.value;
      let payAmount = newIncomeEvent.target.payAmount.value;
      let userId = newIncomeEvent.target.getAttribute("userid")
      
      if (userId && company && title && payFrequency && payAmount) {
        new Job(userId,company,title,payAmount,payFrequency)
        this.toggleIncomeForm()
      }
    })
  }
    
  toggleIncomeForm() {
    if (newIncomeForm.classList.contains("hidden")) return newIncomeForm.classList.remove("hidden")
    if (!newIncomeForm.classList.contains("hidden")) return newIncomeForm.classList.add("hidden")
  }

  setIncomeFormUserId(userId){
    document.querySelector(".addIncomeForm").setAttribute("userId",userId)
  }

  submitNewJobReq() {
    let formData = {
      "company": this.company,
      "title": this.title,
      "payFrequency": this.payFrequency,
      "payAmount": this.payAmount,
      "userId": this.userId
    };
    
    console.log(formData)
    let configObj = { method: "POST", headers: JSON_Headers, body: JSON.stringify(formData)} 
    
    return fetch(JOB_URL,configObj)
    .then(response => response.json())
    .then(json => {
      new Job(json.user_id, json.company, json.title, json.pay_amount, json.pay_frequency, json.id)
    })
    .catch(error => alert("There was an error: "+error.message+"."));
  }

  removeIncome(button){
    if (!newUserForm.classList.contains("hidden")) {newUserForm.classList.add("hidden")}
    
    let deleteUserUrl = `${JOB_URL}/${button.parentElement.id}`
    
    let configObj = { method: "DELETE", headers: JSON_Headers}
    
    return fetch(deleteUserUrl, configObj)
    .then(resp => resp.json())
    .then(json => {
      if (json.error) {
        console.log(json)
      } else {
        console.log(json)
        button.parentElement.remove()
      }
    })
    .catch(error => console.log(error.message));
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

class Budget {
  priorityButton = document.querySelector("button.priority")
  
  constructor (id, priority) {
    this.id = id
    this.priority = priority
    this.setUpPriorityButton()
  }

  setUpPriorityButton(){
    this.priorityButton.innerText = this.priority
    this.priorityButton.onclick = () => this.sendPriorityUpdate()
  }

  togglePriorityText() {
    if (this.priorityButton.innerText == "Interest") return "Payoff"
    if (this.priorityButton.innerText != "Interest") return "Interest"
  }
  
  sendPriorityUpdate() {
    let updateBudgetUrl = `${BUDGET_URL}/${this.id}`
    
    let formData = { "priority": this.togglePriorityText() };
    let configObj = { method: "PATCH", headers: JSON_Headers, body: JSON.stringify(formData) }
  
    return fetch(updateBudgetUrl,configObj)
      .then(response => response.json())
      .then(json => this.priorityButton.innerText = json.priority)
      .catch(error => alert("There was an error: "+error.message+"."));
  }

}
  

document.addEventListener('DOMContentLoaded', ()=>{generatePage()})