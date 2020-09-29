# <a href='https://www.apollographql.com/'><img src='https://user-images.githubusercontent.com/841294/53402609-b97a2180-39ba-11e9-8100-812bab86357c.png' height='100' alt='Apollo Server'></a><a href='https://www.quasar.dev/'><img src='https://cdn.quasar.dev/logo/svg/quasar-logo.svg' height='100' alt='Quasar framework'></a>

# Quasar CRUD fullstack SPA (phone book)

Sample SPA(Single Page Application) with quasar framework for frontend and Apollo/GraphQL/MongoDB backend

## Clone src on your PC
```bash
git clone https://github.com/alexxsub/quasar-CRUD-fullstack.git
cd quasar-CRUD-fullstack
```
## Install the dependencies
```bash
npm i
```
### Install MongoDB

see manual (https://docs.mongodb.com/manual/installation/)  


### Start backend 
app configured without login and password to MongoDB

```bash
npm run server
```
open url in browser to GraphQL playground [http://localhost:4000/graphql](http://localhost:4000/graphql)

### Start the SPA WEB interface in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
npm run lint
```

### Build the SPA for production
```bash
quasar build
```

### Start the SPA WEB interface from builded SPA (like production )
```bash
npm run web
```
## Demo
**App supports subscribes from Apollo server**

# Open 2,3,4 ... windows of app.  The results of any CRUD actions in one window will be displayed in anothers. WOW! Amazing? Simple! :)

![Output sample](https://github.com/alexxsub/quasar-CRUD-fullstack/blob/master/screenshots/sub.gif)

## Screens of features UI
**Main table of records**
<p float="left">
        <kbd>
<img src="screenshots/main.png" border="1" alt="Main screen"
        title="Main screen"  />
                </kbd>
</p>

**Add new record**
<p float="left">
	<kbd>
<img src="screenshots/add_record.png" border="1" alt="Add record"
	title="Add record"  />
		</kbd>
</p>

**Update record**
<p float="left">
	<kbd>
<img src="screenshots/update_record.png" border="1" alt="Update record"
	title="Update record"  />
		</kbd>
</p>

**Delete record**
<p float="left">
	<kbd>
<img src="screenshots/delete_record.png" border="1" alt="Delete record"
	title="Delete record"  />
		</kbd>
</p>

**i18n Internationalization (4 languages:Russian,English,Deutsche,Français)**
<p float="left">
	<kbd>
<img src="screenshots/i18n.png" border="1" alt="Internationalization"
	title="Internationalization"  />
		</kbd>
</p>


### Quasar Framework
See [Quasar](https://quasar.dev).
