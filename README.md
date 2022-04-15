# Interview coding assignment - Assetario

You will be processing, transforming, storing, transforming (again), and displaying some data.

### 1. Input Data

Simplemaps provides multiple geographical datasets, some subsets even free of charge. We will be using database of US cities as our input data.

You can easily download the free dataset from https://simplemaps.com/data/us-cities.


### 2. Storage

Create a database (use any database system you like or want to try) to store state, county, and city names and IDs, and load data from the CSV file.
Data should be stored in de-normalized format.

### 3. Transforming tree

Next you will need to transform data into a tree format (State > County > City)

* Write an algorithm that will output such tree.
* What is the complexity of your algorithm (in big O notation) ?


### 4. Visualizing Data

* Design and build an interface to display this data.
* Add a search component over the data.

<hr/>

# Installation
## Prerequisites

- NodeJs as main programming language
- Docker

## Database

There was nothing fancy to do with the DB, so I picked traditional SQL database for dataset, Postgresql is one of most used DB.
> docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_USER=admin -d postgres

Create `.env` file in the root of application with following (if you are using docker db from above, otherwise use own connection string for your db):
```
NODE_ENV=development
DATABASE_URL="postgresql://admin:mysecretpassword@localhost:5432/mydb?schema=public"
```

## Application
Firstly we need to install all required packages with: 

> npm i

Next step is to migrate and seed the database with:

> npx prisma migrate dev

To run application, firstly you need to build typescript and then run start:

> npm run build

> npm start

# Usage of application

As I do not have much experience with FE GUI's, I decided to use for GUI built in Graphql Studio

## Query

You can use 3 types of query in this app:

### 1. city(id: number) - denormalized city row
Return 1 row from City table by given id

### 2. cities(pageIndex: number, pageSize: number) - paginated denormalized city rows
Return array of cities from City table with pagination - you have to define pageIndex and pageSize

### 3.states(states: string[]?, counties: string[]?, cities: string[]?) - normalized treeSchema
Returns treeSchema of data in State > County > City format. Optionally you can filter data by states, counties and/ or cities.

## Mutation
You can use 3 types of mutation in this app:

### 1. createCity()
Creates one row in City table, create input:

```
interface CityCreate {
  state: string;
  county: string;
  city: string;
}
```

### 2. updateCity()
Updates one row in City table by given id, update input: 
```
interface CityUpdate {
  state?: string;
  county?: string;
  city?: string;
}
```

### 3. deleteCity()
Deletes one row in City table by given id.

# Improvements
## 1. Caching
Graphql should cache on browser by default, but we could improve this by caching with RedisDb.
## 2. ErrorHandling
Better errorHandling, better readability, error message, status codes etc...
## 3. Input validation
Validate inputs before inserting into DB.
## 4. Authorization/ authentication
This is necessary part of every application, but to be honest for such a project it is overkill :).
## 5. Testing
Of course, testing :).

# Complexity
Complexity of algorithm is O(n), it could be transformed into any format lets say from this:
```
interface TreeSchemaOutput {
  [key: string]: {
    counties: {
      [key: string]: {
        cities: {
          [key: string]: {
            id: number;
          }
        }
      }
    }
  }
}
```
To this: 
```
interface TreeSchemaOutput {
  states: {
    name: string;
    counties: {
      name: string;
      cities: {
        name: string;
        id: string
      } []
    } []
  } []
}
```

and it's still be 2 * O(n) = O(n) complexity.

# Used tools, libraries, frameworks
`NodeJs/ Typescript` for main application, doesn't need explanation I think

`GraphQl` for endpoints, because it's something new for me and wanted to try something like this for long time and it has built-in apollo studio for FE gui tool

`Prisma` ORM for DB, in my work experience I used lot of `mongoDB` driver and `sequelize` for SQL databases.
So I wanted to try `prisma` because I heard only good things about it.
It is compatible with typescript which is plus over `sequelize`.
Found out that working with prisma is not that efficient as it seems, there are many problems but one is that the queries are not optimized by `graphql`, that's the reason I used `@paljs/plugins` for query optimization.