# GraphQL + React Event Booking API
learn from [Build a Project with GraphQL, Node, MongoDB](https://www.youtube.com/playlist?list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_)

# Backend Usage
Basic cloud database setting:
1.connecting to [cloud mongodb atlas](https://cloud.mongodb.com/user#/atlas/login):
2. building a new cluster
3. setting mongodb users (at ATLAS CONFIGURATION -> Security -> MongoDB Users), then copy this user name and password into [nodemon.json](https://github.com/zentim/graphql-react-event-booking/blob/master/nodemon.json) update value of `"MONGO_USER"` and `"MONGO_PASSWORD"`
4. setting your current ip into the cluster's IP Whitelist (at ATLAS CONFIGURATION -> Security -> IP Whitelist)  

Install all dependencies:
```sh
npm install
```

Run the server:
```sh
npm start
```

Testing GraphiQL: [http://localhost:8000/graphql](http://localhost:8000/graphql)

# Frontend Usage
Go into the frontend folder: 
```sh
cd ./frontend
```

Install all dependencies:
```sh
npm install
```

Run the web:
```sh
npm start
```
