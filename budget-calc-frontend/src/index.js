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
    new Expense(budgetInfo.id).generateSpendingCard(budgetInfo.expenses, budgetInfo.debts)
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
    incomeButton.classList.add("add")
    incomeButton.innerText = "Add Income"
    userCard.append(incomeButton)

    document.querySelector(".usersCard").append(userCard)

    new Job(this.id).renderJobList(this.jobs, this.name)
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
    
    if (!newIncomeForm.classList.contains("hidden")) {newIncomeForm.classList.add("hidden")}
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
  
  renderJobList(jobs, userName) {
    jobs.forEach (job => {
      new Job(job.user_id, job.company, job.title, job.pay_amount, job.pay_frequency, job.id)
    })

    this.getUserCard().querySelector("button.add").addEventListener("click", () => {
      this.setIncomeFormUserId(this.userId, userName);
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
    if (!newUserForm.classList.contains("hidden")) {newUserForm.classList.add("hidden")}
    if (newIncomeForm.classList.contains("hidden")) return newIncomeForm.classList.remove("hidden")
    if (!newIncomeForm.classList.contains("hidden")) return newIncomeForm.classList.add("hidden")
  }

  setIncomeFormUserId(userId, userName){
    document.querySelector(".addIncomeForm").setAttribute("userId",userId)
    document.querySelector(".addIncomeForm h3").innerText = `Add Income for ${userName}`
  }

  submitNewJobReq() {
    let formData = {
      "company": this.company,
      "title": this.title,
      "payFrequency": this.payFrequency,
      "payAmount": this.payAmount,
      "userId": this.userId
    };
    
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
        button.parentElement.remove()
      }
    })
    .catch(error => console.log(error.message));
  }
}

class Expense {
  newExpenseForm = document.getElementById("newExpenseForm")
  billsCard = document.querySelector(".expensesCard")
  spendingCardContent = document.getElementById("spendingCardContent")
  spendingDropdown = document.getElementById("spendingCardDropdown")
  constructor(budgetId, name, minimumPayment, paymentDate, expenseId){
    this.budgetId = budgetId
    this.name = name
    this.minimumPayment = parseInt(minimumPayment)
    this.paymentDate = parseInt(paymentDate)
    this.id = expenseId

    // if (expenseId != "") return this.addExpenseCard()
    // if (name != "") return this.submitNewExpenseReq()
  }
  
  generateSpendingCard(expenses, debts){
    expenses.push.apply(expenses, debts)
    let totalMonthlyPayments = this.calculateTotalMonthlySpending(expenses)
    this.spendingDropdown.innerHTML = `<p>Total Monthly Payments - ${totalMonthlyPayments}</p>`
    this.spendingDropdown.onclick = this.toggleSpendingContent
    this.renderExpenseCards(expenses)  
    document.querySelector("button.addExpense").onclick = this.toggleNewBillForm
  //   debt.generateDebtCard(this.debts)
  //   expense.generateExpenseCard(this.expenses)
  //   spendingDiv.append(this.generateDebtDiv())
  //   debtDiv.append(createButton("addDebt", "Add A Debt", this.addDebt, this))\
  }

  renderExpenseCards(expenses) {
    expenses.forEach (bill => {
      new Debt(bill.budget_id, bill.name, bill.minimum_payment, bill.payment_date, bill.balance, bill.interest_rate, bill.id)
    })
  }

  addExpenseCard(){
    let expenseCard = createDiv("expenseCard",this.id)
    expenseCard.append(createParagraph("expense", `${this.name} - $${this.minimumPayment}`))
    let expenseCardInfo = document.createElement("ul")
    expenseCardInfo.append(createLi(this.id, `Due on the ${this.paymentDate}.`))
    expenseCard.append(expenseCardInfo)
    expenseCard.append(createButton("add","Make Payment", this.makeAPayment))
    this.billsCard.append(expenseCard)
    return expenseCard
  }
  
  toggleSpendingContent(){
    if (spendingCardContent.classList.contains("hidden")) return spendingCardContent.classList.remove("hidden")
    if (!spendingCardContent.classList.contains("hidden")) return spendingCardContent.classList.add("hidden")
  }
  
  toggleNewBillForm(){
    if (newExpenseForm.classList.contains("hidden")) return newExpenseForm.classList.remove("hidden")
    if (!newExpenseForm.classList.contains("hidden")) return newExpenseForm.classList.add("hidden")
  }

  calculateTotalMonthlySpending(listOfExpenses){
    return listOfExpenses.reduce((a,b)=>{return a += parseInt(b.minimum_payment)},0)
  }

  makeAPayment(event){
    console.log(event)
  }
}

class Debt extends Expense {
  constructor(budgetId="", name="", minimumPayment="", paymentDate="", balance="", interestRate="", expenseId=""){
    super(budgetId, name, minimumPayment, paymentDate, expenseId);
    this.balance = balance;
    this.interestRate = interestRate;

    if ((expenseId!="") && (balance!="")) return this.addDebtCard()
    if (expenseId!="") return this.addExpenseCard()
    // if (balance!="") return this.submitNewDebtReq()
    // if (name!="") return this.submitNewExpenseReq()
  }

  addDebtCard() {
    let debtCard = this.addExpenseCard()
    let debtCardInfo = debtCard.querySelector("ul")
    
    debtCardInfo.append(createLi(this.id, `Remaining balance is ${this.balance}.`))
    debtCardInfo.append(createLi(this.id, `The interest rate is ${this.interestRate}`))
    console.log(debtCard)
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