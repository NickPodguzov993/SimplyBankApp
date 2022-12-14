'use strict';

// Simply Bank App

const account1 = {
  userName: 'Cecil Ireland',
  transactions: [500, 250, -300, 5000, -850, -110, -170, 1100],
  interest: 1.5,
  pin: 1111
};

const account2 = {
  userName: 'Amani Salt',
  transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
  interest: 1.3,
  pin: 2222
};

const account3 = {
  userName: 'Corey Martinez',
  transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
  interest: 0.8,
  pin: 3333
};

const account4 = {
  userName: 'Kamile Searle',
  transactions: [530, 1300, 500, 40, 190],
  interest: 1,
  pin: 4444
};

const account5 = {
  userName: 'Oliver Avila',
  transactions: [630, 800, 300, 50, 120],
  interest: 1.1,
  pin: 5555
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.total__value--in');
const labelSumOut = document.querySelector('.total__value--out');
const labelSumInterest = document.querySelector('.total__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


function showTransactions(transactions) {
  containerTransactions.textContent = '';
  transactions.forEach((trans, index) => {
    const transType = trans > 0 ? 'deposit' : 'withdrawal';
    const transitionsRow =
      `<div class='transactions__row'>
          <div class='transactions__type transactions__type--${transType}'>
            ${index + 1} ${transType}
          </div>
          <div class='transactions__value'>${trans}</div>
        </div>`;
    containerTransactions.insertAdjacentHTML('afterbegin', transitionsRow);
  });
}


const createNickNames = (accs) => {
  accs.forEach(acc => {
    acc.nicknames = acc.userName.toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createNickNames(accounts);

const showBalance = (account) => {
  const balance = account.transactions.reduce((acc, trans) => {
    return acc + trans;
  }, 0);
  account.balance = balance;
  labelBalance.textContent = `${balance}$`;
};


const showDepositAndOutAndInterest = (arrTrans) => {
  const deposit = arrTrans.transactions.filter(trans => trans > 0)
    .reduce((acc, trans) => {
      return acc + trans;
    }, 0);
  labelSumIn.textContent = `${deposit}$`;

  const withdrawal = arrTrans.transactions.filter(trans => trans <= 0)
    .reduce((acc, trans) => {
      return acc + trans;
    }, 0);
  labelSumOut.textContent = `${withdrawal}$`;

  const interest = arrTrans.transactions.filter(trans => trans > 0)
    .map(trans => (trans * arrTrans.interest) / 100)
    .filter(trans => trans >= 5)
    .reduce((acc, trans) => {
      return acc + trans;
    });
  labelSumInterest.textContent = `${interest}$`;
};

const updateUi = () => {
  showBalance(currentAccount);
  showDepositAndOutAndInterest(currentAccount);
  showTransactions(currentAccount.transactions);
};

let currentAccount;

const getLogin = (e) => {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.nicknames ===
    inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Рады вас снова видеть ${currentAccount.userName.split(' ')[0]}!`;
  }
  // clear inputs
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  inputLoginPin.blur();
  updateUi();
};

btnLogin.addEventListener('click', getLogin);

const moneyTransferTo = (e) => {
  e.preventDefault();
  const amountTransfer = Number(inputTransferAmount.value);
  const recipientNickName = inputTransferTo.value;
  const recipientAccount = accounts.find(acc => acc.nicknames === recipientNickName);
  console.log(amountTransfer);
  console.log(recipientAccount);
  inputTransferAmount.value = ''
  inputTransferTo.value = ''
  if (amountTransfer > 0 && amountTransfer <= currentAccount.balance &&
    recipientAccount && currentAccount.nicknames !== recipientAccount?.nicknames) {
    currentAccount.transactions.push(-amountTransfer);
    recipientAccount.transactions.push(amountTransfer);
    updateUi();
  }
};

btnTransfer.addEventListener('click', moneyTransferTo);

const closeCheck = (e) => {
  e.preventDefault()
  console.log('hi');
  if(inputCloseUsername.value === currentAccount.nicknames &&
    Number(inputClosePin.value) === currentAccount.pin){
    console.log('delete account');
    const currentAccountIndex = accounts.findIndex(acc => acc.nicknames ===
      currentAccount.nicknames)
    accounts.splice(currentAccountIndex,1)
    labelWelcome.textContent = 'Войдите в свой аккаунт'
    containerApp.style.opacity = 0
  }
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
}

btnClose.addEventListener('click', closeCheck)

const loanMoney = (e) => {
  e.preventDefault()
  const loanAmount = Number(inputLoanAmount.value)

  if(currentAccount.transactions.some(trans => trans >= loanAmount / 10)){
    currentAccount.transactions.push(loanAmount)
    updateUi()
  }
  inputLoanAmount.value = ''
}

btnLoan.addEventListener('click', loanMoney)
