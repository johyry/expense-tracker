# Transaction types and db models

## Types of transactions

Every transaction has following fields:

    id: {
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
            "id": "20092DRVHR",
            "sum": 1234,
            "date": "2020-03-31T21:00:00.000Z",
            "monthlyTransactionId": "1",
            "type": "113 Tilisiirto",
            "sender": "KELA/FPA"
        },

        {
            "id": "20092DRVHR",
            "sum": -1234,
            "date": "2020-03-31T21:00:00.000Z",
            "monthlyTransactionId": "1",
            "type": "213 Tilisiirto",
            "receiver": "KELA/FPA"
        },

### 127, Loan withdrawal

Unique fields:

    lender: {
      type: String,
    },
        {
            id: '20090ZY16F',
            sum: 4321,
            date: 2020-03-29T21:00:00.000Z,
            monthlyTransactionId: '61',
            type: '127 Lainan nosto',
            lender: 'Aktia Pankki Oyj - Aktia Bank Abp'
        }

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
            "id": "20094KL9RS",
            "sum": -4321,
            "date": "2020-04-02T21:00:00.000Z",
            "monthlyTransactionId": "2",
            "type": "209 Korttiosto",
            "shop": "Spotify",
            "location": "Weesp NL"
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
            "id": "20094KFWNV",
            "sum": -3333,
            "date": "2020-04-02T21:00:00.000Z",
            "monthlyTransactionId": "9",
            "type": "256 Verkkomaksu",
            "receiver": "ELISA OYJ"
        },
