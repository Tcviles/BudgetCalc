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

 class User {
  newUserForm = document.getElementById("newUserForm")
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
    document.getElementById("totalIncome").innerText = `Total Income - ${this.calculateTotalIncome(listOfUsers)}`
    document.getElementById("incomeCardDropdown").onclick = this.toggleIncomeContent
    this.renderUsers(listOfUsers)
    this.connectNewUserForm()
    new Job().connectNewIncomeForm()
  }

  calculateTotalIncome(listOfUsers){
    return listOfUsers.reduce((a,b)=>{return a += b.income},0)
  }
  
  toggleIncomeContent(){
    toggleHidden(document.getElementById("incomeCardContent"))
  }
  
  renderUsers(users) {
    users.forEach (user => {
      new User(user.budget_id, user.name, user.income, user.jobs, user.id)
    })
  }

  addUserCard() {
    let userCard = createDiv(["userCard"],this.id)
    let usersCard = document.querySelector(".usersCard")
    
    userCard.append(createParagraph("userName",`${this.name} - Income ${this.income}`))
    userCard.append(document.createElement("ul"))
    userCard.append(createButton("add", "Add Income"))
    userCard.append(createButton("deleteUser", "Remove User", this.removeUserReq))

    usersCard.append(userCard)

    new Job(this.id).renderJobList(this.jobs, this.name)
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
    
  connectNewUserForm(){
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
  
  connectNewIncomeForm(){
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
    hideForm(newUserForm)
    
    let deleteIncomeUrl = `${JOB_URL}/${button.parentElement.id}`
    
    let configObj = { method: "DELETE", headers: JSON_Headers}
    
    return fetch(deleteIncomeUrl, configObj)
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
  newPaymentForm = document.getElementById("newPaymentForm")
  constructor(budgetId="", name="", minimumPayment="", paymentDate="",  balance=0, interestRate=0, lastPaid="", expenseId=""){
    this.budgetId = budgetId
    this.name = name
    this.minimumPayment = minimumPayment
    this.paymentDate = paymentDate
    this.balance = balance
    this.interestRate = interestRate
    this.lastPaid = lastPaid
    this.id = expenseId

    if (expenseId != "") return this.addCard()
    if (name != "") return this.submitNewExpenseReq()
  }
  
  accountForZero() {
    Expense.updateDropdownBills(0);
    Debt.updateDropdownBalance(0);
  }

  addCard(){
    Expense.updateDropdownBills(this.minimumPayment)
    let expenseCard = this.addDetailsToExpenseCard()

    let makePaymentBtn = createButton("update", "Make Payment")
    makePaymentBtn.addEventListener("click",() => { 
      this.toggleNewPaymentForm(); 
    })
    expenseCard.append(makePaymentBtn)
    expenseCard.append(createButton("remove","Remove Expense", this.removeExpReq))
    document.getElementById("expensesCard").append(expenseCard)

    return expenseCard
  }

  addDetailsToExpenseCard(){
    let typeId = this.getTypeId()
    let expenseCard = createDiv(["expenseCard"],typeId)
    let expenseCardInfo = document.createElement("ul")

    expenseCard.append(createParagraph(`expenseTitle`, `${this.name} - $${this.minimumPayment}`))
    expenseCardInfo.append(createLi(`payDate`, `Due on the ${this.paymentDate}.`))
    expenseCardInfo.append(createLi(`${typeId}LastPaid`, `Last paid on ${this.lastPaid ?? "never"}.`))
    expenseCard.append(expenseCardInfo)

    return expenseCard
  }

  
  connectFormsAndToggles(){
    document.getElementById("spendingCardDropdown").onclick = this.toggleSpendingContent
    this.connectNewExpenseForm()
    this.connectNewPaymentForm() 
  }
  
  connectNewExpenseForm(){
    newExpenseForm.addEventListener("submit", newExpenseEvent => {
      newExpenseEvent.preventDefault()
      let name = newExpenseEvent.target.name.value;
      let minimumPayment = parseFloat(newExpenseEvent.target.minimumPayment.value);
      let paymentDate = parseFloat(newExpenseEvent.target.paymentDate.value);
      let balance = parseFloat(newExpenseEvent.target.balance.value);
      let interestRate = parseFloat(newExpenseEvent.target.interestRate.value);
      if (name && minimumPayment && paymentDate) {
        if (balance) {
          new Debt(this.budgetId, name, minimumPayment, paymentDate, balance, interestRate)
        } else {
          new Expense(this.budgetId, name, minimumPayment, paymentDate)
        }
        hideForm(newExpenseForm)
      }
    })
    document.querySelector("button.addExpense").onclick = this.toggleNewExpenseForm
  }

  connectNewPaymentForm(){
    newPaymentForm.addEventListener("submit", newPaymentEvent => {
      newPaymentEvent.preventDefault()
      let expenseCardId = newPaymentForm.getAttribute("expenseCardId")
      let amount = newPaymentEvent.target.paymentAmt.value;
      if (expenseCardId.includes("debt")) {
        Debt.submitPayment(expenseCardId, amount)
      } else {
        Expense.submitPayment(expenseCardId, amount)
      }
    })
  }

  generateSpendingCard(){
    Expense.getExpenses()
    Debt.getDebts()
    this.connectFormsAndToggles()
    this.accountForZero()
  }

  static async getExpenses(){
    try {
      const res = await fetch(EXPENSE_URL)
      const expenses = await res.json()
      expenses.forEach(expense=> {
          new Expense(expense.budget_id, expense.name, expense.minimum_payment, expense.payment_date, 0, 0, expense.last_paid, expense.id)
      })
    } catch (err) {
      console.error(err);
    }
  }

  getTypeId(){ 
    if (this.balance!="") return `${this.id}debt`
    return `${this.id}expense` 
  }

  async removeExpReq(button){
    let deleteExpUrl = `${EXPENSE_URL}/${button.parentElement.id}`
    let configObj = { method: "DELETE", headers: JSON_Headers}
    console.log(deleteExpUrl)

    try {
      const resp = await fetch(deleteExpUrl, configObj)
      const json = await resp.json()
      if (json.error) return console.error(json.error)
      Expense.updateDropdownBills(0 - json.minimum_payment)
      return button.parentElement.remove()
    } catch (err) {
      console.error(err)
    }
  }

  async submitNewExpenseReq(){
    let formData = {
      "name": this.name,
      "minimumPayment": this.minimumPayment, 
      "paymentDate": this.paymentDate,
      "budgetId": this.budgetId
    }

    let configObj = { method: "POST", headers: JSON_Headers, body: JSON.stringify(formData)}

    try {
      const resp = await fetch(EXPENSE_URL, configObj)
      const json = await resp.json()
      this.id = json.id
      this.addCard()
    } catch (err) {
      console.error(err)
    }
    
  }

  static async submitPayment(expenseCardId, amount) {
    // amount will be used later
    let expenseId = parseInt(expenseCardId)
    let updateExpenseUrl = `${EXPENSE_URL}/${expenseId}`
    let formData = {"lastPaid": "today"}
    let configObj = { method: "PATCH", headers: JSON_Headers, body: JSON.stringify(formData) }

    try {
      const resp = await fetch(updateExpenseUrl, configObj)
      const json = await resp.json()
      document.getElementById(`${expenseCardId}LastPaid`).innerText = `Last paid on ${json.last_paid}`
    } catch (err) {
      console.error(err)
    }
  }
  
  toggleNewExpenseForm(){ 
    hideForm(newPaymentForm)
    toggleHidden(newExpenseForm) 
  }
  
  toggleNewPaymentForm(){
    hideForm(newExpenseForm)
    let expenseCardId = this.getTypeId()
    document.querySelector(".checkbox").checked = false
    if ((expenseCardId=="") || (newPaymentForm.getAttribute("expenseCardId") == expenseCardId)){
      newPaymentForm.setAttribute("expenseCardId","")
      return hideForm(newPaymentForm)
    } else {
      newPaymentForm.setAttribute(`expenseCardId`,expenseCardId)
      newPaymentForm.querySelector("h3").innerText = `Make A Payment On Your ${this.name} Bill!`
      document.getElementById("updExpPmtAmt").value = 0
      this.updateMinPmtEvt()
      return showForm(newPaymentForm)
    }
  }
  
  toggleSpendingContent(){ toggleHidden(document.getElementById("spendingCardContent")) }

  static updateDropdownBills(amt){
    let prevAmt = parseFloat(spendingCardDropdown.getAttribute("totalBills"))
    let newAmt = parseFloat(prevAmt + amt).toFixed(2);
    spendingCardDropdown.setAttribute("totalBills", newAmt)
    document.getElementById("totalMinPayments").innerText = `Total Minimum Payments - ${newAmt}`
  }

  updateMinPmtEvt() {
    document.querySelector(".checkbox").addEventListener("click", () => {
      if (document.querySelector("input:checked")) {
        document.getElementById("updExpPmtAmt").value = this.minimumPayment
      } else {
        document.getElementById("updExpPmtAmt").value = 0
      }
    })
  }
}

class Debt extends Expense {

  static async getDebts(){
    try {
      const res = await fetch(DEBT_URL)
      const debts = await res.json()
      debts.forEach(debt=> {
         new Debt(debt.budget_id, debt.name, debt.minimum_payment, debt.payment_date, debt.balance, debt.interest_rate, debt.last_paid, debt.id)
      })
    } catch (err) {
      console.error(err);
    }
  }

  addCard() {
    let debtCard = super.addCard()
    let debtCardInfo = debtCard.querySelector("ul")
    Debt.updateDropdownBalance(this.balance)
    
    debtCardInfo.append(createLi(`${this.getTypeId()}Balance`, `Remaining balance is ${this.balance}.`))
    debtCardInfo.append(createLi("", `The interest rate is ${this.interestRate}`))
    debtCard.querySelector(".remove").onclick = this.removeDebtReq
  }

  static updateDropdownBalance(amount){
    let prevAmt = parseFloat(spendingCardDropdown.getAttribute("totalDebt"))
    let newAmt = parseFloat(prevAmt + amount).toFixed(2);
    spendingCardDropdown.setAttribute("totalDebt", newAmt)
    document.getElementById("totalDebtP").innerText = `Total Debt - ${newAmt ?? 0}`
  }

  async submitNewExpenseReq(){
    let formData = {
      "name": this.name,
      "minimumPayment": this.minimumPayment, 
      "paymentDate": this.paymentDate,
      "balance": this.balance,
      "interestRate": this.interestRate,
      "budgetId": this.budgetId
    }

    let configObj = { method: "POST", headers: JSON_Headers, body: JSON.stringify(formData)}

    try {
      const resp = await fetch(DEBT_URL, configObj)
      const json = await resp.json()
      this.id = json.id
      this.addCard()
    } catch (err) {
      console.error(err)
    }
  }

  async removeDebtReq(button){
    let deleteDebtUrl = `${DEBT_URL}/${button.target.parentElement.id}`
    let configObj = { method: "DELETE", headers: JSON_Headers}

    try {
      const resp = await fetch(deleteDebtUrl, configObj)
      const json = await resp.json()
      Expense.updateDropdownBills(0-json.minimum_payment)
      Debt.updateDropdownBalance(0-json.balance)
      button.target.parentElement.remove()
    } catch (err) {
      console.error(err)
    }
  }

  static async submitPayment(expenseCardId, amount) {
    let debtId = parseInt(expenseCardId)
    let updateDebtUrl = `${DEBT_URL}/${debtId}`
    let formData = {
      "lastPaid": "today",
      "paymentAmt": amount
    }
    let configObj = { method: "PATCH", headers: JSON_Headers, body: JSON.stringify(formData) }

    try {
      const resp = await fetch(updateDebtUrl, configObj)
      const json = await resp.json()
      Debt.updateDropdownBalance(0-amount)
      document.getElementById(`${expenseCardId}Balance`).innerText = `Remaining balance is ${parseFloat(json.balance).toFixed(2)}.`
      document.getElementById(`${expenseCardId}LastPaid`).innerText = `Last paid on ${json.last_paid}`
    } catch (err) {
      console.error(err)
    }
  }  
}

 
document.addEventListener('DOMContentLoaded', ()=>{
  fetch(BUDGET_URL)
    .then(res=>res.json())
    .then(json=>json.forEach(budgetInfo=>{
      new Budget(budgetInfo.id, budgetInfo.priority)
      new User(budgetInfo.id).generateIncomeCard(budgetInfo.users)
      new Expense(budgetInfo.id).generateSpendingCard()
    }))
})
