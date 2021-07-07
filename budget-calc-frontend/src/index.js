class User {
  newUserForm = document.getElementById("newUserForm")
  incomeCardContent = document.getElementById("incomeCardContent")
  incomeCardDropdown = document.getElementById("incomeCardDropdown")
  
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
    this.incomeCardDropdown.innerHTML = `<p>Total Income - ${this.calculateTotalIncome(listOfUsers)}</p>`
    this.incomeCardDropdown.onclick = this.toggleIncomeContent
    this.renderUsers(listOfUsers)
    this.connectNewUserForm()
    new Job().connectNewIncomeForm()
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
  expensesCard = document.querySelector(".expensesCard")
  spendingCardContent = document.getElementById("spendingCardContent")
  spendingDropdown = document.getElementById("spendingCardDropdown")
  constructor(budgetId, name, minimumPayment, paymentDate, lastPaid, expenseId){
    this.budgetId = budgetId
    this.name = name
    this.minimumPayment = minimumPayment
    this.paymentDate = paymentDate
    this.lastPaid = lastPaid
    this.id = expenseId
  }
  
  generateSpendingCard(){
    this.resetExpensesCard()
    this.getAllExpenses()
    this.getAllDebts()
  }

  resetExpensesCard(){
    this.expensesCard.innerHTML=""
    this.spendingDropdown.setAttribute("totalBills",0)
    this.spendingDropdown.setAttribute("totalDebt",0)
    this.spendingDropdown.innerHTML="<p>You have no bills!!!</p>"
    this.spendingDropdown.onclick = this.toggleSpendingContent
    this.connectNewExpenseForm()
    this.connectNewPaymentForm() 
  }

  getAllExpenses(){
    fetch(EXPENSE_URL)
      .then(response => response.json())
      .then(expenses => expenses.forEach(expense=> {
        new Debt(expense.budget_id, expense.name, expense.minimum_payment, expense.payment_date, "", "", expense.last_paid, expense.id)
      }))
      .catch(error => alert("There was an error: "+error.message+"."));
  }

  getAllDebts(){
    fetch(DEBT_URL)
      .then(response => response.json())
      .then(debts => debts.forEach(debt=> {
        new Debt(debt.budget_id, debt.name, debt.minimum_payment, debt.payment_date, debt.balance, debt.interest_rate, debt.last_paid, debt.id)
      }))
      .catch(error => alert("There was an error: "+error.message+"."));
  }
  
  toggleSpendingContent(){ toggleForm(spendingCardContent) }

  updateDropdownBills(){
    let prevAmt = parseInt(spendingCardDropdown.getAttribute("totalBills"))
    let newAmt = prevAmt += this.minimumPayment
    spendingCardDropdown.setAttribute("totalBills", newAmt)
    spendingCardDropdown.innerHTML=`<p>Total Minimum Payments - ${newAmt}</p>`
  }

  getExpType(balance){ (balance!="") ? "debt" : "expense" }

  addExpenseCard(){
    this.updateDropdownBills()
    let expenseCard = this.addDetailsToExpenseCard()

    let makePaymentBtn = createButton("update", "Make Payment")
    makePaymentBtn.addEventListener("click",() => { this.toggleNewPaymentForm(); })
    expenseCard.append(makePaymentBtn)
    expenseCard.append(createButton("remove","Remove Expense", this.removeExpReq))
    this.expensesCard.append(expenseCard)

    return expenseCard
  }

  addDetailsToExpenseCard(){
    let expenseCard = createDiv(["expenseCard"],this.id)
    let expenseCardInfo = document.createElement("ul")

    expenseCard.append(createParagraph("expense", `${this.name} - $${this.minimumPayment}`))
    expenseCardInfo.append(createLi(this.id, `Due on the ${this.paymentDate}.`))
    expenseCardInfo.append(createLi("", `Last paid on ${this.lastPaid}`))
    expenseCard.append(expenseCardInfo)

    return expenseCard
  }
  

  connectNewExpenseForm(){
    newExpenseForm.addEventListener("submit", newExpenseEvent => {
      newExpenseEvent.preventDefault()
      let name = newExpenseEvent.target.name.value;
      let minimumPayment = newExpenseEvent.target.minimumPayment.value;
      let paymentDate = newExpenseEvent.target.paymentDate.value;
      let balance = newExpenseEvent.target.balance.value;
      let interestRate = newExpenseEvent.target.interestRate.value;
      if (name && minimumPayment && paymentDate) {
        new Debt(this.budgetId, name, minimumPayment, paymentDate, balance, interestRate)
        hideForm(newExpenseForm)
      }
    })
    document.querySelector("button.addExpense").onclick = this.toggleNewExpenseForm
  }

  updateMinPmtEvt(amount) {
    document.querySelector(".checkbox").addEventListener("click", () => {
      if (document.querySelector("input:checked")) {
        document.getElementById("updExpPmtAmt").value = amount
      } else {
        document.getElementById("updExpPmtAmt").value = 0
      }
    })
  }
  
  toggleNewExpenseForm(){ 
    hideForm(newPaymentForm)
    toggleForm(newExpenseForm) 
  }

  submitNewExpenseReq(){
    let formData = {
      "name": this.name,
      "minimumPayment": this.minimumPayment, 
      "paymentDate": this.paymentDate,
      "budgetId": this.budgetId
    }

    let configObj = { method: "POST", headers: JSON_Headers, body: JSON.stringify(formData)}

    return fetch(EXPENSE_URL, configObj)
      .then(response => response.json())
      .then(json => {
        new Debt(json.budgetId, json.name, json.minimumPayment, json.paymentDate, "", "", "", json.id)
      })
      .catch(error => alert("There was an error: "+error.message+"."));
  }

  removeExpReq(button){
    let deleteExpUrl = `${EXPENSE_URL}/${button.parentElement.id}`
    let configObj = { method: "DELETE", headers: JSON_Headers}

    return fetch(deleteExpUrl, configObj)
            .then(response => response.json())
            .then(json => {
              if (json.error) {
                console.log(json)
              } else {
                button.parentElement.remove()
              }
            })
            .catch(error => alert("There was an error: "+error.message));
  }
  
  toggleNewPaymentForm(){
    hideForm(newExpenseForm)
    let expenseId = `${this.id}${this.getExpType(this.balance)}`
    document.querySelector(".checkbox").checked = false
    if ((expenseId=="") || (newPaymentForm.getAttribute("expenseId") == expenseId)){
      newPaymentForm.setAttribute("expenseId","")
      return hideForm(newPaymentForm)
    } else {
      newPaymentForm.setAttribute(`expenseId`,expenseId)
      newPaymentForm.querySelector("h3").innerText = `Make A Payment On Your ${this.name} Bill!`
      document.getElementById("updExpPmtAmt").value = 0
      this.updateMinPmtEvt(this.minimumPayment)
      return showForm(newPaymentForm)
    }
  }

  connectNewPaymentForm(){
    newPaymentForm.addEventListener("submit", newPaymentEvent => {
      newPaymentEvent.preventDefault()
      let formExpId = newPaymentForm.getAttribute("expenseId")
      let expId = parseInt(formExpId);
      let amount = newPaymentEvent.target.paymentAmt.value;
      if (formExpId.includes("debt")) {
        this.submitDebtPayReq(expId, amount)
      } else {
        this.submitExpensePayRequest(expId, amount)
      }
    })
  }

  submitExpensePayRequest(expId, amount) {
    console.log("expenseReq",expId,amount)
  }

  submitDebtPayReq(expId, amount) {
    console.log("debtReq",expId,amount)
  }
}

