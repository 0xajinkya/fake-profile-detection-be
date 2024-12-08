# Start postgres and create required databases
```bash
    bun startall
```

# Open a terminal and run the following command to start worker
```bash
    bun worker
```

# Database Migration
```bash
    bun db:generate
```

# Generate Types
```bash
    bun db:migrate
```

# Start the server
```bash
    bun dev
```

--------------------------------

# Response Type Of Routes
```ts
    {
        status: boolean,
        content: {
            data: object
        }
    }
```

--------------------------------

# Route - GET /v1/profile/by-host?host=TWITTER&username=xyz
## Response
```json
    {
        "status": true,
        "content": {
            "data": {
            "id": "1a65c3bd-12ed-4b5b-8954-db562f689bee",
            "host": "INSTAGRAM",
            "username": "xyz",
            "prediction": null,
            "remarks": "Not a nice babe!",
            "createdAt": "2024-12-08T16:43:26.290Z",
            "updatedAt": "2024-12-08T16:43:26.290Z"
            }
        }
    }
```

# Route - GET /v1/profile/1a65c3bd-12ed-4b5b-8954-db562f689bee
## Response
```json
    {
        "status": true,
        "content": {
            "data": {
            "id": "1a65c3bd-12ed-4b5b-8954-db562f689bee",
            "host": "INSTAGRAM",
            "username": "minl",
            "prediction": null,
            "remarks": "Not a nice babe!",
            "createdAt": "2024-12-08T16:43:26.290Z",
            "updatedAt": "2024-12-08T16:43:26.290Z"
            }
        }
    }
```

# Route - POST /v1/profile/1a65c3bd-12ed-4b5b-8954-db562f689bee
## Body
```json
    {
        "host": "INSTAGRAM",
        "username": "xyz",
        "prediction": "REAL",
        "remarks": "Not a nice babe!"
    }
```
## Response
```json
    {
        "status": true,
        "content": {
            "data": {
            "id": "1a65c3bd-12ed-4b5b-8954-db562f689bee",
            "host": "INSTAGRAM",
            "username": "minl",
            "prediction": null,
            "remarks": "Not a nice babe!",
            "createdAt": "2024-12-08T16:43:26.290Z",
            "updatedAt": "2024-12-08T16:43:26.290Z"
            }
        }
    }
```
--------------------------------

# Worker
## Publisher
```json
    Publishing PREDICT_PROFILE 52fbd10b-462c-4e04-945d-dda0317682b0 with data {
        id: "de8119fb-8f4e-40da-aff2-13f7d599e758",
        host: "INSTAGRAM",
        username: "xyz",
        prediction: null,
        remarks: "Not a nice babe!",
        createdAt: 2024-12-08T17:03:56.368Z,
        updatedAt: 2024-12-08T17:03:56.368Z,
        feature_vector: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
    }
```

## Subscriber `Job` Object
```json
    {
        id: '52fbd10b-462c-4e04-945d-dda0317682b0',
        name: 'PREDICT_PROFILE',
        data: {
            id: 'de8119fb-8f4e-40da-aff2-13f7d599e758',
            host: 'INSTAGRAM',
            remarks: 'Not a nice babe!',
            username: 'xyz',
            createdAt: '2024-12-08T17:03:56.368Z',
            updatedAt: '2024-12-08T17:03:56.368Z',
            prediction: null,
            feature_vector: [
            1, 2, 3, 4,  5,
            6, 7, 8, 9, 10
            ]
        },
        expire_in_seconds: '900.000000'
    }
``` 
