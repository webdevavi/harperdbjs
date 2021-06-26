# HarperDB.js 🚀

A Javascript helper library written in Typescript to work with HarperDB easily.

<img src="https://img.shields.io/apm/l/atomic-design-ui.svg?style=for-the-badge" style="display:inline-block"></img>
<img src="https://img.shields.io/david/dev/webdevavi/harperdbjs?style=for-the-badge" style="display:inline-block"></img>
<img src="https://img.shields.io/github/v/release/webdevavi/harperdbjs?style=for-the-badge" style="display:inline-block"></img>
<img src="https://img.shields.io/npm/dy/harperdbjs?style=for-the-badge" style="display:inline-block"></img>

## Installation 📥

#### Install with npm

```bash
  npm i harperdbjs
```

#### Install with yarn

```bash
  yarn add harperdbjs
```

## Usage 🛠

> See complete [**documentation**](https://harperdbjs.webdevavi.com)

### Authentication 🛡

First you need to initialize the HarperDB class with either your username & password or your token.

See [documentation](https://harperdb.io/developers/documentation/security/authentication/) for more details on authentication.

- with username and password

```javascript
import { HarperDB } from "harperdbjs"

const db = new HarperDB({
  url: "http://localhost:9925", // your local or cloud harperdb instance's url
  username: "jane-doe", // username for your harperdb instance
  password: "secure-password", // password for your harperdb instance
})
```

- with token

```javascript
import { HarperDB } from "harperdbjs"

const db = new HarperDB({
  url: "http://localhost:9925", // your local or cloud harperdb instance's url
  token: "HHJSjddnnss=", // your username and password buffer token
})
```

Now you can use the `db` methods like `db.createSchema`, `db.insert`, etc.

### Example 📚

#### Creating a schema

```javascript
const schema = "dev"

await db.createSchema(schema)
```

#### Creating a table

```javascript
const schema = "dev"
const table = "test"

await db.createTable({ schema, table })
```

#### Inserting a record into a table

```javascript
const schema = "my-company"
const table = "users"
const user = {
  name: "Jane Doe",
  contact: 9999999999,
  email: "jane@doe.com",
}

await db.insert(user, { schema, table })
```

#### Deleting a record from a table

```javascript
const schema = "my-company"
const table = "users"
const userId = "user-1"

await db.deleteOne(userId, { schema, table })
```

#### Searching for records with conditions

```javascript
const schema = "my-company"
const table = "users"

await db.searchByConditions(
  [
    {
      searchAttribute: "name",
      searchType: "contains",
      searchValue: "Jane",
    },
    {
      searchAttribute: "name",
      searchType: "contains",
      searchValue: "Doe",
    },
  ],
  { schema, table, operator: "or" }
)
```

## Support 💯

For support, create an [issue](https://github.com/webdevavi/harperdbjs/issues/new) or [email](mailto:savinash2608@gmail.com).

## Contributing 🙏

Contributions are always welcome!

See [`contributing.md`](/contributing.md) for ways to get started.

## Authors 👋

- [@webdevavi](https://www.github.com/webdevavi)

## License 📃

MIT License

Copyright (c) 2021 Avinash Sinha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