class Debt extends Expense {
  constructor(budgetId="", name="", minimumPayment="", paymentDate="",  balance="", interestRate="", lastPaid="", expenseId=""){
    super(budgetId, name, minimumPayment, paymentDate, lastPaid, expenseId);
    this.balance = balance;
    this.interestRate = interestRate;

    if ((expenseId!="") && (balance!="")) return this.addDebtCard()
    if (expenseId!="") return this.addExpenseCard()
    if (balance!="") return this.submitNewDebtReq()
    if (name!="") return this.submitNewExpenseReq()
  }

  addDebtCard() {
    let debtCard = this.addExpenseCard()
    let debtCardInfo = debtCard.querySelector("ul")
    this.updateDropdownBalance()
    
    debtCardInfo.append(createLi(this.id, `Remaining balance is ${this.balance}.`))
    debtCardInfo.append(createLi(this.id, `The interest rate is ${this.interestRate}`))
    debtCard.querySelector(".remove").onclick = this.removeDebtReq
    debtCard.classList.remove("expenseCard")
    debtCard.classList.add("debtCard")
  }

  updateDropdownBalance(){
    let prevAmt = parseInt(spendingCardDropdown.getAttribute("totalDebt"))
    let newAmt = prevAmt += this.balance
    spendingCardDropdown.setAttribute("totalDebt", newAmt)
    let totalDebtP = document.createElement("p")
    totalDebtP.innerText = `Total Debt - ${newAmt}`
    spendingCardDropdown.append(totalDebtP)
  }

  submitNewDebtReq(){
    let formData = {
      "name": this.name,
      "minimumPayment": this.minimumPayment, 
      "paymentDate": this.paymentDate,
      "balance": this.balance,
      "interestRate": this.interestRate,
      "budgetId": this.budgetId
    }

    let configObj = { method: "POST", headers: JSON_Headers, body: JSON.stringify(formData)}

    return fetch(DEBT_URL, configObj)
      .then(response => response.json())
      .then(json => {
        new Debt(json.budget_id, json.name, json.minimum_payment, json.payment_date, json.balance, json.interest_rate, json.last_paid, json.id)
      })
      .catch(error => alert("There was an error: "+error.message+"."));
  }

  removeDebtReq(button){
    let deleteDebtUrl = `${DEBT_URL}/${button.target.parentElement.id}`
    let configObj = { method: "DELETE", headers: JSON_Headers}

    return fetch(deleteDebtUrl, configObj)
            .then(response => response.json())
            .then(json => {
              if (json.error) {
                console.log(json)
              } else {
                button.target.parentElement.remove()
              }
            })
            .catch(error => alert("There was an error: "+error.message));
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
  
document.addEventListener('DOMContentLoaded', ()=>{
  fetch(BUDGET_URL)
    .then(res=>res.json())
    .then(json=>json.forEach(budgetInfo=>{
      new Budget(budgetInfo.id, budgetInfo.priority)
      new User(budgetInfo.id).generateIncomeCard(budgetInfo.users)
      new Expense(budgetInfo.id).generateSpendingCard()
    }))
})
