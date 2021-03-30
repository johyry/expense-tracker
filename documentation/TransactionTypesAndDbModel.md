# Transaction types and db models

## Types of transactions

Every transaction has following fields:

    bankId: {
      type: String,
      unique: true,
    },
    sum: {
      type: Number,
    },
    date: {
      type: Date,
    },
    monthlyTransactionId: {
      type: String,
    },
    type: {
      type: String,
    },
    category: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    mongoId: {
      type: mongoose.Schema.Types.ObjectId,
    }

And in addition each type has few unique fields

### 113 or 213, Bank transfer

113 - received money,
213 - sent money

Unique fields:

    sender: {
      type: String,
    }, OR
    receiver: {
      type: String,
    },

        {
          "kind": "ReceivedBankTransfer",
          "bankId": "20072MVPVW",
          "sum": 300,
          "date": "2020-03-11T22:00:00.000Z",
          "monthlyTransactionId": "33",
          "type": "113 Tilisiirto",
          "category": "",
          "sender": "Some Name",
          "user": {
              "username": "testaaja",
              "id": "60542a787c199d460d9214d9"
          },
          "mongoId": "60542ed29a46e54a10b71ba0"
        },

        {
          "kind": "SentBankTransfer",
          "bankId": "2006441WF7",
          "sum": -3212,
          "date": "2020-03-03T22:00:00.000Z",
          "monthlyTransactionId": "16",
          "type": "213 Tilisiirto",
          "category": "",
          "receiver": "Ylioppilaiden terveydenhoitosäätiö",
          "user": {
              "username": "testaaja",
              "id": "60542a787c199d460d9214d9"
          },
          "mongoId": "60542ed29a46e54a10b71b8f"
        },

### 127, Loan withdrawal

Unique fields:

    lender: {
      type: String,
    },
        {
          "kind": "LoanWithdrawal",
          "bankId": "20090ZY16F",
          "sum": 420,
          "date": "2020-03-29T21:00:00.000Z",
          "monthlyTransactionId": "61",
          "type": "127 Lainan nosto",
          "category": "",
          "lender": "Aktia Pankki Oyj - Aktia Bank Abp",
          "user": {
              "username": "testaaja",
              "id": "60542a787c199d460d9214d9"
          },
          "mongoId": "60542ed29a46e54a10b71bbc"
        },

### 205, Atm withdrawal

Unique fields:

    location: {
      type: String,
    },
        {
            "id": "20106X8819",
            "sum": -1234,
            "date": "2020-04-14T21:00:00.000Z",
            "monthlyTransactionId": "25",
            "type": "205 Automaattinosto",
            "location": "MOMMILANTIE 1 FI"
        }

### 209, Card payment

Unique fields:

    shop: {
      type: String,
    },
    location: {
      type: String,
    },

        {
          "kind": "CardPayment",
          "bankId": "200623TFHK",
          "sum": -2222.6,
          "date": "2020-03-01T22:00:00.000Z",
          "monthlyTransactionId": "4",
          "type": "209 Korttiosto",
          "category": "",
          "shop": "S MARKET",
          "location": "ESPOO FI",
          "user": {
              "username": "testaaja",
              "id": "60542a787c199d460d9214d9"
          },
          "mongoId": "60542ed29a46e54a10b71b83"
        },

### 236, Bank service charge

Unique fields:

    description: {
      type: String,
    },
        {
            "id": "20328QV2CQ",
            "sum": -123,
            "date": "2020-11-22T22:00:00.000Z",
            "monthlyTransactionId": "53",
            "type": "236 Palvelumaksu",
            "description": "KÄYTTÖ- JA PALV.MAKS. 10/2020"
        }

### 256, Web payment

Unique fields:

    receiver: {
      type: String,
    },

        {
        "kind": "WebPayment",
        "bankId": "20064SFXQY",
        "sum": -2221.01,
        "date": "2020-03-03T22:00:00.000Z",
        "monthlyTransactionId": "18",
        "type": "256 Verkkomaksu",
        "category": "",
        "receiver": "ELISA OYJ",
        "user": {
            "username": "testaaja",
            "id": "60542a787c199d460d9214d9"
        },
        "mongoId": "60542ed29a46e54a10b71b91"
        },
